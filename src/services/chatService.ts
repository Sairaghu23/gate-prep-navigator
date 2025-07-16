import { ChatMessage } from '@/types/user';
import { authService } from './authService';

class ChatService {
  private readonly CHAT_KEY = 'gate_chat_messages';

  // Mock chat data
  private mockMessages: ChatMessage[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Alex Kumar',
      userBranch: 'CSE',
      message: 'Can someone explain the difference between BFS and DFS traversal?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isTopScorer: false
    },
    {
      id: '2',
      userId: '2',
      userName: 'Priya Singh',
      userBranch: 'CSE',
      message: 'BFS uses a queue and explores level by level, while DFS uses a stack (or recursion) and goes deep first. For shortest path in unweighted graphs, use BFS.',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      isTopScorer: true
    },
    {
      id: '3',
      userId: '3',
      userName: 'Rahul Sharma',
      userBranch: 'CSE',
      message: 'Also remember: DFS is better for detecting cycles, BFS for finding shortest path in unweighted graphs.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isTopScorer: true
    }
  ];

  constructor() {
    if (!localStorage.getItem(this.CHAT_KEY)) {
      this.saveMessages(this.mockMessages);
    }
  }

  private getMessages(): ChatMessage[] {
    const messages = localStorage.getItem(this.CHAT_KEY);
    return messages ? JSON.parse(messages) : this.mockMessages;
  }

  private saveMessages(messages: ChatMessage[]): void {
    localStorage.setItem(this.CHAT_KEY, JSON.stringify(messages));
  }

  getMessagesByBranch(branch: string): ChatMessage[] {
    const messages = this.getMessages();
    return messages
      .filter(m => m.userBranch === branch)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  sendMessage(message: string): boolean {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return false;

    const messages = this.getMessages();
    
    // Check if user is top scorer (for display purposes)
    const branchUsers = authService.getUsersByBranch(currentUser.branch);
    const isTopScorer = branchUsers
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 5)
      .some(u => u.id === currentUser.id);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userBranch: currentUser.branch,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isTopScorer
    };

    messages.push(newMessage);
    this.saveMessages(messages);
    return true;
  }

  canAccessChat(): boolean {
    const currentUser = authService.getCurrentUser();
    return currentUser ? currentUser.totalQuizzes > 0 : false;
  }
}

export const chatService = new ChatService();