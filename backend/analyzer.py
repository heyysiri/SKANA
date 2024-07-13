from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import os
import PyPDF2
import docx
import json
import re 
from groq import Groq

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

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configure Groq API
groq_client = Groq(
    api_key="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"
)

@app.route('/skill-analyzer', methods=['POST'])
def skill_analyzer():
    if 'resume' not in request.files or 'job_description' not in request.files:
        return jsonify({'error': 'Both resume and job description files are required'}), 400
    
    resume_file = request.files['resume']
    job_description_file = request.files['job_description']
        
    resume_filename = secure_filename(resume_file.filename)
    job_filename = secure_filename(job_description_file.filename)
        
    resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_filename)
    job_path = os.path.join(app.config['UPLOAD_FOLDER'], job_filename)
        
    resume_file.save(resume_path)
    job_description_file.save(job_path)
        
    try:
        resume_text = extract_text(resume_path)
        job_text = extract_text(job_path)
        
        skills_analysis = compare_skills(resume_text, job_text)
            
        os.remove(resume_path)
        os.remove(job_path)
            
        if 'error' in skills_analysis:
            return jsonify(skills_analysis), 500
            
        return jsonify(skills_analysis)
    except Exception as e:
        if os.path.exists(resume_path):
            os.remove(resume_path)
        if os.path.exists(job_path):
            os.remove(job_path)
        print(f"Error in skill analysis: {str(e)}")
        return jsonify({'error': f'An error occurred during skill analysis: {str(e)}'}), 500
    
    return render_template('skill_analyzer.html')

def extract_text(file_path):
    _, file_extension = os.path.splitext(file_path)
    
    if file_extension.lower() == '.pdf':
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page in reader.pages:
                text += page.extract_text()
    elif file_extension.lower() in ['.docx', '.doc']:
        doc = docx.Document(file_path)
        text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
    else:
        with open(file_path, 'r') as file:
            text = file.read()
    
    return text

def normalize_skill(skill):
    return re.sub(r'[^\w\s]', '', skill.lower())

def tokenize(text):
    return re.findall(r'\b\w+\b', normalize_skill(text))

def jaccard_similarity(set1, set2):
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union != 0 else 0

def is_skill_match(resume_skills, job_skill, threshold=0.3):
    job_tokens = set(tokenize(job_skill))
    resume_tokens = set(token for skill in resume_skills for token in tokenize(skill))
    
    if "or" in job_skill.lower():
        return any(skill.lower() in normalize_skill(job_skill) for skill in resume_skills)
    
    for resume_skill in resume_skills:
        if set(tokenize(resume_skill)).issubset(job_tokens) or set(job_tokens).issubset(tokenize(resume_skill)):
            return True
    
    if "object-oriented" in job_skill.lower() and any("oop" in normalize_skill(skill) for skill in resume_skills):
        return True
    
    similarity = jaccard_similarity(job_tokens, resume_tokens)
    return similarity >= threshold
    
def compare_skills(resume_text, job_text):
    prompt = rf"""
    Resume:
    {resume_text}

    Job Description:
    {job_text}

    Based on the resume and job description provided, please:
    1. List skills mentioned in the resume As "skills_from_resume". ADD WITHOUT SUBHEADINGS.
    2. List the skills required in the job description in "skills_required_in_job", PLEASE AVOID WIDE AND GENERIC SKILLS AND ONLY MENTION DEFINITE SKILLS THAT CAN BE LEARNED THROUGH A UDEMY COURSE.
    If only key responsibilities\duties are mentioned, then extract the required skills from that.
    Otherwise, extract it from eligibility criteria, qualifications, or any other section that mentions the required skills.
    3. Compare the skills from the resume with the skills required in the job description and list the matching skills. in "matching_skills".
    4. List the skills from the job description that are not present in the resume As "skills_to_improve".
    Present the results in a structured JSON format.
    """

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gemma-7b-it",
        )
        response = chat_completion.choices[0].message.content
        
        # Print the raw response for debugging
        print("Raw API response:", response)
        
        # Try to find and extract the JSON part of the response
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            skills_data = json.loads(json_str)
        else:
            raise ValueError("No JSON object found in the response")

        required_keys = ["skills_from_resume", "skills_required_in_job", "matching_skills", "skills_to_improve"]
        if all(key in skills_data for key in required_keys):
            return skills_data
        else:
            missing_keys = [key for key in required_keys if key not in skills_data]
            raise ValueError(f"Missing required keys in JSON: {', '.join(missing_keys)}")

    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {str(e)}")
        print("Response causing the error:", response)
        return {"error": f"Invalid JSON in API response: {str(e)}"}
    except Exception as e:
        print(f"Error in skill analysis: {str(e)}")
        print("Response causing the error:", response)
        return {"error": f"Error in skill analysis: {str(e)}"}

if __name__ == '__main__':
    app.run(port=5001, debug=True)