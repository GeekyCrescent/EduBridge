import axios from 'axios';

// Cambia esta URL según donde esté corriendo tu backend
// Para localhost: 'http://localhost:5000'
// Para dispositivo físico/emulador: usa tu IP local
const API_BASE_URL = 'http://10.48.250.234:5000';

export interface PerfilEstudiante {
  nombre: string;
  edad: number;
  grado: string;
  pais_origen: string;
  ciudad_origen: string;
  pais_actual: string;
  ciudad_actual: string;
  tiempo_en_pais: string;
  hobby_principal: string;
  deporte: string;
  comida_favorita: string;
  serie_favorita: string;
  personaje_favorito: string;
  mascota: string;
  materia_favorita: string;
  materia_dificil: string;
  razon_dificultad: string;
  mejor_amigo_escuela: string;
  extraña: string;
  lo_mejor_pais_nuevo: string;
  miedo_principal: string;
  motivacion: string;
  apoyo_familiar: string;
  anecdota: string;
  frase_favorita: string;
  sueño: string;
}

export interface RespuestaAPI {
  success: boolean;
  [key: string]: any;
}

class MentorKaiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Verificar que el servidor está activo
  async verificarConexion(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.data.status === 'ok';
    } catch (error) {
      console.error('Error conectando con el backend:', error);
      return false;
    }
  }

  // Obtener perfil del estudiante
  async obtenerPerfil(): Promise<PerfilEstudiante | null> {
    try {
      const response = await axios.get<RespuestaAPI>(`${this.baseURL}/api/perfil`);
      if (response.data.success) {
        return response.data.perfil;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }
  }

  // Obtener explicación personalizada
  async obtenerExplicacion(): Promise<string | null> {
    try {
      const response = await axios.post<RespuestaAPI>(`${this.baseURL}/api/explicacion`);
      if (response.data.success) {
        return response.data.explicacion;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo explicación:', error);
      return null;
    }
  }

  // Obtener pregunta interactiva
  async obtenerPregunta(): Promise<string | null> {
    try {
      const response = await axios.post<RespuestaAPI>(`${this.baseURL}/api/pregunta`);
      if (response.data.success) {
        return response.data.pregunta;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo pregunta:', error);
      return null;
    }
  }

  // Enviar respuesta y obtener retroalimentación
  async obtenerRetroalimentacion(
    pregunta: string,
    respuesta: string
  ): Promise<string | null> {
    try {
      const response = await axios.post<RespuestaAPI>(
        `${this.baseURL}/api/retroalimentacion`,
        { pregunta, respuesta }
      );
      if (response.data.success) {
        return response.data.feedback;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo retroalimentación:', error);
      return null;
    }
  }

  // Convertir texto a audio
  async textoAAudio(texto: string): Promise<string | null> {
    try {
      const response = await axios.post<RespuestaAPI>(`${this.baseURL}/api/audio`, {
        texto,
      });
      if (response.data.success) {
        return response.data.audio; // Base64
      }
      return null;
    } catch (error) {
      console.error('Error convirtiendo texto a audio:', error);
      return null;
    }
  }

  // Flujo completo: explicación + pregunta
  async flujoCompleto(): Promise<{
    explicacion: string;
    pregunta: string;
  } | null> {
    try {
      const response = await axios.post<RespuestaAPI>(
        `${this.baseURL}/api/flujo-completo`
      );
      if (response.data.success) {
        return {
          explicacion: response.data.explicacion,
          pregunta: response.data.pregunta,
        };
      }
      return null;
    } catch (error) {
      console.error('Error en flujo completo:', error);
      return null;
    }
  }
}

export default new MentorKaiService();