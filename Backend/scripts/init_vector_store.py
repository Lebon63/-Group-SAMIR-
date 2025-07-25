# scripts/init_vector_store.py
from app.utils import load_medical_documents, create_vector_db

docs = load_medical_documents("data/medical_data.json")
create_vector_db(docs, save_path="faiss_index")
