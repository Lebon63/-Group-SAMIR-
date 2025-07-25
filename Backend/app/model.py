from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from langchain.llms import HuggingFacePipeline
import torch

# Path to the fine-tuned model
MODEL_PATH = "C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/models/finetuned_tinyllama"

def load_model():
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH,
        torch_dtype=torch.float16,
        device_map="auto"
    )

    # Create HF pipeline
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=512,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7
    )

    # Wrap with LangChain
    llm = HuggingFacePipeline(pipeline=pipe)
    return llm
