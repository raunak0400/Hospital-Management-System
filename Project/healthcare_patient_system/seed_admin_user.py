from pymongo import MongoClient
from werkzeug.security import generate_password_hash

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["healthcare_db"]
users = db["users"]

# Check if any users already exist
if users.count_documents({}) > 0:
    print("✅ Users already exist in the database. No action taken.")
else:
    # Create a default admin user
    email = "raunakkumarjha233@.com"
    password = "04002966"
    hashed_password = generate_password_hash(password)

    user_data = {
        "email": email,
        "password": hashed_password,
        "role": "admin"
    }

    users.insert_one(user_data)
    print("✅ Default admin user inserted:")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
