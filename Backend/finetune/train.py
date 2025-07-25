from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer, DataCollatorForLanguageModeling
from datasets import load_dataset
from peft import LoraConfig, get_peft_model
import torch

# === MODEL SETUP ===
model_path = "C:/Users/Allan/Documents/TinyLlama-1.1B-Chat-v1.0"  # Replace with your model path
tokenizer = AutoTokenizer.from_pretrained(model_path)

model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.float32  # Change to float16 if you have a supported GPU and want mixed precision
)

# === APPLY LoRA ===
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)

# === LOAD DATA ===
dataset_path = "C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/data/medical_data.json"
dataset = load_dataset("json", data_files=dataset_path)

# === FORMAT AND TOKENIZE ===
def format_prompt(example):
    return f"### Patient Question:\n{example['prompt']}\n\n### Doctor Explanation:\n{example['response']}"

def tokenize(example):
    return tokenizer(
        format_prompt(example),
        truncation=True,
        padding="max_length",
        max_length=512
    )

tokenized_dataset = dataset.map(tokenize, batched=False)

# === TRAINING ARGS ===
output_dir = "C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/Backend/models/finetuned_model"
training_args = TrainingArguments(
    output_dir=output_dir,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    learning_rate=2e-4,
    fp16=False,  # Set True if you have a supported GPU and want mixed precision training
    save_steps=100,
    logging_steps=10,
    save_total_limit=2,
    dataloader_pin_memory=False  # Prevents warning when no GPU is found
)

# === TRAINER SETUP ===
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False)
)

# === START TRAINING ===
trainer.train()

# === SAVE MODEL ===
model.save_pretrained(output_dir)
tokenizer.save_pretrained(output_dir)
print(f"✅ Fine-tuning complete. Model saved to {output_dir}")
