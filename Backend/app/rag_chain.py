from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

def load_rag_chain():
    # === Load TinyLLaMA model and tokenizer ===
    model_path = "C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/models/finetuned_tinyllama"
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        device_map="auto",
        torch_dtype=torch.float16
    )

    # === HF pipeline wrapping ===
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=256,
        temperature=0.2,
        top_p=0.95,
        repetition_penalty=1.1
    )

    # === LangChain LLM wrapper ===
    llm = HuggingFacePipeline(pipeline=pipe)

    # === Load vector DB (FAISS) ===
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectordb = FAISS.load_local(
        folder_path="C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/faiss_index",
        embeddings=embeddings,
        allow_dangerous_deserialization=True
    )

    # === Create Retrieval-based QA Chain ===
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectordb.as_retriever(),
        return_source_documents=True
    )

    return qa_chain
