import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function AboutPage() {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-blue-600 to-orange-500 bg-clip-text text-transparent">
        About MedAssist
      </h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="mb-4">
          MedAssist is a virtual patient assistant designed to provide medical information and support to patients. 
          Our goal is to improve patient education about diagnoses, treatments, and medications through a conversational
          AI system that delivers accurate, easy-to-understand information.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">Our Mission</h2>
        <p className="mb-4">
          To bridge the gap between limited physician time and patients' need for medical information by providing 
          accessible, accurate, and personalized healthcare explanations through advanced AI technology.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">Features</h2>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Natural language conversations about medical topics</li>
          <li>Explanations of diagnoses, treatments, and medications in simple language</li>
          <li>Support for multiple languages (English, French, Fufulde, Ewondo)</li>
          <li>Voice input for accessibility</li>
          <li>Privacy-focused design</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">Technology</h2>
        <p className="mb-4">
          MedAssist uses the BioMistral/BioMistral-7B-DARE model, a specialized large language model trained for medical applications.
          For multilingual support, we use a free online translation service to ensure accessibility across different languages.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">Important Disclaimer</h2>
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
          <p>
            {t.disclaimerText} MedAssist is designed to supplement, not replace, the advice of healthcare professionals.
            Always consult with qualified medical practitioners for diagnosis and treatment.
          </p>
          <p className="mt-2">
            While we strive for accuracy in translations, automated translation may not capture nuances in medical terminology.
            For critical information, please verify with a healthcare provider who speaks your preferred language.
          </p>
        </div>
      </div>
    </div>
  );
}