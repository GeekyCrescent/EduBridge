from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import pyttsx3
import threading
import base64
import io
import time
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permitir requests desde React

# COLOCA TU API KEY EN EL ARCHIVO .env
API_KEY = os.getenv('OPENAI_API_KEY')

if not API_KEY:
    raise ValueError("No se encontró OPENAI_API_KEY en el archivo .env")

# Cliente OpenAI
client = OpenAI(api_key=API_KEY)

# PERFIL DEL ESTUDIANTE (mismo que implementacionnodo.py)
PERFIL_ESTUDIANTE = {
    "nombre": "Youssef",
    "edad": 11,
    "grado": "6° de primaria",
    "pais_origen": "Marruecos",
    "ciudad_origen": "Casablanca",
    "pais_actual": "España",
    "ciudad_actual": "Madrid",
    "tiempo_en_pais": "5 meses",
    "hobby_principal": "jugar fútbol y dibujar caricaturas",
    "deporte": "le encanta el fútbol, es fan del Real Madrid y de Hakimi",
    "comida_favorita": "tajín de pollo y pizza",
    "serie_favorita": "Los Super Campeones",
    "personaje_favorito": "Acción porque siempre resuelve los problemas con ingenio",
    "mascota": "tenía un gato llamado Simba que se quedó con su tío",
    "materia_favorita": "Ciencias Naturales - le fascina aprender sobre los animales",
    "materia_dificil": "Matemáticas, especialmente las fracciones",
    "razon_dificultad": "a veces se confunde al dividir partes iguales",
    "mejor_amigo_escuela": "se llama Pablo, juegan fútbol en el recreo",
    "extraña": "los mercados de su barrio, jugar en la calle con sus primos y el té de menta de su mamá",
    "lo_mejor_pais_nuevo": "los parques para jugar fútbol y los museos que visitan con la escuela",
    "miedo_principal": "que no lo entiendan cuando mezcla español con darija",
    "motivacion": "quiere ser futbolista profesional y algún día jugar en LaLiga",
    "apoyo_familiar": "su mamá trabaja en una cafetería y su papá en un restaurante, tiene una hermana menor de 7 años",
    "anecdota": "una vez ganó un torneo local en Casablanca como portero",
    "frase_favorita": "Bismillah antes de empezar algo importante",
    "sueño": "visitar el estadio Santiago Bernabéu y ver un partido en vivo"
}


def obtener_prompt_personalizado():
    """Genera el prompt con el contexto completo"""
    p = PERFIL_ESTUDIANTE
    
    return f"""
Eres Kai, el mentor personal de {p['nombre']}, un niño de {p['edad']} años que está en {p['grado']}.

CONOCES PROFUNDAMENTE A {p['nombre'].upper()}:

🌎 SU HISTORIA:
- Llegó de {p['ciudad_origen']}, {p['pais_origen']} hace {p['tiempo_en_pais']}
- Ahora vive en {p['ciudad_actual']}, {p['pais_actual']}
- Su familia: mamá en cafetería, papá en restaurante, hermana de 7 años
- Dejó a su gato Simba con su tío (lo extraña mucho)

⚽ LO QUE LE APASIONA:
- OBSESIONADO con el fútbol - fue PORTERO campeón en Casablanca
- Fan del Real Madrid y de Hakimi (su héroe marroquí)
- Le encanta dibujar caricaturas de jugadores
- Su personaje favorito: Acción de Los Super Campeones (resuelve todo con ingenio)
- Tiene un mejor amigo llamado Pablo con quien juega fútbol en el recreo

🍕 SUS GUSTOS:
- Comida: tajín de pollo de su mamá y pizza
- Dice "Bismillah" antes de algo importante
- Le encanta el té de menta que hace su mamá
- Sueña con ir al Santiago Bernabéu a ver un partido

📚 EN LA ESCUELA:
- Materia favorita: Ciencias Naturales (todo sobre animales)
- Dificultad: Matemáticas, especialmente LAS FRACCIONES
- Se confunde al dividir partes iguales
- A veces mezcla español con darija y le da pena que no lo entiendan

😊 SU PERSONALIDAD:
- Valiente como portero pero un poco tímido en clase
- Extraña los mercados de su barrio y jugar con sus primos
- Ingenioso y creativo (como Acción, su héroe)
- Le encantan los museos y parques de Madrid

AHORA VAS A EXPLICAR MULTIPLICACIÓN DE FRACCIONES:

TU MISIÓN:
1. Explica multiplicación de fracciones (ej: 1/2 × 2/3) usando:
   - Ejemplos de fútbol (partes del partido, porciones del campo, tiempo jugado)
   - Referencias a comida que ama (tajín, pizza)
   - Su experiencia como portero (área de la portería, mitades del partido)
   - Los dibujos que hace (dividir papel para caricaturas)

2. Usa UN TONO PERSONAL y MOTIVADOR:
   - Menciona su valentía como portero y cómo eso le ayuda con las mates
   - Recuerda que fue CAMPEÓN en Casablanca - puede ser campeón en fracciones
   - Conecta con su familia (compartir tajín, dividir pizza con su hermana)
   - Menciona a Hakimi o el Real Madrid cuando sea relevante
   - Hazlo sentir que mezclar culturas (como mezcla español y darija) es una FORTALEZA

3. ENFOQUE EN FRACCIONES:
   - Explica que multiplicar fracciones es más fácil que sumarlas
   - Usa visualizaciones del campo de fútbol dividido
   - Compara con dividir el tajín entre la familia
   - Muestra que 1/2 × 2/3 es como tomar una parte de una parte

4. SÉ BREVE: 3-4 frases por explicación, directo al punto
5. USA EJEMPLOS CONCRETOS: campo de fútbol, portería, pizza, tajín, dibujos
6. MOTÍVALO: "¡Bismillah! Como cuando atajabas en Casablanca, ¡puedes con esto!"
"""

