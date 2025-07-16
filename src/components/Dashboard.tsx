import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/services/authService';
import { User } from '@/types/user';
import { 
  PlayCircle, 
  Trophy, 
  MessageCircle, 
  Calendar, 
  Target, 
  TrendingUp, 
  Award,
  LogOut,
  User as UserIcon,
  BookOpen
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onStartQuiz: () => void;
  onViewLeaderboard: () => void;
  onOpenChat: () => void;
  onLogout: () => void;
}

export default function Dashboard({ 
  user, 
  onStartQuiz, 
  onViewLeaderboard, 
  onOpenChat, 
  onLogout 
}: DashboardProps) {
  const getMotivationalMessage = () => {
    const messages = [
      `Welcome back, ${user.name}! Let's crush GATE today! 🚀`,
      `Ready to elevate your GATE prep, ${user.name}? 💪`,
      `Time to dominate the mock tests, ${user.name}! ⚡`,
      `Your GATE journey continues, ${user.name}! 🎯`,
      `Let's make today count, ${user.name}! 🌟`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/20 text-success';
      case 'Medium': return 'bg-warning/20 text-warning';
      case 'Advanced': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background bg-cyber-grid">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
                <p className="text-sm text-muted-foreground">{user.branch} • Joined {formatDate(user.joinedAt)}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-border/50 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Motivational Banner */}
        <Card className="bg-gradient-card border-0 shadow-lg pulse-glow">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gradient">{getMotivationalMessage()}</h2>
              <p className="text-muted-foreground">Track your progress, challenge yourself, and achieve GATE success!</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 card-float">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{user.totalQuizzes}</div>
              <div className="text-sm text-muted-foreground">Total Quizzes</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 card-float">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-success-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{user.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 card-float">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{user.bestScore}%</div>
              <div className="text-sm text-muted-foreground">Best Score</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 card-float">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {user.totalQuizzes > 0 ? 'Active' : 'New'}
              </div>
              <div className="text-sm text-muted-foreground">Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            onClick={onStartQuiz}
            className="h-20 text-lg font-semibold bg-gradient-primary hover:scale-105 transition-all btn-glow"
          >
            <PlayCircle className="h-6 w-6 mr-3" />
            Start New Quiz
          </Button>

          <Button
            onClick={onViewLeaderboard}
            variant="outline"
            className="h-20 text-lg font-semibold border-border/50 hover:bg-card/50 hover:scale-105 transition-all"
          >
            <Trophy className="h-6 w-6 mr-3" />
            View Leaderboard
          </Button>

          <Button
            onClick={onOpenChat}
            variant="outline"
            disabled={user.totalQuizzes === 0}
            className="h-20 text-lg font-semibold border-border/50 hover:bg-card/50 hover:scale-105 transition-all disabled:opacity-50"
          >
            <MessageCircle className="h-6 w-6 mr-3" />
            {user.totalQuizzes === 0 ? 'Complete Quiz First' : 'Join Chat Room'}
          </Button>
        </div>

        {/* Quiz History */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Quiz History
            </CardTitle>
            <CardDescription>
              Track your performance and improvement over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.quizHistory.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">No quizzes yet</h3>
                  <p className="text-muted-foreground">Take your first quiz to start tracking your progress!</p>
                </div>
                <Button onClick={onStartQuiz} className="bg-gradient-primary">
                  Take First Quiz
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.quizHistory.slice(-5).reverse().map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>{formatDate(quiz.date)}</TableCell>
                      <TableCell className="font-medium">{quiz.subject}</TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">{quiz.score}%</TableCell>
                      <TableCell>{quiz.accuracy}%</TableCell>
                      <TableCell>{quiz.timeTaken}min</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}