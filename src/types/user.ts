export interface User {
  id: string;
  email: string;
  name: string;
  branch: string;
  joinedAt: string;
  quizHistory: QuizHistory[];
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
}

export interface QuizHistory {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  duration: number;
  branch: string;
  subject: string;
  difficulty: string;
  timeTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    branch: string;
  };
  score: number;
  accuracy: number;
  timeTaken: number;
  totalQuizzes: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userBranch: string;
  message: string;
  timestamp: string;
  isTopScorer?: boolean;
}