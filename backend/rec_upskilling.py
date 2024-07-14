from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.rec_courses import recommend_course
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/recommend_course', methods=['POST'])
def recommend_course_api():
    data = request.json
    skill_name = data.get('resource')
    if not skill_name:
        return jsonify({'error': 'Skill name is required'}), 400
    
    recommended_link = recommend_course(skill_name)
    
    # Check if recommended_link is a pandas Series
    if isinstance(recommended_link, pd.Series):
        if recommended_link.empty:
            return jsonify({'error': 'No recommendation found'}), 404
        # Assuming the first item is the link
        recommended_link = recommended_link.iloc[0]
    elif not recommended_link:
        return jsonify({'error': 'No recommendation found'}), 404
    
    return jsonify({'recommendation': recommended_link})

if __name__ == '__main__':
    app.run(debug=True, port=5500)