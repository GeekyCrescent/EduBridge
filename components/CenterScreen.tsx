import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

// ==================== YOUSSEF'S PROFILE ====================
const STUDENT = {
  name: "Youssef",
  age: 11,
  grade: "6th grade",
  originCountry: "Morocco",
  originCity: "Casablanca",
  currentCountry: "Spain",
  currentCity: "Madrid",
  timeInCountry: "5 months",
  hobby: "playing soccer and drawing cartoons",
  favoriteTeam: "Real Madrid",
  favoritePlayer: "Hakimi",
  favoriteFood: "chicken tajine and pizza",
  favoriteSeries: "Captain Tsubasa",
  pet: "a cat named Simba (stayed with uncle)",
  favoriteSubject: "Natural Sciences - loves animals",
  difficultSubject: "Math, especially fractions",
  bestFriend: "Pablo",
  dream: "visit Santiago Bernabéu stadium",
  phrase: "Bismillah",
};

// ==================== TOPICS ====================
const TOPICS = [
  {
    id: 'spanish',
    title: 'Learn Spanish',
    description: 'Practice speaking Spanish!',
    icon: '🇪🇸',
    color: '#ef4444',
    isVoicePractice: true, // Special flag for voice practice
    voiceExercise: {
      question: "How do you say 'Hello' in Spanish?",
      questionAudio: null, // Placeholder - you'll add your audio file here
      expectedAnswer: "Hola",
      correctResponse: "¡Perfecto, Youssef! 'Hola' is correct! You're learning Spanish so fast. Pablo will be impressed!",
      correctResponseAudio: null, // Placeholder for correct response audio
    },
    response: `${STUDENT.name}! 🇪🇸 Let's practice speaking Spanish!

I'll ask you a question, and you answer by recording your voice. Ready?

**Today's Question:**
How do you say "Hello" in Spanish?

Press the 🎤 button and say your answer!`,
  },
  {
    id: 'fractions',
    title: 'Fractions',
    description: 'Learn with soccer examples!',
    icon: '⚽',
    color: '#22c55e',
    response: `${STUDENT.name}! ⚽ Let's learn fractions with soccer - your favorite!

Imagine the soccer field at your school where you play with Pablo. If we divide it in half, each part is 1/2 (one half). That's where midfielders play!

Now divide it into 4 parts - each is 1/4 (one quarter). Like when Hakimi runs from defense to attack, he covers about 1/4 of the field each time!

Bismillah - you've got this, champion! 🏆`,
    quiz: [
      {
        question: "If you divide a pizza into 4 equal slices, what fraction is each slice?",
        options: ["1/2", "1/4", "1/3", "2/4"],
        correct: 1,
        explanation: "Correct! When you divide something into 4 equal parts, each part is 1/4 (one quarter). Like dividing the soccer field into 4 zones!"
      },
      {
        question: "Hakimi runs half the field. What fraction is that?",
        options: ["1/4", "1/3", "1/2", "2/3"],
        correct: 2,
        explanation: "Yes! Half means 1/2. Just like if the Real Madrid vs Barcelona match is at halftime, we've seen 1/2 of the game!"
      },
      {
        question: "You ate 2 slices of a pizza that had 8 slices. What fraction did you eat?",
        options: ["1/4", "2/8", "1/2", "Both 1/4 and 2/8"],
        correct: 3,
        explanation: "Excellent, Youssef! 2/8 = 1/4. They're the same! Like saying 'half the team' or '5.5 players' - same thing!"
      }
    ]
  },
  {
    id: 'madrid-culture',
    title: 'Madrid Culture',
    description: 'Discover your new home!',
    icon: '🏟️',
    color: '#3b82f6',
    response: `${STUDENT.name}! 🏟️ Welcome to Madrid - your amazing new home!

**Famous Places:**
• Santiago Bernabéu - Real Madrid's stadium! Your dream is to visit it, and it's right here in Madrid!
• Retiro Park - Huge park where you can play soccer with Pablo
• Prado Museum - Famous art museum (for your artistic side!)
• Puerta del Sol - The heart of Madrid

**Delicious Food:**
• Churros con chocolate - Sweet fried dough with hot chocolate (you'll LOVE it!)
• Tortilla española - Spanish omelette with potatoes
• Cocido madrileño - Traditional Madrid stew

**Fun Facts:**
• Madrid's soccer teams: Real Madrid & Atlético Madrid
• Hakimi (your favorite player!) played here for Real Madrid!
• Madrid has sunny weather most of the year - perfect for soccer!

You're living in one of the best cities in the world, ${STUDENT.name}! 🌟`,
    quiz: [
      {
        question: "What is the name of Real Madrid's stadium?",
        options: ["Camp Nou", "Santiago Bernabéu", "Wanda Metropolitano", "San Siro"],
        correct: 1,
        explanation: "¡Correcto! Santiago Bernabéu is Real Madrid's home. Your dream to visit it is so close to reality since you live in Madrid now!"
      },
      {
        question: "Where can you play soccer with Pablo in Madrid?",
        options: ["Prado Museum", "Puerta del Sol", "Retiro Park", "Gran Vía"],
        correct: 2,
        explanation: "Yes! Retiro Park is huge and perfect for soccer. It's one of the most beautiful parks in Europe!"
      },
      {
        question: "What's a typical Madrid sweet treat with hot chocolate?",
        options: ["Croissant", "Churros", "Tajine", "Pizza"],
        correct: 1,
        explanation: "¡Exacto! Churros con chocolate is a Madrid specialty. You must try it with your family!"
      }
    ]
  },
  {
    id: 'animals',
    title: 'Animals',
    description: 'Your favorite subject!',
    icon: '🦁',
    color: '#06b6d4',
    response: `${STUDENT.name}! 🦁 Animals - your favorite subject! I know you miss Simba, your cat in Casablanca.

**Animals in Spanish:**
• "Gato" = Cat (like Simba!)
• "Perro" = Dog
• "León" = Lion (Simba means lion!)
• "Pájaro" = Bird

**Where to see animals in Madrid:**
• Madrid Zoo - Lions, elephants, pandas!
• Faunia - Nature park with animals from around the world
• Retiro Park - Ducks, turtles, and squirrels

**Fun fact:** The lion is a symbol of many soccer teams! Real Madrid's rival, Athletic Bilbao, has lions in their crest.

Maybe one day you can have a cat in Madrid too, and name it after a Real Madrid player! ⚽`,
    quiz: [
      {
        question: "What does 'Simba' mean?",
        options: ["Cat", "King", "Lion", "Friend"],
        correct: 2,
        explanation: "Right! Simba means Lion in Swahili. That's why in the movie, Simba becomes the Lion King! Just like your cat! 🦁"
      },
      {
        question: "How do you say 'cat' in Spanish?",
        options: ["Perro", "Gato", "León", "Pájaro"],
        correct: 1,
        explanation: "¡Perfecto! Gato = Cat. Maybe you can tell Pablo: 'Tengo un gato que se llama Simba' (I have a cat named Simba)!"
      },
      {
        question: "Where can you see pandas in Madrid?",
        options: ["Retiro Park", "Prado Museum", "Madrid Zoo", "Santiago Bernabéu"],
        correct: 2,
        explanation: "Correct! Madrid Zoo has pandas, lions, elephants and many more animals. Perfect for someone who loves Natural Sciences like you!"
      }
    ]
  },
  {
    id: 'emergency',
    title: 'Emergency',
    description: 'Important numbers in Spain',
    icon: '📞',
    color: '#dc2626',
    response: `${STUDENT.name}! 📞 This is super important - emergency numbers in Spain!

**MOST IMPORTANT:**
• **112** - General emergency (police, fire, ambulance) - works everywhere in Europe!
• **091** - National Police
• **092** - Local Police  
• **061** - Medical emergencies

**What to say:**
• "Necesito ayuda" = I need help
• "Es una emergencia" = It's an emergency
• "Mi nombre es Youssef" = My name is Youssef
• "Estoy en..." = I'm at...

**Your parents' info:**
• Your mom works at a café
• Your dad works at a restaurant
• Keep their phone numbers memorized!

**Teach your family:**
Share these numbers with your mom, dad, and little sister too! Champions look out for their team! 🛡️`,
    quiz: [
      {
        question: "What is the main emergency number in Spain and all of Europe?",
        options: ["911", "112", "999", "100"],
        correct: 1,
        explanation: "¡Muy importante! 112 works everywhere in Europe. Remember it always!"
      },
      {
        question: "How do you say 'I need help' in Spanish?",
        options: ["Estoy bien", "Necesito ayuda", "Tengo hambre", "Quiero agua"],
        correct: 1,
        explanation: "Correct! 'Necesito ayuda' is very important to know. Let's hope you never need it, but it's good to be prepared!"
      },
      {
        question: "What number do you call for medical emergencies in Spain?",
        options: ["091", "092", "061", "112"],
        correct: 2,
        explanation: "Right! 061 is for medical emergencies specifically. But remember, 112 works for everything!"
      }
    ]
  },
  {
    id: 'food',
    title: 'Food & Meals',
    description: 'From tajine to pizza!',
    icon: '🍕',
    color: '#f59e0b',
    response: `${STUDENT.name}! 🍕 Let's talk about food - I know you love chicken tajine and pizza!

**Spanish food words:**
• "Desayuno" = Breakfast
• "Almuerzo" = Lunch  
• "Cena" = Dinner
• "Agua" = Water
• "Pan" = Bread

**Ordering food in Spanish:**
• "Quiero..." = I want...
• "Una pizza, por favor" = A pizza, please
• "La cuenta, por favor" = The check, please

**Madrid specialties to try:**
• Churros con chocolate (sweet treat!)
• Bocadillo de calamares (squid sandwich)
• Patatas bravas (spicy potatoes)

**Tip:** Many restaurants in Madrid also have Moroccan food! You might find tajine when you miss home. 🇲🇦

Food brings people together - just like soccer! ⚽`,
    quiz: [
      {
        question: "How do you say 'breakfast' in Spanish?",
        options: ["Cena", "Almuerzo", "Desayuno", "Merienda"],
        correct: 2,
        explanation: "¡Correcto! Desayuno = Breakfast. The most important meal before school and soccer practice!"
      },
      {
        question: "How do you order a pizza in Spanish?",
        options: ["Dame pizza", "Una pizza, por favor", "Pizza ahora", "Quiero pizza ya"],
        correct: 1,
        explanation: "¡Perfecto! 'Una pizza, por favor' is polite and correct. Adding 'por favor' (please) is always good!"
      },
      {
        question: "What is 'agua' in English?",
        options: ["Food", "Water", "Bread", "Juice"],
        correct: 1,
        explanation: "Correct! Agua = Water. Very important to stay hydrated, especially after playing soccer!"
      }
    ]
  },
  {
    id: 'sports',
    title: 'Sports',
    description: 'Soccer vocabulary',
    icon: '⚽',
    color: '#10b981',
    response: `${STUDENT.name}! ⚽ Sports and soccer - your passion!

**Soccer words in Spanish:**
• "Fútbol" = Soccer
• "Portero" = Goalkeeper (YOU!)
• "Gol" = Goal
• "Equipo" = Team
• "Entrenador" = Coach
• "Partido" = Match
• "Ganar" = To win
• "Parada" = Save (what goalkeepers do!)

**Your achievements:**
Remember winning that goalkeeper tournament in Casablanca? That proves you have talent! Now you can show Madrid what a champion from Morocco can do!

**Playing with Pablo:**
• "¿Jugamos al fútbol?" = Shall we play soccer?
• "¡Pásame el balón!" = Pass me the ball!
• "¡Buena jugada!" = Good play!

Keep training, keep believing! Bismillah, champion! 🏆`,
    quiz: [
      {
        question: "How do you say 'goalkeeper' in Spanish?",
        options: ["Delantero", "Portero", "Defensa", "Mediocampista"],
        correct: 1,
        explanation: "¡Exacto! Portero = Goalkeeper. That's your position, campeón! You won a tournament as portero in Casablanca!"
      },
      {
        question: "What does '¿Jugamos al fútbol?' mean?",
        options: ["I like soccer", "Soccer is fun", "Shall we play soccer?", "Soccer is the best"],
        correct: 2,
        explanation: "¡Muy bien! Now you can ask Pablo to play anytime: '¿Jugamos al fútbol?'"
      },
      {
        question: "What is 'parada' in soccer?",
        options: ["A goal", "A save", "A pass", "A foul"],
        correct: 1,
        explanation: "Correct! Parada = Save. What goalkeepers do! You probably made many 'paradas' in Casablanca!"
      }
    ]
  },
  {
    id: 'school',
    title: 'At School',
    description: 'Classroom vocabulary',
    icon: '🏫',
    color: '#8b5cf6',
    response: `${STUDENT.name}! 🏫 Let's learn school words - super useful for talking with Pablo and your classmates!

**School vocabulary in Spanish:**
• "Escuela/Colegio" = School
• "Clase" = Class/Classroom
• "Profesor/Profesora" = Teacher
• "Compañero/Compañera" = Classmate
• "Libro" = Book
• "Cuaderno" = Notebook
• "Lápiz" = Pencil
• "Recreo" = Recess (when you play soccer!)

**Useful phrases:**
• "¿Puedo ir al baño?" = Can I go to the bathroom?
• "No entiendo" = I don't understand
• "¿Puede repetir?" = Can you repeat?

Your favorite subject, Natural Sciences, is "Ciencias Naturales" in Spanish! 

Remember: at school, asking questions is like communicating with your team. Don't be shy - champions always speak up! 🌟`,
    quiz: [
      {
        question: "How do you say 'recess' in Spanish?",
        options: ["Clase", "Recreo", "Libro", "Escuela"],
        correct: 1,
        explanation: "¡Correcto! Recreo = Recess. The best part of school when you play fútbol with Pablo!"
      },
      {
        question: "What does 'No entiendo' mean?",
        options: ["I'm hungry", "I don't understand", "I don't want to", "I don't have it"],
        correct: 1,
        explanation: "¡Muy bien! It's okay to say 'No entiendo' - teachers will help you. It's brave to ask for help!"
      },
      {
        question: "What is 'Ciencias Naturales'?",
        options: ["Mathematics", "History", "Natural Sciences", "Spanish Language"],
        correct: 2,
        explanation: "¡Exacto! Ciencias Naturales = Natural Sciences - your favorite subject where you learn about animals like Simba!"
      }
    ]
  },
];

