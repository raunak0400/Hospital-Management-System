from bson.objectid import ObjectId
from flask import Flask, jsonify, request, abort, send_file
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, ConnectionFailure
import config
import uuid
import jwt
import bcrypt
import datetime
import logging
import os
import json
import csv
import io
import re
from functools import wraps
from flask_cors import CORS
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
# from flask_compress import Compress
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(config)

# Initialize extensions
CORS(app)
# Compress(app)
# limiter = Limiter(
#     app=app,
#     key_func=get_remote_address,
#     default_limits=["200 per day", "50 per hour"]
# )

SECRET_KEY = config.JWT_SECRET_KEY

# File upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ------------------------
# Utility Functions
# ------------------------

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone) is not None

def log_audit(action, user_id, details):
    """Log audit trail for security and compliance"""
    audit_entry = {
        'action': action,
        'user_id': user_id,
        'timestamp': datetime.datetime.utcnow(),
        'ip_address': request.remote_addr,
        'user_agent': request.headers.get('User-Agent'),
        'details': details
    }
    db['audit_logs'].insert_one(audit_entry)

def generate_patient_id():
    """Generate unique patient ID"""
    return f"PAT-{datetime.datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

# ------------------------
# Auth Decorators
# ------------------------

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Token missing'}), 401

        try:
            token = auth_header.split()[1]
        except IndexError:
            return jsonify({'error': 'Invalid token format'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated

def role_required(role):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if request.user.get('role') != role:
                return jsonify({'error': f'{role} access only'}), 403
            return f(*args, **kwargs)
        return wrapped
    return decorator

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.user.get('role') not in ['admin', 'doctor']:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated

# MongoDB Connection
try:
    client = MongoClient(config.MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test the connection
    client.admin.command('ping')
    logger.info("Successfully connected to MongoDB")
except ConnectionFailure as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    raise

db = client[config.DB_NAME]
patients_collection = db['patients']
users_collection = db['users']
appointments_collection = db['appointments']
medical_records_collection = db['medical_records']
audit_logs_collection = db['audit_logs']
notifications_collection = db['notifications']

# Create indexes for better performance
try:
    patients_collection.create_index("firstName", background=True)
    patients_collection.create_index("lastName", background=True)
    patients_collection.create_index("phone", background=True)
    patients_collection.create_index("email", background=True)
    patients_collection.create_index("createdAt", background=True)
    users_collection.create_index("email", unique=True, background=True)
    logger.info("Database indexes created successfully")
except Exception as e:
    logger.error(f"Error creating indexes: {e}")

# ------------------------
# Auth Routes
# ------------------------

@app.route('/api/auth/register', methods=['POST'])
# @limiter.limit("5 per minute")
def register():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()

        # Validation
        if not email or not password or not name:
            return jsonify({"error": "Missing required fields: name, email, or password"}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400

        if '@' not in email:
            return jsonify({"error": "Invalid email format"}), 400

        # Check if user already exists
        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 409

        # Hash password with configurable rounds
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(config.BCRYPT_LOG_ROUNDS))
        
        user = {
            "name": name,
            "email": email,
            "password": hashed_pw,
            "role": data.get("role", "staff"),
            "createdAt": datetime.datetime.utcnow(),
            "lastLogin": None,
            "isActive": True
        }

        result = users_collection.insert_one(user)
        
        # Generate token for immediate login
        token = jwt.encode({
            'user_id': str(result.inserted_id),
            'email': user['email'],
            'name': user['name'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({
            "token": token,
            "user": {
                "id": str(result.inserted_id),
                "name": user['name'],
                "email": user['email'],
                "role": user['role']
            },
            "message": "User registered successfully"
        }), 201
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({"error": "Registration failed"}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        user = users_collection.find_one({"email": email})

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            token = jwt.encode({
                'user_id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'role': user['role'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm='HS256')

            return jsonify({
                "token": token,
                "user": {
                    "id": str(user['_id']),
                    "name": user['name'],
                    "email": user['email'],
                    "role": user['role']
                },
                "message": "Login successful!"
            })

        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"error": "Login failed"}), 500

# ------------------------
# Patient Routes
# ------------------------

@app.route('/api/patients', methods=['GET'])
@token_required
def get_patients():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    search = request.args.get('search', '')
    sort_by = request.args.get('sortBy', 'createdAt')
    sort_order = request.args.get('sortOrder', 'desc')
    
    skip = (page - 1) * limit
    sort_direction = -1 if sort_order == 'desc' else 1
    
    # Build search filter
    search_filter = {}
    if search:
        search_filter = {
            '$or': [
                {'firstName': {'$regex': search, '$options': 'i'}},
                {'lastName': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}},
                {'phone': {'$regex': search, '$options': 'i'}}
            ]
        }
    
    # Get total count
    total = patients_collection.count_documents(search_filter)
    
    # Get patients with pagination and sorting
    patients = list(patients_collection.find(
        search_filter,
        {'password': 0}  # Exclude password field
    ).sort(sort_by, sort_direction).skip(skip).limit(limit))
    
    # Convert ObjectId to string for JSON serialization
    for patient in patients:
        patient['_id'] = str(patient['_id'])
        if 'createdAt' in patient:
            patient['createdAt'] = patient['createdAt'].isoformat()
        if 'updatedAt' in patient:
            patient['updatedAt'] = patient['updatedAt'].isoformat()
    
    return jsonify({
        "patients": patients,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit
    })

@app.route('/api/patients/<patient_id>', methods=['GET'])
@token_required
def get_patient(patient_id):
    try:
        patient = patients_collection.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            return jsonify({"message": "Patient not found"}), 404
        
        patient['_id'] = str(patient['_id'])
        if 'createdAt' in patient:
            patient['createdAt'] = patient['createdAt'].isoformat()
        if 'updatedAt' in patient:
            patient['updatedAt'] = patient['updatedAt'].isoformat()
        
        return jsonify(patient)
    except Exception as e:
        return jsonify({"message": "Invalid patient ID"}), 400

@app.route('/api/patients', methods=['POST'])
@token_required
def create_patient():
    data = request.json
    
    # Add timestamps
    data['createdAt'] = datetime.datetime.utcnow()
    data['updatedAt'] = datetime.datetime.utcnow()
    
    result = patients_collection.insert_one(data)
    
    return jsonify({
        "message": "Patient created successfully",
        "patient_id": str(result.inserted_id)
    }), 201

@app.route('/api/patients/<patient_id>', methods=['PUT'])
@token_required
def update_patient(patient_id):
    try:
        update_data = request.json
        update_data['updatedAt'] = datetime.datetime.utcnow()
        
        result = patients_collection.update_one(
            {"_id": ObjectId(patient_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"message": "Patient not found"}), 404

        return jsonify({"message": "Patient updated successfully"})
    except Exception as e:
        return jsonify({"message": "Invalid patient ID"}), 400

@app.route('/api/patients/<patient_id>', methods=['DELETE'])
@token_required
def delete_patient(patient_id):
    try:
        result = patients_collection.delete_one({"_id": ObjectId(patient_id)})

        if result.deleted_count == 0:
            return jsonify({"message": "Patient not found"}), 404

        return jsonify({"message": "Patient deleted successfully"})
    except Exception as e:
        return jsonify({"message": "Invalid patient ID"}), 400

# ------------------------
# Notifications Routes
# ------------------------

@app.route('/api/notifications', methods=['GET'])
@token_required
def get_notifications():
    try:
        user_id = request.user['user_id']
        notifications = list(db['notifications'].find({
            "user_id": user_id,
            "read": False
        }).sort('created_at', -1).limit(50))
        
        for notification in notifications:
            notification['_id'] = str(notification['_id'])
            notification['created_at'] = notification['created_at'].isoformat()
        
        return jsonify({"notifications": notifications})
    except Exception as e:
        logger.error(f"Get notifications error: {e}")
        return jsonify({"error": "Failed to fetch notifications"}), 500

@app.route('/api/notifications/<notification_id>/read', methods=['PUT'])
@token_required
def mark_notification_read(notification_id):
    try:
        result = db['notifications'].update_one(
            {"_id": ObjectId(notification_id), "user_id": request.user['user_id']},
            {"$set": {"read": True}}
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Notification marked as read"})
        return jsonify({"error": "Notification not found"}), 404
    except Exception as e:
        logger.error(f"Mark notification read error: {e}")
        return jsonify({"error": "Failed to mark notification as read"}), 500

# ------------------------
# File Upload Routes
# ------------------------

@app.route('/api/upload/patient-document', methods=['POST'])
@token_required
def upload_patient_document():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        patient_id = request.form.get('patient_id')
        
        if not patient_id:
            return jsonify({"error": "Patient ID required"}), 400
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_filename = f"{patient_id}_{timestamp}_{filename}"
            
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            
            # Save file record to database
            file_record = {
                'patient_id': patient_id,
                'filename': unique_filename,
                'original_filename': filename,
                'file_path': file_path,
                'file_size': os.path.getsize(file_path),
                'uploaded_by': request.user['user_id'],
                'uploaded_at': datetime.datetime.utcnow(),
                'file_type': filename.rsplit('.', 1)[1].lower()
            }
            
            db['patient_documents'].insert_one(file_record)
            
            # Log audit
            log_audit('document_upload', request.user['user_id'], {
                'patient_id': patient_id,
                'filename': filename
            })
            
            return jsonify({
                "message": "File uploaded successfully",
                "filename": unique_filename
            })
        
        return jsonify({"error": "File type not allowed"}), 400
    except Exception as e:
        logger.error(f"File upload error: {e}")
        return jsonify({"error": "Failed to upload file"}), 500

@app.route('/api/patients/<patient_id>/documents', methods=['GET'])
@token_required
def get_patient_documents(patient_id):
    try:
        documents = list(db['patient_documents'].find({"patient_id": patient_id}).sort('uploaded_at', -1))
        
        for doc in documents:
            doc['_id'] = str(doc['_id'])
            doc['uploaded_at'] = doc['uploaded_at'].isoformat()
        
        return jsonify({"documents": documents})
    except Exception as e:
        logger.error(f"Get patient documents error: {e}")
        return jsonify({"error": "Failed to fetch documents"}), 500

# ------------------------
# Advanced Search Routes
# ------------------------

@app.route('/api/search/advanced', methods=['POST'])
@token_required
def advanced_search():
    try:
        data = request.json
        query = {}
        
        # Build complex search query
        if data.get('name'):
            query['$or'] = [
                {'firstName': {'$regex': data['name'], '$options': 'i'}},
                {'lastName': {'$regex': data['name'], '$options': 'i'}}
            ]
        
        if data.get('email'):
            query['email'] = {'$regex': data['email'], '$options': 'i'}
        
        if data.get('phone'):
            query['phone'] = {'$regex': data['phone'], '$options': 'i'}
        
        if data.get('status'):
            query['status'] = data['status']
        
        if data.get('gender'):
            query['gender'] = data['gender']
        
        if data.get('age_range'):
            min_age = data['age_range'].get('min', 0)
            max_age = data['age_range'].get('max', 120)
            query['age'] = {'$gte': min_age, '$lte': max_age}
        
        if data.get('medical_history'):
            query['medicalHistory'] = {'$in': data['medical_history']}
        
        if data.get('date_range'):
            start_date = datetime.datetime.fromisoformat(data['date_range']['start'])
            end_date = datetime.datetime.fromisoformat(data['date_range']['end'])
            query['createdAt'] = {'$gte': start_date, '$lte': end_date}
        
        # Execute search
        patients = list(patients_collection.find(query).limit(100))
        
        for patient in patients:
            patient['_id'] = str(patient['_id'])
            if 'createdAt' in patient:
                patient['createdAt'] = patient['createdAt'].isoformat()
        
        return jsonify({
            "patients": patients,
            "total": len(patients),
            "query": data
        })
    except Exception as e:
        logger.error(f"Advanced search error: {e}")
        return jsonify({"error": "Search failed"}), 500

# ------------------------
# Advanced Analytics Routes
# ------------------------

@app.route('/api/analytics/revenue', methods=['GET'])
@token_required
@role_required('admin') # Assuming admin role for revenue analytics
def get_revenue_analytics():
    try:
        # Mock revenue data - in real system, this would come from billing system
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m",
                            "date": "$createdAt"
                        }
                    },
                    "revenue": {"$sum": 100},  # Mock $100 per patient
                    "patient_count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        
        result = list(patients_collection.aggregate(pipeline))
        return jsonify({"revenue_data": result})
    except Exception as e:
        logger.error(f"Revenue analytics error: {e}")
        return jsonify({"error": "Failed to fetch revenue data"}), 500

@app.route('/api/analytics/doctor-performance', methods=['GET'])
@token_required
@role_required('admin') # Assuming admin role for doctor performance
def get_doctor_performance():
    try:
        # Mock doctor performance data
        doctors = list(users_collection.find({"role": "doctor"}))
        
        performance_data = []
        for doctor in doctors:
            # Count patients assigned to doctor
            patient_count = patients_collection.count_documents({
                "assigned_doctor": str(doctor['_id'])
            })
            
            # Count appointments
            appointment_count = db['appointments'].count_documents({
                "doctor_id": str(doctor['_id'])
            })
            
            performance_data.append({
                "doctor_id": str(doctor['_id']),
                "doctor_name": doctor['name'],
                "patient_count": patient_count,
                "appointment_count": appointment_count,
                "efficiency_score": min(100, (patient_count + appointment_count) * 2)
            })
        
        return jsonify({"doctor_performance": performance_data})
    except Exception as e:
        logger.error(f"Doctor performance error: {e}")
        return jsonify({"error": "Failed to fetch doctor performance"}), 500

@app.route('/api/analytics/patient-satisfaction', methods=['GET'])
@token_required
def get_patient_satisfaction():
    try:
        # Mock satisfaction data
        satisfaction_data = [
            {"month": "2024-01", "satisfaction_score": 4.2, "response_count": 45},
            {"month": "2024-02", "satisfaction_score": 4.5, "response_count": 52},
            {"month": "2024-03", "satisfaction_score": 4.3, "response_count": 38},
            {"month": "2024-04", "satisfaction_score": 4.7, "response_count": 61},
            {"month": "2024-05", "satisfaction_score": 4.4, "response_count": 47}
        ]
        
        return jsonify({"satisfaction_data": satisfaction_data})
    except Exception as e:
        logger.error(f"Patient satisfaction error: {e}")
        return jsonify({"error": "Failed to fetch satisfaction data"}), 500

# ------------------------
# System Management Routes
# ------------------------

@app.route('/api/admin/users', methods=['GET'])
@token_required
@role_required('admin') # Assuming admin role for user management
def get_all_users():
    try:
        users = list(users_collection.find({}, {'password': 0}))
        
        for user in users:
            user['_id'] = str(user['_id'])
            user['createdAt'] = user['createdAt'].isoformat()
            if user.get('lastLogin'):
                user['lastLogin'] = user['lastLogin'].isoformat()
        
        return jsonify({"users": users})
    except Exception as e:
        logger.error(f"Get users error: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500

@app.route('/api/admin/audit-logs', methods=['GET'])
@token_required
@role_required('admin') # Assuming admin role for audit logs
def get_audit_logs():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        action_filter = request.args.get('action', '')
        
        skip = (page - 1) * limit
        
        filter_query = {}
        if action_filter:
            filter_query['action'] = action_filter
        
        total = db['audit_logs'].count_documents(filter_query)
        logs = list(db['audit_logs'].find(filter_query).sort('timestamp', -1).skip(skip).limit(limit))
        
        for log in logs:
            log['_id'] = str(log['_id'])
            log['timestamp'] = log['timestamp'].isoformat()
        
        return jsonify({
            "logs": logs,
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": (total + limit - 1) // limit
        })
    except Exception as e:
        logger.error(f"Get audit logs error: {e}")
        return jsonify({"error": "Failed to fetch audit logs"}), 500

@app.route('/api/admin/system-stats', methods=['GET'])
@token_required
@role_required('admin') # Assuming admin role for system stats
def get_system_stats():
    try:
        # Database stats
        db_stats = db.command("dbStats")
        
        # Collection stats
        collections = ['patients', 'users', 'appointments', 'medical_records', 'audit_logs']
        collection_stats = {}
        
        for collection in collections:
            try:
                stats = db[collection].aggregate([
                    {"$group": {"_id": None, "count": {"$sum": 1}, "avg_size": {"$avg": {"$bsonSize": "$$ROOT"}}}}
                ]).next()
                collection_stats[collection] = {
                    "count": stats['count'],
                    "avg_size_bytes": stats['avg_size']
                }
            except:
                collection_stats[collection] = {"count": 0, "avg_size_bytes": 0}
        
        # System info
        system_info = {
            "database_size_mb": round(db_stats['dataSize'] / (1024 * 1024), 2),
            "storage_size_mb": round(db_stats['storageSize'] / (1024 * 1024), 2),
            "index_size_mb": round(db_stats['indexSize'] / (1024 * 1024), 2),
            "collections": collection_stats,
            "uptime_seconds": db_stats.get('uptime', 0),
            "connections": db_stats.get('connections', {}),
            "version": db_stats.get('version', 'Unknown')
        }
        
        return jsonify({"system_stats": system_info})
    except Exception as e:
        logger.error(f"System stats error: {e}")
        return jsonify({"error": "Failed to fetch system stats"}), 500

# ------------------------
# Backup and Maintenance Routes
# ------------------------

@app.route('/api/admin/backup', methods=['POST'])
@token_required
@role_required('admin') # Assuming admin role for backup
def create_backup():
    try:
        # Create backup timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"healthcare_backup_{timestamp}"
        
        # In a real system, this would create an actual database backup
        # For now, we'll create a JSON export
        backup_data = {
            "timestamp": timestamp,
            "patients": list(patients_collection.find({})),
            "users": list(users_collection.find({}, {'password': 0})),
            "appointments": list(db['appointments'].find({})),
            "medical_records": list(db['medical_records'].find({}))
        }
        
        # Convert ObjectIds to strings for JSON serialization
        for collection_name, documents in backup_data.items():
            if collection_name != "timestamp":
                for doc in documents:
                    doc['_id'] = str(doc['_id'])
                    if 'createdAt' in doc:
                        doc['createdAt'] = doc['createdAt'].isoformat()
                    if 'updatedAt' in doc:
                        doc['updatedAt'] = doc['updatedAt'].isoformat()
        
        # Save backup to file
        backup_file = f"backups/{backup_name}.json"
        os.makedirs("backups", exist_ok=True)
        
        with open(backup_file, 'w') as f:
            json.dump(backup_data, f, indent=2)
        
        # Log audit
        log_audit('backup_created', request.user['user_id'], {
            'backup_name': backup_name,
            'file_path': backup_file
        })
        
        return jsonify({
            "message": "Backup created successfully",
            "backup_name": backup_name,
            "file_path": backup_file
        })
    except Exception as e:
        logger.error(f"Backup creation error: {e}")
        return jsonify({"error": "Failed to create backup"}), 500

@app.route('/api/admin/maintenance', methods=['POST'])
@token_required
@role_required('admin') # Assuming admin role for maintenance
def run_maintenance():
    try:
        maintenance_tasks = []
        
        # Clean up old audit logs (older than 1 year)
        one_year_ago = datetime.datetime.utcnow() - datetime.timedelta(days=365)
        old_logs_result = db['audit_logs'].delete_many({
            "timestamp": {"$lt": one_year_ago}
        })
        maintenance_tasks.append(f"Cleaned {old_logs_result.deleted_count} old audit logs")
        
        # Update database indexes
        try:
            patients_collection.create_index("patient_id", unique=True, background=True)
            maintenance_tasks.append("Updated patient indexes")
        except:
            pass
        
        # Optimize collections
        try:
            db.command("compact", "patients")
            maintenance_tasks.append("Optimized patients collection")
        except:
            pass
        
        # Log audit
        log_audit('maintenance_run', request.user['user_id'], {
            'tasks_completed': maintenance_tasks
        })
        
        return jsonify({
            "message": "Maintenance completed successfully",
            "tasks_completed": maintenance_tasks
        })
    except Exception as e:
        logger.error(f"Maintenance error: {e}")
        return jsonify({"error": "Maintenance failed"}), 500

# ------------------------
# Health Check Route
# ------------------------

@app.route('/')
def home():
    return jsonify({
        "message": "Healthcare Patient Management System Backend is Running!",
        "status": "healthy",
        "version": "2.0.0"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        client.admin.command('ping')
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.datetime.utcnow().isoformat()
        })
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }), 503

# ------------------------
# Error Handlers
# ------------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(429)
def ratelimit_handler(error):
    return jsonify({"error": "Rate limit exceeded"}), 429

# ------------------------
# Run the App
# ------------------------

if __name__ == '__main__':
    app.run(
        debug=config.DEBUG, 
        host='0.0.0.0', 
        port=int(os.getenv('PORT', 5000))
    )