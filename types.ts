
export interface Song {
  id: string;
  title: string;
  romajiTitle: string;
  coverImage: string;
  youtubeId: string;
  lyrics: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate';
}

export interface VocabularyWord {
  word: string;
  reading: string;
  meaning: string;
  context: string;
}

export interface GrammarPoint {
  point: string;
  explanation: string;
  example: string;
}

export interface AnalysisResponse {
  vocabulary: VocabularyWord[];
  grammar: GrammarPoint[];
  culturalNote: string;
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
