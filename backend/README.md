# TinyLlama Chatbot Backend

This is a FastAPI backend service that interfaces with the TinyLlama model to provide chat responses.

## Requirements

- Python 3.8+
- TinyLlama model file at: `C:/Users/Allan/.cache/huggingface/models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf`

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

The server will start at http://localhost:8000.

## API Endpoints

- `GET /`: Check if the API is running
- `POST /chat`: Send a message and get a response

### Chat Request Format

```json
{
  "message": "Your question here"
}
```

### Chat Response Format

```json
{
  "response": "TinyLlama's answer here"
}
```

## Notes

- Make sure the model path in `main.py` points to your local TinyLlama model file
- The backend needs to be running for the chatbot to work