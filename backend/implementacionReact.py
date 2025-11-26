from flask import Flask, jsonify, request
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Student profile (you can load this from a database)
STUDENT_PROFILE = {
    "nombre": "Student",
    "edad": 10,
    "pais_origen": "Mexico",
    "pais_actual": "USA",
    "hobby_principal": "soccer",
    "materia_favorita": "science"
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

@app.route('/api/perfil', methods=['GET'])
def get_profile():
    return jsonify({
        "success": True,
        "perfil": STUDENT_PROFILE
    })

@app.route('/api/flujo-completo', methods=['POST'])
def complete_flow():
    try:
        data = request.json or {}
        topic = data.get('topic', 'greetings')
        
        # Generate explanation using OpenAI
        explanation_prompt = f"""
        You are Kai, a friendly AI tutor helping immigrant children adapt to their new country.
        Create a short, engaging explanation about "{topic}" for a {STUDENT_PROFILE['edad']}-year-old child.
        
        Rules:
        - Use simple English
        - Be encouraging and friendly
        - Include 2-3 key points
        - Use emojis sparingly
        - Keep it under 100 words
        """
        
        question_prompt = f"""
        Create a simple question about "{topic}" for a child.
        The question should test if they understood the basic concept.
        Keep it simple and answerable in one sentence.
        """
        
        explanation_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": explanation_prompt}],
            max_tokens=200
        )
        
        question_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": question_prompt}],
            max_tokens=50
        )
        
        return jsonify({
            "success": True,
            "explicacion": explanation_response.choices[0].message.content,
            "pregunta": question_response.choices[0].message.content
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/explicacion', methods=['POST'])
def get_explanation():
    try:
        data = request.json or {}
        topic = data.get('topic', 'general')
        
        prompt = f"""
        You are Kai, a friendly AI tutor. Explain "{topic}" to a child in simple terms.
        Be encouraging and use examples they can relate to.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        
        return jsonify({
            "success": True,
            "explicacion": response.choices[0].message.content
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/pregunta', methods=['POST'])
def get_question():
    try:
        prompt = "Create a simple educational question for a child learning about a new country."
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=50
        )
        
        return jsonify({
            "success": True,
            "pregunta": response.choices[0].message.content
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/retroalimentacion', methods=['POST'])
def get_feedback():
    try:
        data = request.json
        pregunta = data.get('pregunta', '')
        respuesta = data.get('respuesta', '')
        
        prompt = f"""
        You are Kai, a friendly AI tutor. A child was asked: "{pregunta}"
        They answered: "{respuesta}"
        
        Provide encouraging feedback in 2-3 sentences.
        - If correct, celebrate their success
        - If incorrect, gently guide them to the right answer
        - Always be positive and encouraging
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100
        )
        
        # Simple check if answer seems correct (you can improve this)
        is_correct = len(respuesta) > 5
        
        return jsonify({
            "success": True,
            "feedback": response.choices[0].message.content,
            "correct": is_correct
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/audio', methods=['POST'])
def text_to_audio():
    try:
        data = request.json
        texto = data.get('texto', '')
        
        # You can integrate with a TTS service here
        # For now, return None and use device TTS
        return jsonify({
            "success": True,
            "audio": None  # Client will use device TTS
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)