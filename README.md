# Patient Voice Clarity Bot

## 🧠 Track 2: Large Language Model for Enhanced Patient Education and Support

### 🚀 Challenge Summary

This project addresses the challenge of limited patient education due to high physician workload and time constraints. It proposes a **conversational AI system** powered by open-source **Large Language Models (LLMs)** that serves as a **virtual patient assistant**, helping patients better understand their diagnoses, treatments, and medications in clear, culturally appropriate language.

---

## 💬 Core Features

### 1. Patient Support Chatbot

- Built using open-source LLMs such as **LLaMA**, **Mistral**, or **Google Gemini**
- Capable of processing both **written and spoken patient queries**
- Provides **medically accurate**, **culturally sensitive**, and **easy-to-understand** responses
- Developed using:
  - **Frontend**: React.js (Web)
  - **Backend**: Node.js / Express.js (or equivalent) with optional cloud support (e.g., GCP or local servers)
- Uses **LangChain** for:
  - Managing conversational flow
  - Implementing **Retrieval-Augmented Generation (RAG)** logic
- Accessible design with **multilingual support** and voice/text input options

### 2. Diagnostic & Therapeutic Explanation Module

- Explains:
  - Patient diagnoses
  - Prescribed treatments and medications
  - Lifestyle recommendations and side effects
- Translates complex medical terminology into **layperson-friendly** language
- Delivers answers with **empathy** and **personalization**
- Does **not** make clinical decisions; only interprets clinician-provided summaries
- Enhanced via:
  - Prompt engineering
  - Synthetic medical datasets
  - Retrieval from curated clinical summaries using LangChain

### 3. Testing, Evaluation, and Clinical Review

- Conducted structured **usability testing** and **accuracy evaluation**
- Compared chatbot responses to clinician answers using checklists/questionnaires
- Evaluation focused on:
  - **Medical accuracy**
  - **Clarity of explanation**
  - **Empathetic delivery**

---

## 📦 Technologies Used

| Layer           | Tools / Libraries                               |
|----------------|--------------------------------------------------|
| Frontend        | React.js, TailwindCSS, TypeScript               |
| Backend         | Node.js / Express.js (if applicable), Supabase |
| LLM Integration | Mistral, LLaMA-2, LangChain                     |
| Cloud Infra     | Google Cloud / Local Server Deployment         |
| Database        | PostgreSQL (with RLS and triggers)             |

---

## 🔐 Authentication & Database

- User profiles and authentication managed via **PostgreSQL**
- Custom triggers ensure user profiles are created on sign-up
- **Row-Level Security (RLS)** policies restrict access to each user's data
- All profile updates are timestamped automatically

---

## 📈 Future Improvements

- Enable offline mode for remote hospitals
- Integrate with Electronic Health Records (EHRs)
- Expand multilingual support (including local dialects)
- Conduct broader clinical testing and feedback loops

---

## 🧪 Deployment & Testing

- Deployed on [your platform here]
- Tested for:
  - Response accuracy
  - Language clarity
  - User experience
- Review and validation by medical professionals pending/finalized

---

## 📄 License

This project is developed for the **DGH Hackathon Challenge** under Track 2. License and use are subject to the hackathon rules.
