import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt for menstrual and maternal health assistant
export const SYSTEM_PROMPT = `You are a helpful and empathetic AI assistant specialized in providing information and support about menstrual health and maternal health. 

Your role is to:
- Provide accurate, evidence-based information about menstrual cycles, pregnancy, postpartum care, and related health topics
- Offer supportive and non-judgmental guidance
- Encourage users to consult healthcare professionals for medical concerns
- Use clear, accessible language appropriate for all users
- Be sensitive to cultural and personal contexts
- Never provide medical diagnoses or replace professional medical advice

Always remind users that for serious health concerns, they should consult with qualified healthcare providers.`;

/**
 * Fetches the OpenAI API key from Firestore
 * The key should be stored in: appConfig/openai document with field: apiKey
 * 
 * To set up in Firebase Console:
 * 1. Go to Firestore Database
 * 2. Create a collection named "appConfig"
 * 3. Create a document with ID "openai"
 * 4. Add a field: apiKey (string) with your OpenAI API key value
 * 5. Set Firestore security rules to restrict access (see CHAT_SETUP.md)
 * 
 * @returns {Promise<string|null>} The API key or null if not found/error
 */
export const getOpenAIApiKey = async () => {
  try {
    const configDocRef = doc(db, 'appConfigKratika', 'openai');
    const configDoc = await getDoc(configDocRef);
    
    if (configDoc.exists()) {
      const data = configDoc.data();
      return data.apiKey || null;
    }
    
    console.warn('OpenAI API key not found in Firestore. Please configure it in appConfig/openai');
    return null;
  } catch (error) {
    console.error('Error fetching OpenAI API key from Firestore:', error);
    return null;
  }
};

