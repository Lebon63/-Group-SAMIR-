
## 📁 `README.md` — Backend (Track 2: Patient Voice Clarity Bot)

group members
-Navou MOMO LEBON
-FUL MARVEL TIOBOU
-NGONGUE MODI ALLAN DUVAL
-NERYNNE ANAELLE DINA

---

# 🧠 Track 2: LLM-Enhanced Patient Education and Support – Backend

This backend powers a multilingual, empathetic chatbot that helps patients better understand their diagnoses, medications, and treatments using a fine-tuned Large Language Model (LLM). Built with **FastAPI**, **LangChain**, and **TinyLLaMA**, it offers scalable support for medical question answering and retrieval-augmented generation (RAG).

---

## 📌 Project Overview

> Due to high patient loads and limited clinician time, patients often leave medical consultations with unclear instructions or concerns. Our backend addresses this by offering a conversational AI assistant that delivers:

* Medically accurate explanations
* Culturally appropriate and compassionate responses
* Multilingual and voice-ready interaction support (handled on frontend)

---

## 🧰 Technologies Used

| Tool                        | Purpose                                                |
| --------------------------- | ------------------------------------------------------ |
| 🐍 **Python**               | Main programming language                              |
| ⚡ **FastAPI**               | Web framework to create RESTful API endpoints          |
| 🤗 **Transformers**         | For loading and fine-tuning TinyLLaMA                  |
| 🧠 **LangChain**            | To support optional RAG logic with vector search       |
| 🗃️ **FAISS**               | Vector similarity search for retrieved medical texts   |
| 🔗 **HuggingFace Pipeline** | For wrapping the LLM model inference                   |
| 📦 **PEFT (LoRA)**          | For efficient fine-tuning with adapter layers          |
| 🧪 **Uvicorn**              | ASGI server for running the FastAPI app                |
| 🧠 **TinyLLaMA 1.1B**       | Lightweight open-source LLM fine-tuned on medical data |

---

## 📂 Folder Structure

```bash
Backend/
├── app/
│   ├── main.py            # FastAPI API endpoints
│   ├── model.py           # Loads fine-tuned TinyLLaMA model
│   ├── rag_chain.py       # LangChain RAG setup with FAISS
├── data/
│   └── medical_data.json  # Dataset used to fine-tune model
├── models/
│   └── finetuned_tinyllama/  # Saved fine-tuned LLM
├── fintune/           # containing program to cleam,format the dataset and that to fintune our model
├── requirement.txt       # Python dependencies
├── .gitignore             # Ignores venv and model files

```

---

## 🔧 Core Functionalities

### 🗣️ 1. Conversational Chat Endpoint

* **Endpoint**: `POST /chat`
* **Payload**:

  ```json
  {
    "message": "What is hypertension and how do I manage it?"
  }
  ```
* **Response**:

  ```json
  {
    "response": "Hypertension, also known as high blood pressure, is a condition..."
  }
  ```

### 🧠 2. Fine-tuned LLM Integration

* Uses `TinyLLaMA-1.1B-Chat-v1.0`, fine-tuned with domain-specific Q\&A pairs
* Applied **LoRA (Low-Rank Adaptation)** for efficient training
* Model loaded via `transformers` and wrapped in `HuggingFacePipeline`

### 🔍 3. Optional RAG Support (RetrievalQA)

* Uses **LangChain + FAISS + HuggingFace Embeddings**
* Retrieves static documents or health summaries (optional)
* Enables evidence-backed question answering
* Returns both the answer and source documents if configured

---

## 🧪 Model Fine-tuning (Summary)

1. Base Model: `TinyLLaMA/TinyLLaMA-1.1B-Chat-v1.0`
2. Data: `medical_data.json` containing `prompt` and `response` pairs
3. Method: LoRA fine-tuning using PEFT and `transformers.Trainer`
4. Output: Model saved to `/models/finetuned_tinyllama/`

---

## ▶️ Running the Backend

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the FastAPI app

```bash
uvicorn app.main:app --reload
```

* App will be available at: `http://127.0.0.1:8000`

---

## 🔁 Recreate the Environment

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

---

## 🛠️ Key Files Explained

| File                | Role                                                          |
| ------------------- | ------------------------------------------------------------- |
| `main.py`           | FastAPI endpoints that receive and respond to patient queries |
| `model.py`          | Loads the fine-tuned TinyLLaMA model using HuggingFace        |
| `rag_chain.py`      | (Optional) Initializes RAG pipeline using LangChain + FAISS   |
| `medical_data.json` | JSON data used for model fine-tuning                          |
| `train.py`          | Training script using `Trainer` and LoRA config               |
| `requirements.txt`  | All backend dependencies                                      |

---

## 🧠 Future Improvements

* Add support for real-time streaming responses
* Enable multilingual translation for patient queries/responses
* Integrate voice-to-text and text-to-speech APIs for audio interaction
* Host backend on cloud infrastructure (e.g., GCP or HuggingFace Inference)

