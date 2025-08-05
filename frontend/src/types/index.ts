export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  title: string;
  createdAt: number;
}

export type Language = 'english' | 'french' | 'ewondo' | 'douala' | 'bassa';

export interface LanguageOption {
  id: Language;
  name: string;
  nativeName: string;
}

export const languages: LanguageOption[] = [
  { id: 'english', name: 'English', nativeName: 'English' },
  { id: 'french', name: 'French', nativeName: 'Français' },
  { id: 'ewondo', name: 'Ewondo', nativeName: 'Ewondo' },
  { id: 'douala', name: 'Douala', nativeName: 'Duala' },
  { id: 'bassa', name: 'Bassa', nativeName: 'Bassa' },
];

// Basic translations for local languages
export const localTranslations: Record<string, Record<Language, string>> = {
  welcomeTitle: {
    english: 'Welcome to MediAssist!',
    french: 'Bienvenue sur MediAssist!',
    ewondo: 'Mbôlô ya MediAssist!',
    douala: 'O pohi o MediAssist!',
    bassa: 'Bep ba MediAssist!'
  },
  welcomeMessage: {
    english: 'Ask me anything about your diagnosis, treatment, or medications and I\'ll do my best to help.',
    french: 'Posez-moi des questions sur votre diagnostic, votre traitement ou vos médicaments et je ferai de mon mieux pour vous aider.',
    ewondo: 'Sílí ma mam mése ma kómbá yá diagnôsís yíé, yá ábûlú wôé kàná yá mébálá wôé, ma ye bôm wo ná ma vé wôé mbôlé.',
    douala: 'Uwse mba mambo ma diagnosis ong, bwanga bong kana metiba mong, na mbale na o embolo.',
    bassa: 'Bi ma mam nyegse bi ma diagnostic yok, bolong yok ni bilok bi yok, me ga bon we ni me timbhe wo.'
  },
  newChatButton: {
    english: 'New Chat',
    french: 'Nouvelle Discussion',
    ewondo: 'Nkóbó Mfên',
    douala: 'Pena pe',
    bassa: 'Pena i hiele'
  },
  note: {
    english: 'Note: This assistant provides general health information and is not a replacement for professional medical advice.',
    french: 'Remarque: Cet assistant fournit des informations générales sur la santé et ne remplace pas les conseils médicaux professionnels.',
    ewondo: 'Zên: Mbôlé nyí a ne ntam akúmá ngá mambá mése ma kawulu ya mbôl, a si ne ntam a bele ya mintangan.',
    douala: 'O bia: Mumbolo mu si timba mba mboa bwanga.',
    bassa: 'Benge: Mumbolo mi si timbe mam ma mingenge mi mboa bilok.'
  },
  sendMessage: {
    english: 'Send',
    french: 'Envoyer',
    ewondo: 'Lôm',
    douala: 'Loma',
    bassa: 'Lom'
  },
  inputPlaceholder: {
    english: 'Ask about your diagnosis, treatment or medication...',
    french: 'Posez des questions sur votre diagnostic, traitement ou médicament...',
    ewondo: 'Síli ma mambá ma diagnôsís yíé, abúlú kàná mebálá...',
    douala: 'Uwse ma mboa diagnosis, bwanga to metiba...',
    bassa: 'Bi mam ma diagnostic yok, bolong ni bilok...'
  },
  thinking: {
    english: 'MediAssist is thinking...',
    french: 'MediAssist réfléchit...',
    ewondo: 'MediAssist a nkóbán...',
    douala: 'MediAssist a ta pensa...',
    bassa: 'MediAssist i nyenge...'
  },
  enterToSend: {
    english: 'Press Enter to send, Shift+Enter for a new line',
    french: 'Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne',
    ewondo: 'Biáte Enter ntam álôm, Shift+Enter ntam áyém mfên',
    douala: 'Dipa Enter o loma, Shift+Enter po pena',
    bassa: 'Toho Enter i lom, Shift+Enter i pena hiele'
  },
  you: {
    english: 'You',
    french: 'Vous',
    ewondo: 'Wo',
    douala: 'Ua',
    bassa: 'We'
  },
  assistant: {
    english: 'MediAssist',
    french: 'MediAssist',
    ewondo: 'MediAssist',
    douala: 'MediAssist',
    bassa: 'MediAssist'
  },
  poweredBy: {
    english: 'Powered by Large Language Model',
    french: 'Propulsé par un modèle linguistique avancé',
    ewondo: 'Akúmá ya modèle nkɔ́bɔ́ nén',
    douala: 'Na ndolo ya model nde bwam',
    bassa: 'I bon ni model i tohle'
  },
  patientEducation: {
    english: 'Patient Education',
    french: 'Éducation du Patient',
    ewondo: 'Ayángélí ya Minkaî',
    douala: 'Leele la bakoni',
    bassa: 'Yega i bakoni'
  },
  patientEducationDesc: {
    english: 'Get clear explanations about your medical conditions, treatments and medications.',
    french: 'Obtenez des explications claires sur vos conditions médicales, traitements et médicaments.',
    ewondo: 'Kóbá njíndán mése ma kawúlú ya môl wôé, abúlú kàná mebálá.',
    douala: 'O kusa malimbisedi ma kawulu ya mbodi ong, bwanga ni metiba mong.',
    bassa: 'Koba matibil ma kila ni kawul yok, bolong ni bilok bi yok.'
  },
  medicationSupport: {
    english: 'Medication Support',
    french: 'Support Médicamenteux',
    ewondo: 'Mbôlé ya Mebálá',
    douala: 'Embolo ya metiba',
    bassa: 'Bola bi bilok'
  },
  medicationSupportDesc: {
    english: 'Learn about proper dosage, potential side effects, and interactions.',
    french: 'Renseignez-vous sur la posologie appropriée, les effets secondaires potentiels et les interactions.',
    ewondo: 'Yángá ntén nya mbálá, mjôm wa bebélá ve ve, ya akúmá na mebálá mefé.',
    douala: 'Leele ndenge ya metiba, mbimba mi metiba ni matimbisedi na metiba mipe.',
    bassa: 'Yega ndenge i bilok, mam mi bilok bi nhol ni bitimbhe na bilok bipe.'
  },
  healthManagement: {
    english: 'Health Management',
    french: 'Gestion de la Santé',
    ewondo: 'Akúmá ya Kawúlú',
    douala: 'Kumbwa ya kawulu',
    bassa: 'Mbom i kawul'
  },
  healthManagementDesc: {
    english: 'Get tips on managing chronic conditions and maintaining overall well-being.',
    french: 'Obtenez des conseils sur la gestion des maladies chroniques et le maintien du bien-être général.',
    ewondo: 'Kóbá maléndá ma abôm mbεlá étètε na kawúlú yá môl ya mbemá.',
    douala: 'Kusa mabwaise ma abom bekawulu bi tetele ni kawulu ya mbodi esele.',
    bassa: 'Koba matehe ma bom bekawul bi tetele ni kawul i yol isele.'
  },
  backendError: {
    english: 'Make sure the Python backend server is running.',
    french: 'Assurez-vous que le serveur backend Python est en cours d\'exécution.',
    ewondo: 'Bôm ná serveur ya ntán á nkóbán.',
    douala: 'O bia te server a nkobane.',
    bassa: 'Bon ni server i nkoban.'
  },
  listeningNow: {
    english: 'Listening... Speak now',
    french: 'Écoute... Parlez maintenant',
    ewondo: 'A wôk... Kóbán yané',
    douala: 'A singa... Kobane',
    bassa: 'I yega... Kob'
  }
};