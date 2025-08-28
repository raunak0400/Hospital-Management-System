from bson.objectid import ObjectId
from flask import Flask, jsonify, request, abort
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, ConnectionFailure
import config
import uuid
import jwt
import bcrypt
import datetime
import logging
import os
from functools import wraps
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_compress import Compress

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(config)

# Initialize extensions
CORS(app)
Compress(app)
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

SECRET_KEY = config.JWT_SECRET_KEY

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
@limiter.limit("5 per minute")
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

@app.route('/api/auth/login', methods=['POST'])
def login():
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
# Analytics Routes
# ------------------------

@app.route('/api/analytics/dashboard', methods=['GET'])
@token_required
def get_dashboard_stats():
    total_patients = patients_collection.count_documents({})
    
    # Get patients added in last 30 days
    thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
    new_patients = patients_collection.count_documents({
        "createdAt": {"$gte": thirty_days_ago}
    })
    
    # Get active patients (status = 'active')
    active_patients = patients_collection.count_documents({"status": "active"})
    
    # Get critical patients (status = 'critical')
    critical_patients = patients_collection.count_documents({"status": "critical"})
    
    return jsonify({
        "totalPatients": total_patients,
        "newPatients": new_patients,
        "activePatients": active_patients,
        "criticalPatients": critical_patients
    })

@app.route('/api/analytics/gender', methods=['GET'])
@token_required
def get_gender_distribution():
    pipeline = [
        {"$group": {"_id": "$gender", "value": {"$sum": 1}}},
        {"$project": {"name": "$_id", "value": 1, "_id": 0}}
    ]
    result = list(patients_collection.aggregate(pipeline))
    return jsonify(result)

@app.route('/api/analytics/age', methods=['GET'])
@token_required
def get_age_distribution():
    pipeline = [
        {
            "$addFields": {
                "age": {
                    "$floor": {
                        "$divide": [
                            {"$subtract": [datetime.datetime.utcnow(), "$dateOfBirth"]},
                            365 * 24 * 60 * 60 * 1000
                        ]
                    }
                }
            }
        },
        {
            "$bucket": {
                "groupBy": "$age",
                "boundaries": [0, 18, 30, 50, 65, 100],
                "default": "65+",
                "output": {"value": {"$sum": 1}}
            }
        },
        {
            "$project": {
                "name": {
                    "$switch": {
                        "branches": [
                            {"case": {"$eq": ["$_id", 0]}, "then": "0-17"},
                            {"case": {"$eq": ["$_id", 18]}, "then": "18-29"},
                            {"case": {"$eq": ["$_id", 30]}, "then": "30-49"},
                            {"case": {"$eq": ["$_id", 50]}, "then": "50-64"}
                        ],
                        "default": "65+"
                    }
                },
                "value": 1,
                "_id": 0
            }
        }
    ]
    result = list(patients_collection.aggregate(pipeline))
    return jsonify(result)

@app.route('/api/analytics/diseases', methods=['GET'])
@token_required
def get_disease_distribution():
    pipeline = [
        {"$unwind": "$medicalHistory"},
        {"$group": {"_id": "$medicalHistory", "value": {"$sum": 1}}},
        {"$project": {"name": "$_id", "value": 1, "_id": 0}},
        {"$sort": {"value": -1}},
        {"$limit": 10}
    ]
    result = list(patients_collection.aggregate(pipeline))
    return jsonify(result)

@app.route('/api/analytics/patients-over-time', methods=['GET'])
@token_required
def get_patients_over_time():
    # Get patients added in last 7 days
    pipeline = [
        {
            "$match": {
                "createdAt": {
                    "$gte": datetime.datetime.utcnow() - datetime.timedelta(days=7)
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$createdAt"
                    }
                },
                "value": {"$sum": 1}
            }
        },
        {
            "$project": {
                "name": "$_id",
                "value": 1,
                "_id": 0
            }
        },
        {"$sort": {"name": 1}}
    ]
    result = list(patients_collection.aggregate(pipeline))
    return jsonify(result)

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