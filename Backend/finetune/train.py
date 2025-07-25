from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from datasets import load_dataset
from peft import LoraConfig, get_peft_model
import torch

# Load model and tokenizer
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    load_in_4bit=True,
    device_map="auto",
    torch_dtype=torch.bfloat16
)

# Apply LoRA for efficient fine-tuning
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)

# Load dataset
dataset = load_dataset("json", data_files="C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/data/medical_data.json")
def tokenize_function(examples):
    return tokenizer(examples["prompt"], examples["response"], truncation=True, padding="max_length", max_length=512)
tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir="C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/models/finetuned_model",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    learning_rate=2e-4,
    fp16=True,  # Use mixed precision for efficiency
    save_steps=100,
    logging_steps=10
)

# Initialize trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"]
)

# Start fine-tuning
trainer.train()

# Save fine-tuned model
model.save_pretrained("C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/models/finetuned_model")
tokenizer.save_pretrained("C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/models/finetuned_model")
print("Fine-tuning complete. Model saved to finetuned_model.")