// ==================== SPEECH HOOK ====================
const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const speak = useCallback((text: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      setIsSpeaking(true);
      
      setTimeout(() => {
        const cleanText = text.replace(/[*#🏆⚽🌟🎨🦁🏫🍕📞🇪🇸🏟️🇲🇦🐆🛡️🎤]/g, '').replace(/\n+/g, '. ');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        
        const setVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          const englishVoice = voices.find(v => v.lang === 'en-US') || voices[0];
          if (englishVoice) utterance.voice = englishVoice;
        };
        
        if (window.speechSynthesis.getVoices().length > 0) setVoice();
        else window.speechSynthesis.onvoiceschanged = setVoice;
        
        utterance.onend = () => {
          setIsSpeaking(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
        
        window.speechSynthesis.speak(utterance);
        
        intervalRef.current = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            setIsSpeaking(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }, 500);
      }, 100);
    }
  }, []);

  const stop = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, []);

  return { speak, stop, isSpeaking };
};

// ==================== VOICE INPUT HOOK ====================
const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = () => setIsListening(false);
        
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const result = event.results[current];
          if (result.isFinal) {
            setTranscript(result[0].transcript);
          }
        };

        recognitionRef.current.start();
      } else {
        alert('Voice recognition not supported in this browser');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return { isListening, transcript, startListening, stopListening, clearTranscript };
};

