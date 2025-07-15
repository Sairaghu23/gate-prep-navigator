import questionsData from '../data/questions.json';
import { TestConfig } from '../components/TestSelectionForm';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  topic: string;
}

export interface QuestionBank {
  [branch: string]: {
    [subject: string]: {
      [difficulty: string]: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
        topic: string;
      }>;
    };
  };
}

// Track used questions across sessions to prevent repeats
const usedQuestions = new Set<string>();

export class QuestionService {
  private questionBank: QuestionBank;

  constructor() {
    this.questionBank = questionsData as QuestionBank;
  }

  // Get question count based on duration
  private getQuestionCount(duration: number): number {
    const durationToQuestions: { [key: number]: number } = {
      15: 5,
      30: 10,
      45: 15,
      60: 20
    };
    
    return durationToQuestions[duration] || Math.floor(duration / 3); // fallback: 1 question per 3 minutes
  }

  // Generate unique key for question tracking
  private getQuestionKey(question: any, branch: string, subject: string, difficulty: string): string {
    return `${branch}-${subject}-${difficulty}-${question.question.substring(0, 20)}`;
  }

  // Shuffle array using Fisher-Yates algorithm
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get available questions for specific criteria
  private getAvailableQuestions(branch: string, subject: string, difficulty: string) {
    const branchData = this.questionBank[branch];
    if (!branchData) {
      throw new Error(`Branch "${branch}" not found in question bank`);
    }

    const subjectData = branchData[subject];
    if (!subjectData) {
      throw new Error(`Subject "${subject}" not found for branch "${branch}"`);
    }

    const difficultyQuestions = subjectData[difficulty.toLowerCase()];
    if (!difficultyQuestions) {
      throw new Error(`Difficulty "${difficulty}" not found for ${branch} - ${subject}`);
    }

    return difficultyQuestions;
  }

  // Filter out already used questions
  private filterUnusedQuestions(questions: any[], branch: string, subject: string, difficulty: string) {
    return questions.filter(question => {
      const key = this.getQuestionKey(question, branch, subject, difficulty);
      return !usedQuestions.has(key);
    });
  }

  // Mark questions as used
  private markQuestionsAsUsed(questions: any[], branch: string, subject: string, difficulty: string) {
    questions.forEach(question => {
      const key = this.getQuestionKey(question, branch, subject, difficulty);
      usedQuestions.add(key);
    });
  }

  // Generate questions for test
  generateQuestions(config: TestConfig): Question[] {
    const { branch, subject, difficulty, duration } = config;
    const requiredCount = this.getQuestionCount(duration);

    try {
      // Get available questions for the exact criteria
      const availableQuestions = this.getAvailableQuestions(branch, subject, difficulty);
      
      // Filter out questions that have been used before
      let unusedQuestions = this.filterUnusedQuestions(availableQuestions, branch, subject, difficulty);
      
      // If not enough unused questions, reset the used questions for this specific criteria
      if (unusedQuestions.length < requiredCount) {
        console.warn(`Not enough unused questions for ${branch}-${subject}-${difficulty}. Resetting used questions for this criteria.`);
        
        // Remove used questions for this specific criteria only
        const keysToRemove = Array.from(usedQuestions).filter(key => 
          key.startsWith(`${branch}-${subject}-${difficulty}`)
        );
        keysToRemove.forEach(key => usedQuestions.delete(key));
        
        unusedQuestions = [...availableQuestions];
      }

      // If still not enough questions, throw an error
      if (unusedQuestions.length < requiredCount) {
        throw new Error(
          `Insufficient questions available. Required: ${requiredCount}, Available: ${unusedQuestions.length} for ${branch} - ${subject} (${difficulty})`
        );
      }

      // Randomize and select required number of questions
      const shuffledQuestions = this.shuffleArray(unusedQuestions);
      const selectedQuestions = shuffledQuestions.slice(0, requiredCount);

      // Mark selected questions as used
      this.markQuestionsAsUsed(selectedQuestions, branch, subject, difficulty);

      // Transform to required format
      return selectedQuestions.map((question, index) => ({
        id: index + 1,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        difficulty: difficulty,
        topic: question.topic
      }));

    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Fallback: try to get questions from the same branch but different subject/difficulty
      return this.generateFallbackQuestions(config, requiredCount);
    }
  }

  // Fallback method when exact criteria questions are not available
  private generateFallbackQuestions(config: TestConfig, requiredCount: number): Question[] {
    const { branch, subject, difficulty } = config;
    
    try {
      const branchData = this.questionBank[branch];
      if (!branchData) {
        throw new Error(`No fallback questions available for branch: ${branch}`);
      }

      let allQuestions: any[] = [];
      
      // Try to get questions from the same subject but different difficulties
      const subjectData = branchData[subject];
      if (subjectData) {
        Object.values(subjectData).forEach(difficultyQuestions => {
          allQuestions = [...allQuestions, ...difficultyQuestions];
        });
      }

      // If still not enough, get from other subjects in the same branch
      if (allQuestions.length < requiredCount) {
        Object.values(branchData).forEach(subjectQuestions => {
          Object.values(subjectQuestions).forEach(difficultyQuestions => {
            allQuestions = [...allQuestions, ...difficultyQuestions];
          });
        });
      }

      if (allQuestions.length === 0) {
        throw new Error(`No questions available for branch: ${branch}`);
      }

      // Randomize and select
      const shuffledQuestions = this.shuffleArray(allQuestions);
      const selectedQuestions = shuffledQuestions.slice(0, Math.min(requiredCount, allQuestions.length));

      console.warn(`Using fallback questions. Requested: ${requiredCount}, Providing: ${selectedQuestions.length}`);

      return selectedQuestions.map((question, index) => ({
        id: index + 1,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        difficulty: difficulty,
        topic: question.topic
      }));

    } catch (error) {
      console.error('Fallback question generation failed:', error);
      return [];
    }
  }

  // Get available subjects for a branch
  getAvailableSubjects(branch: string): string[] {
    const branchData = this.questionBank[branch];
    return branchData ? Object.keys(branchData) : [];
  }

  // Get available difficulties for a branch and subject
  getAvailableDifficulties(branch: string, subject: string): string[] {
    const branchData = this.questionBank[branch];
    if (!branchData || !branchData[subject]) return [];
    
    return Object.keys(branchData[subject]);
  }

  // Get available question count for specific criteria
  getAvailableQuestionCount(branch: string, subject: string, difficulty: string): number {
    try {
      const questions = this.getAvailableQuestions(branch, subject, difficulty);
      return questions.length;
    } catch {
      return 0;
    }
  }

  // Clear used questions (for testing or reset purposes)
  clearUsedQuestions(): void {
    usedQuestions.clear();
  }
}

// Singleton instance
export const questionService = new QuestionService();