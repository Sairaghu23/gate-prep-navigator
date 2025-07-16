import { User, QuizHistory } from '@/types/user';

export interface SignupData {
  email: string;
  password: string;
  name: string;
  branch: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private readonly USERS_KEY = 'gate_users';
  private readonly CURRENT_USER_KEY = 'gate_current_user';

  // Mock user data
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      branch: 'CSE',
      joinedAt: '2024-01-15',
      quizHistory: [
        {
          id: '1',
          date: '2024-07-15',
          score: 85,
          totalQuestions: 10,
          accuracy: 85,
          duration: 30,
          branch: 'CSE',
          subject: 'Algorithms',
          difficulty: 'Medium',
          timeTaken: 28,
          correctAnswers: 8,
          incorrectAnswers: 2,
          skippedQuestions: 0
        }
      ],
      totalQuizzes: 1,
      averageScore: 85,
      bestScore: 85
    }
  ];

  constructor() {
    // Initialize with mock data if no users exist
    if (!localStorage.getItem(this.USERS_KEY)) {
      this.saveUsers(this.mockUsers);
    }
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : this.mockUsers;
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  signup(data: SignupData): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === data.email)) {
      return { success: false, message: 'User already exists with this email' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      branch: data.branch,
      joinedAt: new Date().toISOString().split('T')[0],
      quizHistory: [],
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    return { success: true, message: 'Account created successfully!', user: newUser };
  }

  login(data: LoginData): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email === data.email);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Simple password check (in real app, use proper hashing)
    if (data.password.length < 3) {
      return { success: false, message: 'Invalid password' };
    }

    this.setCurrentUser(user);
    return { success: true, message: 'Login successful!', user };
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  updateUserQuizHistory(quizResult: QuizHistory): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex].quizHistory.push(quizResult);
      users[userIndex].totalQuizzes += 1;
      
      // Calculate new average and best score
      const scores = users[userIndex].quizHistory.map(q => q.score);
      users[userIndex].averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      users[userIndex].bestScore = Math.max(...scores);

      this.saveUsers(users);
      this.setCurrentUser(users[userIndex]);
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  getUsersByBranch(branch: string): User[] {
    const users = this.getUsers();
    return users.filter(u => u.branch === branch && u.totalQuizzes > 0);
  }
}

export const authService = new AuthService();