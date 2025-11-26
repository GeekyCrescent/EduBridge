import os

from dotenv import load_dotenv
from openai import OpenAI

# Cargar variables de entorno desde ../.env
load_dotenv("../.env")

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY no está definida en ../.env")

client = OpenAI(api_key=api_key)

texto = """

How do you say 'Hello' in Spanish?
"""

audio = client.audio.speech.create(
    model="gpt-4o-mini-tts",
    voice="shimmer",  # otras voces: shimmer, luma, verse, coral
    input=texto,
    # puedes agregar:
    # format="wav", speed=1.2
)

with open("resultado.mp3", "wb") as f:
    f.write(audio.read())

print("✅ Audio generado: resultado.mp3")
