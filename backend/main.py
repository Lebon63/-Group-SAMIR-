import os
import logging
from typing import Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain.llms import LlamaCpp
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="TinyLlama Chat API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class ChatRequest(BaseModel):
    message: str

# Model path - Change this to the actual path on your system
MODEL_PATH = "C:/Users/Allan/.cache/huggingface/models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"

# Initialize model
callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])

try:
    # Initialize LLM with appropriate settings for TinyLlama
    llm = LlamaCpp(
        model_path=MODEL_PATH,
        temperature=0.7,
        max_tokens=500,
        top_p=0.95,
        callback_manager=callback_manager,
        verbose=True,
    )
    logger.info(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    # We'll initialize this to None and handle it in the endpoint
    llm = None

@app.get("/")
def read_root():
    return {"status": "TinyLlama API is running"}

@app.post("/chat")
async def chat(request: ChatRequest) -> Dict[str, Any]:
    """
    Chat endpoint that processes messages and returns responses from TinyLlama.
    """
    if llm is None:
        raise HTTPException(status_code=500, detail=f"Model could not be loaded from {MODEL_PATH}")
    
    try:
        # Format the input for TinyLlama
        prompt = f"<|im_start|>user\n{request.message}<|im_end|>\n<|im_start|>assistant\n"
        
        # Generate response
        logger.info(f"Processing message: {request.message[:50]}...")
        response = llm(prompt)
        logger.info(f"Generated response of length: {len(response)}")
        
        # Clean up response if needed (TinyLlama might include the prompt in the response)
        cleaned_response = response.replace(prompt, "").strip()
        if cleaned_response.endswith("<|im_end|>"):
            cleaned_response = cleaned_response[:-10].strip()
        
        return {
            "response": cleaned_response
        }
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)