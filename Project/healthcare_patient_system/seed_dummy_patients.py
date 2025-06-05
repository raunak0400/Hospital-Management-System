# dummy_data.py
from pymongo import MongoClient
import config
import uuid

client = MongoClient(config.MONGO_URI)
db = client[config.DB_NAME]
patients_collection = db['patients']

dummy_patients = [
    {
        "patient_id": str(uuid.uuid4()),
        "name": "Alice Johnson",
        "age": 34,
        "gender": "Female",
        "contact": "9876543210",
        "medical_history": ["Diabetes", "Asthma"]
    },
    {
        "patient_id": str(uuid.uuid4()),
        "name": "Bob Singh",
        "age": 45,
        "gender": "Male",
        "contact": "9898989898",
        "medical_history": ["Hypertension"]
    },
    {
        "patient_id": str(uuid.uuid4()),
        "name": "Carol Sharma",
        "age": 29,
        "gender": "Female",
        "contact": "9123456789",
        "medical_history": ["Diabetes"]
    }
    # ➕ Add more entries here
]

patients_collection.insert_many(dummy_patients)
print("Dummy data inserted successfully.")
