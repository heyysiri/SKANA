from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from datetime import datetime

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
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        print(f"Missing name, email or password. Name: {name}, Email: {email}, Password: {'*' * len(password) if password else None}")
        return jsonify({'message': 'Name, email, and password are required'}), 400
    
    hashed_password = generate_password_hash(password)
    try:
        user_data = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'job': '',
            'skills': [],
            'skills_to_improve': []
        }
        result = users_collection.insert_one(user_data)
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
        user_data = {
            'name': user['name'],
            'email': user['email']
        }
        return jsonify({'message': 'Login successful', 'user': user_data}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401
    
@app.route('/api/skills', methods=['GET'])
def get_skills():
    name = request.args.get('name')
    if not name:
        return jsonify({'message': 'Name is required'}), 400
    
    user = users_collection.find_one({'name': name})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    skills = user.get('skills', [])
    return jsonify({'skills': skills}), 200

@app.route('/api/skills', methods=['POST'])
def add_skill():
    data = request.get_json()
    name = data.get('name')
    new_skill = data.get('skill')
    
    if not name or not new_skill:
        return jsonify({'message': 'Name and skill are required'}), 400
    
    user = users_collection.find_one({'name': name})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    current_date = datetime.now().strftime('%B %Y')
    skill_object = {
        'date': current_date,
        'title': new_skill
    }
    
    result = users_collection.update_one(
        {'name': name},
        {'$push': {'skills': skill_object}}
    )
    
    if result.modified_count:
        return jsonify({'message': 'Skill added successfully', 'skill': skill_object}), 201
    else:
        return jsonify({'message': 'Failed to add skill'}), 500
    
@app.route('/api/user/job', methods=['GET'])
def get_job():
    name = request.args.get('name')
    if not name:
        return jsonify({'message': 'Name is required'}), 400
    
    user = users_collection.find_one({'name': name})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    job = user.get('job', '')
    if job == '':
        job = 'Developer'  # Set default job
    
    return jsonify({'job': job}), 200

@app.route('/api/user/job', methods=['POST'])
def update_job():
    data = request.get_json()
    name = data.get('name')
    new_job = data.get('job')
    
    if not name or new_job is None:
        return jsonify({'message': 'Name and job are required'}), 400
    
    result = users_collection.update_one(
        {'name': name},
        {'$set': {'job': new_job}}
    )
    
    if result.modified_count:
        return jsonify({'message': 'Job updated successfully'}), 200
    else:
        return jsonify({'message': 'Failed to update job'}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)