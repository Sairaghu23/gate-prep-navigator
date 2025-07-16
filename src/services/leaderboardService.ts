import { LeaderboardEntry } from '@/types/user';
import { authService } from './authService';

class LeaderboardService {
  getLeaderboardByBranch(branch: string): LeaderboardEntry[] {
    const users = authService.getUsersByBranch(branch);
    
    // Sort by best score, then by average score, then by total quizzes
    const sortedUsers = users.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
      return b.totalQuizzes - a.totalQuizzes;
    });

    return sortedUsers.slice(0, 10).map((user, index) => ({
      rank: index + 1,
      user: {
        id: user.id,
        name: user.name,
        branch: user.branch
      },
      score: user.bestScore,
      accuracy: user.averageScore,
      timeTaken: user.quizHistory.length > 0 
        ? Math.round(user.quizHistory.reduce((acc, quiz) => acc + quiz.timeTaken, 0) / user.quizHistory.length)
        : 0,
      totalQuizzes: user.totalQuizzes
    }));
  }

  getUserRank(userId: string, branch: string): number {
    const leaderboard = this.getLeaderboardByBranch(branch);
    const userEntry = leaderboard.find(entry => entry.user.id === userId);
    return userEntry ? userEntry.rank : -1;
  }

  isTopScorer(userId: string, branch: string): boolean {
    const rank = this.getUserRank(userId, branch);
    return rank > 0 && rank <= 5;
  }
}

export const leaderboardService = new LeaderboardService();