// ==================== KAI SPEAKING OVERLAY ====================
const KaiSpeakingOverlay = ({ 
  visible, 
  text, 
  onClose, 
  isSpeaking 
}: { 
  visible: boolean; 
  text: string; 
  onClose: () => void; 
  isSpeaking: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnims = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;
  
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, { 
        toValue: 1, 
        friction: 8, 
        tension: 40, 
        useNativeDriver: true 
      }).start();
    }
  }, [visible, scaleAnim]);

  useEffect(() => {
    animationsRef.current.forEach(anim => anim.stop());
    animationsRef.current = [];

    if (visible && isSpeaking) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();
      animationsRef.current.push(pulse);

      waveAnims.forEach((anim, index) => {
        const wave = Animated.loop(
          Animated.sequence([
            Animated.delay(index * 80),
            Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.2, duration: 200, useNativeDriver: true }),
          ])
        );
        wave.start();
        animationsRef.current.push(wave);
      });
    } else {
      pulseAnim.setValue(1);
      waveAnims.forEach(anim => anim.setValue(0.3));
    }

    return () => {
      animationsRef.current.forEach(anim => anim.stop());
    };
  }, [visible, isSpeaking, pulseAnim, waveAnims]);

  if (!visible) return null;

  return (
    <View style={speakingStyles.overlay}>
      <LinearGradient colors={['#10b981', '#059669', '#047857']} style={speakingStyles.gradient}>
        <Animated.View style={[speakingStyles.content, { transform: [{ scale: scaleAnim }] }]}>
          <Animated.View style={[speakingStyles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={speakingStyles.avatar}>
              <Text style={speakingStyles.avatarEmoji}>🤖</Text>
            </View>
            {isSpeaking && (
              <View style={speakingStyles.speakingBadge}>
                <Text style={{ fontSize: 16 }}>🔊</Text>
              </View>
            )}
          </Animated.View>

          <Text style={speakingStyles.title}>
            {isSpeaking ? 'Kai is speaking...' : 'Kai finished'}
          </Text>

          <View style={speakingStyles.wavesContainer}>
            {waveAnims.map((anim, index) => (
              <Animated.View 
                key={index}
                style={[
                  speakingStyles.wave,
                  index === 2 && speakingStyles.waveCenter,
                  (index === 1 || index === 3) && speakingStyles.waveMid,
                  { transform: [{ scaleY: anim }], opacity: isSpeaking ? anim : 0.3 }
                ]} 
              />
            ))}
          </View>

          <View style={speakingStyles.messageContainer}>
            <ScrollView style={{ maxHeight: 120 }} showsVerticalScrollIndicator={false}>
              <Text style={speakingStyles.messageText}>
                {text.substring(0, 250)}{text.length > 250 ? '...' : ''}
              </Text>
            </ScrollView>
          </View>

          <TouchableOpacity style={speakingStyles.stopButton} onPress={onClose} activeOpacity={0.8}>
            <MaterialCommunityIcons name="stop" size={20} color="white" />
            <Text style={speakingStyles.stopText}>Stop & Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const speakingStyles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', width: '100%', paddingHorizontal: 24 },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' },
  avatarEmoji: { fontSize: 60 },
  speakingBadge: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#22c55e', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#10b981' },
  title: { fontSize: 28, fontWeight: '800', color: 'white', marginBottom: 20 },
  wavesContainer: { flexDirection: 'row', gap: 8, height: 60, alignItems: 'center', marginBottom: 24 },
  wave: { width: 8, height: 30, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 4 },
  waveMid: { height: 45 },
  waveCenter: { height: 60 },
  messageContainer: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, width: '100%', maxHeight: 160, marginBottom: 24 },
  messageText: { color: 'white', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  stopButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 50, gap: 10 },
  stopText: { color: 'white', fontSize: 18, fontWeight: '700' },
});