# ==================== ENDPOINTS ====================

@app.route('/api/perfil', methods=['GET'])
def obtener_perfil():
    """Devuelve el perfil del estudiante"""
    return jsonify({
        "success": True,
        "perfil": PERFIL_ESTUDIANTE
    })

@app.route('/api/explicacion', methods=['POST'])
def obtener_explicacion():
    """Genera explicación personalizada de multiplicación"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": obtener_prompt_personalizado()},
                {"role": "user", "content": "Hola Kai, quiero aprender multiplicación de fracciones"}
            ],
            temperature=0.8,
            max_tokens=300
        )
        
        explicacion = response.choices[0].message.content
        
        return jsonify({
            "success": True,
            "explicacion": explicacion
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/pregunta', methods=['POST'])
def obtener_pregunta():
    """Genera pregunta interactiva personalizada"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": obtener_prompt_personalizado()},
                {"role": "user", "content": "Ahora hazme una pregunta de multiplicación de fracciones que sea divertida, relacionada con fútbol o comida"}
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        pregunta = response.choices[0].message.content
        
        return jsonify({
            "success": True,
            "pregunta": pregunta
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/retroalimentacion', methods=['POST'])
def dar_retroalimentacion():
    """Da feedback sobre la respuesta del estudiante"""
    try:
        data = request.json
        respuesta_usuario = data.get('respuesta', '')
        pregunta_original = data.get('pregunta', '')
        
        if not respuesta_usuario or not pregunta_original:
            return jsonify({
                "success": False,
                "error": "Faltan parámetros: respuesta y pregunta"
            }), 400
        
        prompt_feedback = f"""
{obtener_prompt_personalizado()}

La pregunta fue: {pregunta_original}
{PERFIL_ESTUDIANTE['nombre']} respondió: {respuesta_usuario}

Da retroalimentación:
- Si está correcto: celébralo como si atajara un penal - ¡usa referencias al fútbol, Hakimi o el Real Madrid!
- Si está incorrecto: motívalo como entrenador - recuerda que fue campeón en Casablanca y puede serlo aquí
- Explica el error con paciencia usando ejemplos del campo de fútbol o compartir tajín
- Usa 2-3 frases máximo
- Hazlo sentir valiente y capaz - "¡Bismillah, tú puedes!"
"""
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": prompt_feedback},
                {"role": "user", "content": "Dame la retroalimentación"}
            ],
            temperature=0.8,
            max_tokens=200
        )
        
        feedback = response.choices[0].message.content
        
        return jsonify({
            "success": True,
            "feedback": feedback
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/audio', methods=['POST'])
def texto_a_audio():
    """Convierte texto a audio usando OpenAI TTS"""
    try:
        data = request.json
        texto = data.get('texto', '')
        
        if not texto:
            return jsonify({
                "success": False,
                "error": "Falta el parámetro: texto"
            }), 400
        
        # Usar OpenAI TTS (más natural que pyttsx3)
        response = client.audio.speech.create(
            model="tts-1",
            voice="nova",  # Voz femenina, también puedes usar: alloy, echo, fable, onyx, shimmer
            input=texto
        )
        
        # Convertir a base64 para enviar al frontend
        audio_bytes = response.content
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        return jsonify({
            "success": True,
            "audio": audio_base64,
            "format": "mp3"
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/flujo-completo', methods=['POST'])
def flujo_completo():
    """Ejecuta todo el flujo: explicación → pregunta → espera respuesta"""
    try:
        # 1. Explicación
        response_explicacion = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": obtener_prompt_personalizado()},
                {"role": "user", "content": "Hola Kai, quiero aprender multiplicación de fracciones"}
            ],
            temperature=0.8,
            max_tokens=300
        )
        explicacion = response_explicacion.choices[0].message.content
        
        # 2. Pregunta
        response_pregunta = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": obtener_prompt_personalizado()},
                {"role": "user", "content": "Ahora hazme una pregunta de multiplicación de fracciones que sea divertida, relacionada con fútbol o comida"}
            ],
            temperature=0.7,
            max_tokens=150
        )
        pregunta = response_pregunta.choices[0].message.content
        
        return jsonify({
            "success": True,
            "explicacion": explicacion,
            "pregunta": pregunta
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Verificar que el servidor está activo"""
    return jsonify({
        "status": "ok",
        "mensaje": "API Mentor Kai funcionando correctamente"
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 API MENTOR KAI INICIADA")
    print("="*60)
    print(f"📋 Estudiante: {PERFIL_ESTUDIANTE['nombre']}")
    print(f"🌍 De: {PERFIL_ESTUDIANTE['ciudad_origen']}, {PERFIL_ESTUDIANTE['pais_origen']}")
    print(f"📍 Ahora en: {PERFIL_ESTUDIANTE['ciudad_actual']}")
    print("\n💻 Endpoints disponibles:")
    print("  GET  /health                    - Verificar estado")
    print("  GET  /api/perfil                - Obtener perfil del estudiante")
    print("  POST /api/explicacion           - Generar explicación")
    print("  POST /api/pregunta              - Generar pregunta")
    print("  POST /api/retroalimentacion     - Dar feedback")
    print("  POST /api/audio                 - Convertir texto a audio")
    print("  POST /api/flujo-completo        - Ejecutar flujo completo")
    print("\n🌐 Servidor corriendo en: http://0.0.0.0:5000")
    print("📱 Accesible desde tu red local")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)