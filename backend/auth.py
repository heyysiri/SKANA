from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb+srv://manognavadla04:Project0@cluster0.lciowot.mongodb.net/')

try:
    client.admin.command('ping') 
    print("MongoDB is connected")
    print(f"Available databases: {client.list_database_names()}")
    db = client['UserTest']
    users_collection = db['users']
    print(f"Selected database: {db.name}")
    print(f"Selected collection: {users_collection.name}")
    print(f"Document count in collection: {users_collection.count_documents({})}")
except Exception as e:
    print("MongoDB connection failed:", e)

@app.route('/api/signup', methods=['POST'])
def signup():
    print("Received signup request")
    if not request.is_json:
        print("Request is not JSON")
        return jsonify({'message': 'Request must be JSON'}), 400
    
    data = request.get_json()
    print(f"Received data: {data}")
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        print(f"Missing email or password. Email: {email}, Password: {'*' * len(password) if password else None}")
        return jsonify({'message': 'Email and password are required'}), 400
    
    hashed_password = generate_password_hash(password)
    try:
        result = users_collection.insert_one({'email': email, 'password': hashed_password})
        print(f"Insertion result: {result.inserted_id}")
        return jsonify({'message': 'Signup successful'}), 201
    except Exception as e:
        print(f"Error inserting user: {e}")
        return jsonify({'message': 'Error creating user'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    user = users_collection.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

if __name__ == '__main__':
    app.run(port=5000, debug=True)
