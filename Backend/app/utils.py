import json
from langchain.schema import Document
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings

def create_vector_db(docs, save_path="faiss_index"):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(save_path)
    return vectorstore


def load_medical_documents(json_path: str):
    with open(json_path, 'r') as f:
        data = json.load(f)

    docs = []
    for entry in data:
        content = f"Q: {entry['prompt']}\nA: {entry['response']}"
        docs.append(Document(page_content=content))
    return docs
