import jwt

# Your secret key (same as in your Flask config)
SECRET_KEY = "04002966"

# Payload: information you want to store inside the token
payload = {
    "user": "doctor1",
    "role": "doctor"
}

# Generate token
token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

print("JWT Token:")
print(token)
