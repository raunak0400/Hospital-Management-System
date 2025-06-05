from bson.objectid import ObjectId
from flask import Flask, jsonify, request
from pymongo import MongoClient
import config
import uuid
import jwt
import bcrypt
import datetime
from functools import wraps
from flask_cors import CORS # Import CORS here

SECRET_KEY = "04002966"  # Change this to something long & secure


app = Flask(__name__)
CORS(app) # Initialize CORS here

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
            # Split "Bearer <token>"
            token = auth_header.split()[1]
        except IndexError:
            return jsonify({'error': 'Invalid token format'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError as e:
            print("JWT Error:", e)  # Add this for debug
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
client = MongoClient(config.MONGO_URI)
db = client[config.DB_NAME]
patients_collection = db['patients']
# Ensure indexes for optimized search
patients_collection.create_index("name", background=True)
patients_collection.create_index("contact", background=True)
patients_collection.create_index("medical_history", background=True)


# Home Route
@app.route('/')
def home():
    return "Healthcare Patient Management System Backend is Connected to MongoDB!"

# Insert Patient Route
@app.route('/patients', methods=['POST'])
@token_required
@role_required('doctor')
def add_patient():
    data = request.json
    data["patient_id"] = str(uuid.uuid4())  # generate unique ID
    result = patients_collection.insert_one(data)
    return jsonify(message="Patient added", patient_id=str(result.inserted_id)), 201

# Search Patient Route
@app.route('/search', methods=['GET'])
def search_patient():
    query_params = request.args
    search_filter = {}

    # Pagination defaults
    page = int(query_params.get('page', 1))
    limit = int(query_params.get('limit', 5))
    skip = (page - 1) * limit

    # Filters
    if 'name' in query_params:
        search_filter['name'] = {'$regex': query_params['name'], '$options': 'i'}
    if 'contact' in query_params:
        search_filter['contact'] = {'$regex': query_params['contact'], '$options': 'i'}
    if 'condition' in query_params:
        search_filter['medical_history'] = {'$in': [query_params['condition']]}

    total_patients = patients_collection.count_documents(search_filter)
    patients = list(patients_collection.find(search_filter, {'_id': 0}).skip(skip).limit(limit))

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total_patients,
        "results": patients
    })


# ✅ Update Patient Route (must be before app.run)
@app.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    update_data = request.json
    try:
        result = patients_collection.update_one(
            {"_id": ObjectId(patient_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Patient not found"}), 404

        return jsonify({"message": "Patient record updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete Patient Record using _id
@app.route('/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        result = patients_collection.delete_one({"_id": ObjectId(patient_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Patient not found"}), 404

        return jsonify({"message": "Patient deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/analytics/conditions', methods=['GET'])
def analytics_by_conditions():
    pipeline = [
        {"$unwind": "$medical_history"},
        {"$group": {"_id": "$medical_history", "count": {"$sum": 1}}},
        {"$project": {"condition": "$_id", "count": 1, "_id": 0}}
    ]
    result = list(patients_collection.aggregate(pipeline))
    return jsonify(result)


@app.route('/analytics/gender', methods=['GET'])
def analytics_by_gender():
    pipeline = [
        {"$group": {"_id": "$gender", "count": {"$sum": 1}}},
        {"$project": {"gender": "$_id", "count": 1, "_id": 0}}
    ]
    result = list(patients_collection.aggregate(pipeline))
    return jsonify(result)

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    # The frontend is sending 'name', 'email', 'password', 'confirmPassword'
    # Your backend expects 'username' and 'password'.
    # Adjust this to match your frontend's formData.
    # Let's map 'email' from frontend to 'username' on backend.
    username = data.get('email') # Use email from frontend as username
    password = data.get('password')
    name = data.get('name') # You might want to store name as well

    if not username or not password or not name: # Check for all expected fields
        return jsonify({"msg": "Missing data: name, email, or password"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user = {
        "username": username,
        "password": hashed_pw,
        "name": name, # Store the name
        "role": data.get("role", "receptionist")  # default to receptionist
    }

    if db.users.find_one({"username": user['username']}):
        return jsonify({"msg": "Email already exists"}), 409 # Changed 'error' to 'msg' and 400 to 409

    db.users.insert_one(user)
    return jsonify({"msg": "User registered successfully"}), 201 # Changed 'message' to 'msg'

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    # Frontend sends 'email' and 'password'.
    username = data.get('email') # Use email from frontend as username
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = db.users.find_one({"username": username})

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = jwt.encode({
            'username': user['username'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"access_token": token, "msg": "Login successful!"}) # Changed 'token' to 'access_token' to match frontend

    return jsonify({"msg": "Invalid credentials"}), 401 # Changed 'error' to 'msg'

#nurse route
@app.route('/nurse/patient/<patient_id>/vitals', methods=['PUT'])
@token_required
@role_required('nurse')
def update_vitals(patient_id):
    data = request.json
    result = patients_collection.update_one(
        {"_id": ObjectId(patient_id)},
        {"$set": {"vitals": data}}
    )
    if result.modified_count:
        return jsonify({"message": "Vitals updated successfully"})
    return jsonify({"error": "Patient not found or no update made"}), 404


# Receptionist Route
@app.route('/receptionist/patient', methods=['POST'])
@token_required
@role_required('receptionist')
def add_patient_receptionist():
    data = request.json
    data["patient_id"] = str(uuid.uuid4())
    result = patients_collection.insert_one(data)
    return jsonify({"message": "Patient added by receptionist", "patient_id": str(result.inserted_id)}), 201

@app.route('/delete_user', methods=['DELETE'])
def delete_user():
    data = request.json
    username = data.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    result = db.users.delete_one({"username": username})
    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": f"User '{username}' deleted successfully"}), 200
@app.route('/admin/users', methods=['GET'])
@token_required
@role_required('admin')
def get_all_users():
    users = list(db.users.find({}, {'_id': 0, 'password': 0}))
    return jsonify(users)

# Run the App
if __name__ == '__main__':
    app.run(debug=True, port=5000) # Explicitly set port 5000 for clarity