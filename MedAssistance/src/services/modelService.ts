import axios from 'axios';
import { MODEL_API_URL } from './apiConfig';

// Interface for the model response
interface ModelResponse {
  generated_text: string;
}

// Service for interacting with BioMistral model
export const modelService = {
  /**
   * Generate a response using BioMistral model
   * @param prompt The medical question or prompt
   * @returns The model's generated response
   */
  async generateResponse(prompt: string): Promise<string> {
    try {
      // In a real implementation, you would include your API key in the headers
      // const headers = { Authorization: `Bearer ${API_KEY}` };
      
      // For demo purposes, we'll use a simplified approach without API key
      // You'll need to replace this with proper authentication in production
      const response = await axios.post<ModelResponse>(
        MODEL_API_URL,
        {
          inputs: `You are a helpful medical assistant providing information to patients. 
            Answer the following question in a clear, compassionate way that's easy for non-medical professionals to understand:
            ${prompt}`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
          },
        },
        {
          // headers,
          timeout: 60000, // Models can take time to generate responses
        }
      );

      return response.data.generated_text;
    } catch (error) {
      console.error('Error generating model response:', error);
      
      // Fallback to simulate response if API call fails
      // In production, you would handle this differently
      return `I'm sorry, I couldn't access the medical knowledge database at the moment. 
              Please try again later or consult with your healthcare provider for immediate assistance.`;
    }
  }
};