// ==================== QUIZ COMPONENT ====================
const QuizSection = ({ 
  quiz, 
  onComplete,
  speak 
}: { 
  quiz: typeof TOPICS[0]['quiz']; 
  onComplete: () => void;
  speak: (text: string) => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const question = quiz[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === question.correct) {
      setScore(prev => prev + 1);
      speak("Excellent! " + question.explanation);
    } else {
      speak("Not quite. " + question.explanation);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      const finalScore = score + (isCorrect ? 1 : 0);
      speak(`Quiz complete! You got ${finalScore} out of ${quiz.length} correct. ${finalScore === quiz.length ? "Perfect score, champion!" : "Keep practicing, you're doing great!"}`);
    }
  };

  if (quizComplete) {
    const finalScore = score;
    return (
      <Surface style={quizStyles.container}>
        <View style={quizStyles.completeContainer}>
          <Text style={quizStyles.completeEmoji}>
            {finalScore === quiz.length ? '🏆' : finalScore >= quiz.length / 2 ? '⭐' : '💪'}
          </Text>
          <Text style={quizStyles.completeTitle}>Quiz Complete!</Text>
          <Text style={quizStyles.completeScore}>
            {finalScore} / {quiz.length} correct
          </Text>
          <View style={quizStyles.xpBadge}>
            <MaterialCommunityIcons name="star" size={20} color="#fbbf24" />
            <Text style={quizStyles.xpText}>+{finalScore * 10} XP</Text>
          </View>
          <TouchableOpacity style={quizStyles.continueButton} onPress={onComplete}>
            <Text style={quizStyles.continueText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={quizStyles.container}>
      <View style={quizStyles.header}>
        <Text style={quizStyles.headerTitle}>🎯 Quick Quiz</Text>
        <Text style={quizStyles.progress}>{currentQuestion + 1}/{quiz.length}</Text>
      </View>

      <Text style={quizStyles.question}>{question.question}</Text>

      <View style={quizStyles.options}>
        {question.options.map((option, index) => {
          let optionStyle = quizStyles.option;
          let textStyle = quizStyles.optionText;
          
          if (showResult) {
            if (index === question.correct) {
              optionStyle = { ...quizStyles.option, ...quizStyles.optionCorrect };
              textStyle = { ...quizStyles.optionText, color: 'white' };
            } else if (index === selectedAnswer && !isCorrect) {
              optionStyle = { ...quizStyles.option, ...quizStyles.optionWrong };
              textStyle = { ...quizStyles.optionText, color: 'white' };
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={optionStyle}
              onPress={() => handleAnswer(index)}
              disabled={showResult}
              activeOpacity={0.8}
            >
              <Text style={textStyle}>{option}</Text>
              {showResult && index === question.correct && (
                <MaterialCommunityIcons name="check-circle" size={24} color="white" />
              )}
              {showResult && index === selectedAnswer && !isCorrect && (
                <MaterialCommunityIcons name="close-circle" size={24} color="white" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {showResult && (
        <View style={quizStyles.resultContainer}>
          <View style={[quizStyles.resultBadge, isCorrect ? quizStyles.resultCorrect : quizStyles.resultWrong]}>
            <Text style={quizStyles.resultEmoji}>{isCorrect ? '✅' : '❌'}</Text>
            <Text style={quizStyles.resultText}>
              {isCorrect ? 'Correct!' : 'Not quite...'}
            </Text>
          </View>
          <Text style={quizStyles.explanation}>{question.explanation}</Text>
          <TouchableOpacity style={quizStyles.nextButton} onPress={handleNext}>
            <Text style={quizStyles.nextText}>
              {currentQuestion < quiz.length - 1 ? 'Next Question' : 'See Results'}
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </Surface>
  );
};

const quizStyles = StyleSheet.create({
  container: { backgroundColor: '#1e293b', borderRadius: 20, padding: 20, marginTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#f1f5f9' },
  progress: { fontSize: 14, color: '#94a3b8', backgroundColor: '#334155', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  question: { fontSize: 17, fontWeight: '600', color: '#f1f5f9', marginBottom: 20, lineHeight: 24 },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#334155', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  optionCorrect: { backgroundColor: '#22c55e', borderColor: '#16a34a' },
  optionWrong: { backgroundColor: '#ef4444', borderColor: '#dc2626' },
  optionText: { fontSize: 15, color: '#f1f5f9', flex: 1 },
  resultContainer: { marginTop: 20 },
  resultBadge: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, gap: 8, marginBottom: 12 },
  resultCorrect: { backgroundColor: '#22c55e20' },
  resultWrong: { backgroundColor: '#ef444420' },
  resultEmoji: { fontSize: 20 },
  resultText: { fontSize: 16, fontWeight: '700', color: '#f1f5f9' },
  explanation: { fontSize: 14, color: '#94a3b8', lineHeight: 20, marginBottom: 16 },
  nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, gap: 8 },
  nextText: { fontSize: 16, fontWeight: '700', color: 'white' },
  completeContainer: { alignItems: 'center', paddingVertical: 20 },
  completeEmoji: { fontSize: 60, marginBottom: 16 },
  completeTitle: { fontSize: 24, fontWeight: '800', color: '#f1f5f9', marginBottom: 8 },
  completeScore: { fontSize: 18, color: '#94a3b8', marginBottom: 16 },
  xpBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbbf2420', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, gap: 6, marginBottom: 20 },
  xpText: { fontSize: 18, fontWeight: '700', color: '#fbbf24' },
  continueButton: { backgroundColor: '#10b981', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  continueText: { fontSize: 16, fontWeight: '700', color: 'white' },
});

// ==================== VOICE INPUT COMPONENT ====================
const VoiceInputSection = ({ 
  isListening, 
  transcript, 
  onStartListening, 
  onStopListening,
  onSend,
  onClear 
}: {
  isListening: boolean;
  transcript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onSend: (text: string) => void;
  onClear: () => void;
}) => {
  const [textInput, setTextInput] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isListening) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  useEffect(() => {
    if (transcript) {
      setTextInput(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (textInput.trim()) {
      onSend(textInput.trim());
      setTextInput('');
      onClear();
    }
  };

  return (
    <Surface style={voiceStyles.container}>
      <Text style={voiceStyles.title}>💬 Ask Kai a Question</Text>
      
      <View style={voiceStyles.inputContainer}>
        <TextInput
          style={voiceStyles.textInput}
          placeholder="Type or speak your question..."
          placeholderTextColor="#64748b"
          value={textInput}
          onChangeText={setTextInput}
          multiline
        />
        
        <View style={voiceStyles.actions}>
          <TouchableOpacity 
            style={[voiceStyles.micButton, isListening && voiceStyles.micButtonActive]}
            onPress={isListening ? onStopListening : onStartListening}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <MaterialCommunityIcons 
                name={isListening ? "microphone" : "microphone-outline"} 
                size={24} 
                color={isListening ? "white" : "#10b981"} 
              />
            </Animated.View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[voiceStyles.sendButton, !textInput.trim() && voiceStyles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!textInput.trim()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {isListening && (
        <View style={voiceStyles.listeningIndicator}>
          <View style={voiceStyles.listeningDot} />
          <Text style={voiceStyles.listeningText}>Listening... Speak now!</Text>
        </View>
      )}
    </Surface>
  );
};

const voiceStyles = StyleSheet.create({
  container: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#f1f5f9', marginBottom: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  textInput: { flex: 1, backgroundColor: '#334155', borderRadius: 12, padding: 12, color: '#f1f5f9', fontSize: 15, minHeight: 48, maxHeight: 100 },
  actions: { flexDirection: 'row', gap: 8 },
  micButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#10b98120', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#10b981' },
  micButtonActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  sendButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#334155' },
  listeningIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  listeningDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  listeningText: { fontSize: 13, color: '#ef4444', fontWeight: '600' },
});

// ==================== CORRECT ANIMATION OVERLAY ====================
const CorrectAnswerOverlay = ({ 
  visible, 
  onClose,
  message 
}: { 
  visible: boolean; 
  onClose: () => void;
  message: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const starAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const confettiAnims = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      starAnims.forEach(anim => anim.setValue(0));
      confettiAnims.forEach(anim => {
        anim.x.setValue(0);
        anim.y.setValue(0);
        anim.opacity.setValue(1);
        anim.rotate.setValue(0);
      });

      // Main checkmark animation
      Animated.sequence([
        Animated.spring(scaleAnim, { 
          toValue: 1.2, 
          friction: 3, 
          tension: 100, 
          useNativeDriver: true 
        }),
        Animated.spring(scaleAnim, { 
          toValue: 1, 
          friction: 5, 
          useNativeDriver: true 
        }),
      ]).start();

      // Rotate animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // Stars animation
      starAnims.forEach((anim, index) => {
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.spring(anim, { 
            toValue: 1, 
            friction: 4, 
            tension: 80, 
            useNativeDriver: true 
          }),
        ]).start();
      });

      // Confetti animation
      confettiAnims.forEach((anim, index) => {
        const randomX = (Math.random() - 0.5) * width;
        const randomDelay = Math.random() * 500;
        
        Animated.sequence([
          Animated.delay(randomDelay),
          Animated.parallel([
            Animated.timing(anim.x, {
              toValue: randomX,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.y, {
              toValue: height,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: Math.random() * 10,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const confettiColors = ['#22c55e', '#fbbf24', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <View style={correctStyles.overlay}>
      <LinearGradient colors={['#22c55e', '#16a34a', '#15803d']} style={correctStyles.gradient}>
        {/* Confetti */}
        {confettiAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              correctStyles.confetti,
              {
                backgroundColor: confettiColors[index % confettiColors.length],
                transform: [
                  { translateX: anim.x },
                  { translateY: anim.y },
                  { rotate: anim.rotate.interpolate({
                    inputRange: [0, 10],
                    outputRange: ['0deg', '3600deg'],
                  })},
                ],
                opacity: anim.opacity,
                left: `${(index / confettiAnims.length) * 100}%`,
              },
            ]}
          />
        ))}

        <Animated.View style={[correctStyles.content, { transform: [{ scale: scaleAnim }] }]}>
          {/* Rotating glow ring */}
          <Animated.View 
            style={[
              correctStyles.glowRing,
              {
                transform: [{
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }]
              }
            ]}
          />

          {/* Stars */}
          <View style={correctStyles.starsContainer}>
            {starAnims.map((anim, index) => {
              const positions = [
                { top: -30, left: -40 },
                { top: -40, right: -30 },
                { top: 20, left: -60 },
                { top: 30, right: -50 },
                { bottom: -20, left: 10 },
              ];
              return (
                <Animated.Text
                  key={index}
                  style={[
                    correctStyles.star,
                    positions[index],
                    { 
                      transform: [{ scale: anim }],
                      opacity: anim,
                    }
                  ]}
                >
                  ⭐
                </Animated.Text>
              );
            })}
          </View>

          {/* Main checkmark */}
          <View style={correctStyles.checkmarkCircle}>
            <Text style={correctStyles.checkmarkEmoji}>✅</Text>
          </View>

          <Text style={correctStyles.title}>¡Correcto!</Text>
          <Text style={correctStyles.subtitle}>Excellent work, {STUDENT.name}!</Text>

          {/* Message */}
          <View style={correctStyles.messageBox}>
            <Text style={correctStyles.messageText}>{message}</Text>
          </View>

          {/* XP Badge */}
          <View style={correctStyles.xpBadge}>
            <MaterialCommunityIcons name="star" size={24} color="#fbbf24" />
            <Text style={correctStyles.xpText}>+15 XP</Text>
          </View>

          <TouchableOpacity style={correctStyles.continueButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={correctStyles.continueText}>Continue</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const correctStyles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  confetti: { position: 'absolute', top: -20, width: 10, height: 20, borderRadius: 5 },
  content: { alignItems: 'center', width: '100%', paddingHorizontal: 24 },
  glowRing: { 
    position: 'absolute', 
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    borderWidth: 4, 
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  starsContainer: { position: 'relative', width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
  star: { position: 'absolute', fontSize: 30 },
  checkmarkCircle: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  checkmarkEmoji: { fontSize: 60 },
  title: { fontSize: 42, fontWeight: '900', color: 'white', marginTop: 24, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.9)', marginTop: 8 },
  messageBox: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 16, 
    padding: 16, 
    marginTop: 24,
    width: '100%',
  },
  messageText: { color: 'white', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  xpBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 30, 
    gap: 8,
    marginTop: 20,
  },
  xpText: { fontSize: 20, fontWeight: '800', color: '#fbbf24' },
  continueButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    paddingVertical: 16, 
    paddingHorizontal: 40, 
    borderRadius: 50, 
    gap: 10,
    marginTop: 24,
  },
  continueText: { fontSize: 18, fontWeight: '700', color: '#16a34a' },
});

// ==================== VOICE PRACTICE COMPONENT ====================
const VoicePracticeSection = ({ 
  exercise,
  onCorrectAnswer,
  speak,
}: { 
  exercise: typeof TOPICS[0]['voiceExercise'];
  onCorrectAnswer: () => void;
  speak: (text: string) => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnims = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;

  useEffect(() => {
    if (isRecording) {
      // Pulse animation for mic
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();

      // Wave animations
      waveAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 100),
            Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.2, duration: 300, useNativeDriver: true }),
          ])
        ).start();
      });

      return () => {
        pulse.stop();
        waveAnims.forEach(anim => anim.stopAnimation());
      };
    } else {
      pulseAnim.setValue(1);
      waveAnims.forEach(anim => anim.setValue(0.3));
    }
  }, [isRecording]);

  const handlePlayQuestion = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/question_hello_spanish.mp3')
    );
    await sound.playAsync();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    setIsProcessing(true);

    // Simulate processing time (DEMO: always returns correct)
    setTimeout(() => {
      setIsProcessing(false);
      onCorrectAnswer();
    }, 2000);
  };

  if (!exercise) return null;

  return (
    <Surface style={voicePracticeStyles.container}>
      {/* Header */}
      <View style={voicePracticeStyles.header}>
        <View style={voicePracticeStyles.headerIcon}>
          <Text style={{ fontSize: 24 }}>🎤</Text>
        </View>
        <View style={voicePracticeStyles.headerText}>
          <Text style={voicePracticeStyles.headerTitle}>Voice Practice</Text>
          <Text style={voicePracticeStyles.headerSubtitle}>Listen and respond!</Text>
        </View>
      </View>

      {/* Question Card */}
      <View style={voicePracticeStyles.questionCard}>
        <View style={voicePracticeStyles.questionHeader}>
          <Text style={voicePracticeStyles.questionLabel}>Kai asks:</Text>
          <TouchableOpacity 
            style={[
              voicePracticeStyles.playButton,
              isPlayingQuestion && voicePracticeStyles.playButtonActive
            ]}
            onPress={handlePlayQuestion}
            disabled={isPlayingQuestion}
          >
            <MaterialCommunityIcons 
              name={isPlayingQuestion ? "volume-high" : "play-circle"} 
              size={24} 
              color={isPlayingQuestion ? "white" : "#3b82f6"} 
            />
            <Text style={[
              voicePracticeStyles.playButtonText,
              isPlayingQuestion && { color: 'white' }
            ]}>
              {isPlayingQuestion ? 'Playing...' : 'Listen'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={voicePracticeStyles.questionText}>{exercise.question}</Text>
      </View>

      {/* Recording Section */}
      <View style={voicePracticeStyles.recordingSection}>
        {!isRecording && !isProcessing && (
          <>
            <Text style={voicePracticeStyles.recordingHint}>
              {hasRecorded ? 'Tap to record again' : 'Tap the microphone to answer'}
            </Text>
            <TouchableOpacity 
              style={voicePracticeStyles.micButton}
              onPress={handleStartRecording}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={voicePracticeStyles.micGradient}
              >
                <MaterialCommunityIcons name="microphone" size={40} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={voicePracticeStyles.expectedHint}>
              Expected answer: "{exercise.expectedAnswer}"
            </Text>
          </>
        )}

        {isRecording && (
          <>
            <View style={voicePracticeStyles.recordingActive}>
              <View style={voicePracticeStyles.recordingDot} />
              <Text style={voicePracticeStyles.recordingText}>Recording...</Text>
            </View>
            
            {/* Sound waves */}
            <View style={voicePracticeStyles.wavesContainer}>
              {waveAnims.map((anim, index) => (
                <Animated.View 
                  key={index}
                  style={[
                    voicePracticeStyles.wave,
                    index === 2 && voicePracticeStyles.waveCenter,
                    (index === 1 || index === 3) && voicePracticeStyles.waveMid,
                    { transform: [{ scaleY: anim }] }
                  ]} 
                />
              ))}
            </View>

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={voicePracticeStyles.stopButton}
                onPress={handleStopRecording}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="stop" size={40} color="white" />
              </TouchableOpacity>
            </Animated.View>
            <Text style={voicePracticeStyles.stopHint}>Tap to stop</Text>
          </>
        )}

        {isProcessing && (
          <View style={voicePracticeStyles.processingContainer}>
            <View style={voicePracticeStyles.processingSpinner}>
              <MaterialCommunityIcons name="loading" size={40} color="#3b82f6" />
            </View>
            <Text style={voicePracticeStyles.processingText}>Kai is listening...</Text>
            <Text style={voicePracticeStyles.processingSubtext}>Analyzing your answer</Text>
          </View>
        )}
      </View>
    </Surface>
  );
};

const voicePracticeStyles = StyleSheet.create({
  container: { backgroundColor: '#1e293b', borderRadius: 20, padding: 20, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  headerIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#ef444420', justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#f1f5f9' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  questionCard: { backgroundColor: '#334155', borderRadius: 16, padding: 16, marginBottom: 24 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  questionLabel: { fontSize: 13, color: '#94a3b8', fontWeight: '600' },
  playButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b82f620', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, gap: 6 },
  playButtonActive: { backgroundColor: '#3b82f6' },
  playButtonText: { fontSize: 14, fontWeight: '600', color: '#3b82f6' },
  questionText: { fontSize: 20, fontWeight: '700', color: '#f1f5f9', lineHeight: 28 },
  recordingSection: { alignItems: 'center' },
  recordingHint: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  micButton: { marginBottom: 16 },
  micGradient: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  expectedHint: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },
  recordingActive: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ef4444' },
  recordingText: { fontSize: 16, fontWeight: '700', color: '#ef4444' },
  wavesContainer: { flexDirection: 'row', gap: 6, height: 60, alignItems: 'center', marginBottom: 24 },
  wave: { width: 8, height: 30, backgroundColor: '#ef4444', borderRadius: 4 },
  waveMid: { height: 45 },
  waveCenter: { height: 60 },
  stopButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' },
  stopHint: { fontSize: 13, color: '#94a3b8', marginTop: 16 },
  processingContainer: { alignItems: 'center', paddingVertical: 20 },
  processingSpinner: { marginBottom: 16 },
  processingText: { fontSize: 18, fontWeight: '700', color: '#f1f5f9' },
  processingSubtext: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
});

// ==================== TOPIC CARD ====================
const TopicCard = ({ topic, onPress }: { topic: typeof TOPICS[0]; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Surface style={[styles.topicCard, { borderLeftColor: topic.color }]}>
      <View style={[styles.topicIcon, { backgroundColor: `${topic.color}20` }]}>
        <Text style={styles.topicIconText}>{topic.icon}</Text>
      </View>
      <View style={styles.topicInfo}>
        <Text style={[styles.topicTitle, { color: topic.color }]}>{topic.title}</Text>
        <Text style={styles.topicDescription}>{topic.description}</Text>
        {topic.isVoicePractice && (
          <View style={styles.voiceBadge}>
            <MaterialCommunityIcons name="microphone" size={12} color="#ef4444" />
            <Text style={styles.voiceBadgeText}>Voice Practice</Text>
          </View>
        )}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={topic.color} />
    </Surface>
  </TouchableOpacity>
);

// ==================== MAIN COMPONENT ====================
export default function CenterScreen() {
  const { speak, stop, isSpeaking } = useSpeech();
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useVoiceInput();
  
  const [selectedTopic, setSelectedTopic] = useState<typeof TOPICS[0] | null>(null);
  const [showSpeaking, setShowSpeaking] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showCorrect, setShowCorrect] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [customResponse, setCustomResponse] = useState('');

  const handleTopicSelect = (topic: typeof TOPICS[0]) => {
    setSelectedTopic(topic);
    setCurrentResponse(topic.response);
    
    if (!topic.isVoicePractice) {
      setShowSpeaking(true);
      setTimeout(() => {
        speak(topic.response);
      }, 500);
    }
  };

  const handleStopSpeaking = () => {
    stop();
    setShowSpeaking(false);
  };

  const handleCorrectAnswer = () => {
    setShowCorrect(true);
  };

  const handleCloseCorrect = () => {
    setShowCorrect(false);
    // Optionally speak the correct response
    if (selectedTopic?.voiceExercise?.correctResponse) {
      speak(selectedTopic.voiceExercise.correctResponse);
    }
  };

  const handleListenAgain = () => {
    if (currentResponse) {
      setShowSpeaking(true);
      setTimeout(() => {
        speak(currentResponse);
      }, 500);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
  };

  const handleVoiceQuestion = (question: string) => {
    // Simulate AI response based on the question
    const response = `Great question, ${STUDENT.name}! You asked: "${question}". 

Let me help you with that! Remember, learning is like soccer practice - the more you do it, the better you get. Keep asking questions, that's what champions do! 

Bismillah, you're doing great! 🌟`;

    setCustomResponse(response);
    setCurrentResponse(response);
    setShowSpeaking(true);
    
    setTimeout(() => {
      speak(response);
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Speaking Overlay */}
      <KaiSpeakingOverlay
        visible={showSpeaking}
        text={currentResponse}
        onClose={handleStopSpeaking}
        isSpeaking={isSpeaking}
      />

      {/* Correct Answer Overlay */}
      <CorrectAnswerOverlay
        visible={showCorrect}
        onClose={handleCloseCorrect}
        message={selectedTopic?.voiceExercise?.correctResponse || "Great job!"}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Mentor Kai</Text>
            <Text style={styles.headerSubtitle}>{STUDENT.name}'s Personal Tutor</Text>
            <View style={styles.demoBadge}>
              <View style={styles.demoIndicator} />
              <Text style={styles.demoText}>Demo Mode - Personalized</Text>
            </View>
          </View>
          <View style={styles.kaiAvatar}>
            <Text style={styles.kaiAvatarEmoji}>🤖</Text>
          </View>
        </View>

        {selectedTopic && !showSpeaking && !showCorrect && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => { setSelectedTopic(null); setShowQuiz(false); setCustomResponse(''); }}
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color="#f1f5f9" />
            <Text style={styles.selectedTopicIcon}>{selectedTopic.icon}</Text>
            <Text style={styles.selectedTopicTitle}>{selectedTopic.title}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {!selectedTopic ? (
          <>
            {/* Voice Input */}
            <VoiceInputSection
              isListening={isListening}
              transcript={transcript}
              onStartListening={startListening}
              onStopListening={stopListening}
              onSend={handleVoiceQuestion}
              onClear={clearTranscript}
            />

            {/* Topics List */}
            <Text style={styles.sectionTitle}>Choose a Topic</Text>
            <View style={styles.topicsList}>
              {TOPICS.map((topic) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  onPress={() => handleTopicSelect(topic)} 
                />
              ))}
            </View>
          </>
        ) : selectedTopic.isVoicePractice ? (
          // Voice Practice Mode
          <View style={styles.responseContainer}>
            <VoicePracticeSection
              exercise={selectedTopic.voiceExercise}
              onCorrectAnswer={handleCorrectAnswer}
              speak={speak}
            />
          </View>
        ) : (
          // Normal Topic Response
          <View style={styles.responseContainer}>
            {/* Voice Input for follow-up */}
            <VoiceInputSection
              isListening={isListening}
              transcript={transcript}
              onStartListening={startListening}
              onStopListening={stopListening}
              onSend={handleVoiceQuestion}
              onClear={clearTranscript}
            />

            {/* Response Card */}
            <Surface style={styles.responseCard}>
              <View style={styles.responseCardHeader}>
                <View style={styles.kaiLabel}>
                  <Text style={styles.kaiLabelEmoji}>🤖</Text>
                  <Text style={styles.kaiLabelText}>Kai</Text>
                </View>
                <TouchableOpacity 
                  style={styles.listenButton}
                  onPress={handleListenAgain}
                >
                  <MaterialCommunityIcons name="volume-high" size={18} color="#10b981" />
                  <Text style={styles.listenButtonText}>Listen</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.responseText}>
                {customResponse || (selectedTopic?.response || '')}
              </Text>
            </Surface>

            {/* Quiz Button or Quiz Section */}
            {selectedTopic?.quiz && !showQuiz && !customResponse && (
              <TouchableOpacity style={styles.quizButton} onPress={handleStartQuiz}>
                <MaterialCommunityIcons name="help-circle" size={24} color="white" />
                <Text style={styles.quizButtonText}>Take the Quiz!</Text>
                <Text style={styles.quizXP}>+30 XP</Text>
              </TouchableOpacity>
            )}

            {showQuiz && selectedTopic?.quiz && (
              <QuizSection 
                quiz={selectedTopic.quiz} 
                onComplete={handleQuizComplete}
                speak={speak}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#1e293b' },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#f1f5f9' },
  headerSubtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  demoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#334155', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginTop: 10, alignSelf: 'flex-start' },
  demoIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 8 },
  demoText: { fontSize: 12, color: '#94a3b8' },
  kaiAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center' },
  kaiAvatarEmoji: { fontSize: 30 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 },
  selectedTopicIcon: { fontSize: 20 },
  selectedTopicTitle: { fontSize: 16, color: '#f1f5f9', fontWeight: '600' },
  content: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#f1f5f9', marginBottom: 16 },
  topicsList: { gap: 12 },
  topicCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderLeftWidth: 4, gap: 14 },
  topicIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  topicIconText: { fontSize: 24 },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 17, fontWeight: '700' },
  topicDescription: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  voiceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef444420', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, marginTop: 6, alignSelf: 'flex-start', gap: 4 },
  voiceBadgeText: { fontSize: 11, color: '#ef4444', fontWeight: '600' },
  responseContainer: { flex: 1 },
  responseCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 20 },
  responseCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  kaiLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kaiLabelEmoji: { fontSize: 20 },
  kaiLabelText: { fontSize: 16, fontWeight: '700', color: '#10b981' },
  listenButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b98120', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, gap: 6 },
  listenButtonText: { fontSize: 14, fontWeight: '600', color: '#10b981' },
  responseText: { fontSize: 15, lineHeight: 24, color: '#f1f5f9' },
  quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8b5cf6', padding: 16, borderRadius: 16, marginTop: 16, gap: 10 },
  quizButtonText: { fontSize: 18, fontWeight: '700', color: 'white' },
  quizXP: { fontSize: 14, color: '#fbbf24', fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
});