import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { leaderboardService } from '@/services/leaderboardService';
import { authService } from '@/services/authService';
import { LeaderboardEntry } from '@/types/user';
import { 
  Trophy, 
  Medal, 
  Crown, 
  ArrowLeft, 
  Target, 
  Clock, 
  BookOpen,
  Star
} from 'lucide-react';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    if (currentUser) {
      const entries = leaderboardService.getLeaderboardByBranch(currentUser.branch);
      setLeaderboard(entries);
    }
  }, [currentUser]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-primary/10 border-primary/30";
    
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border-yellow-500/20";
      case 2:
        return "bg-gradient-to-r from-gray-400/10 to-gray-500/5 border-gray-400/20";
      case 3:
        return "bg-gradient-to-r from-orange-600/10 to-orange-700/5 border-orange-600/20";
      default:
        return "bg-card/50 border-border/50";
    }
  };

  const currentUserRank = currentUser 
    ? leaderboardService.getUserRank(currentUser.id, currentUser.branch)
    : -1;

  return (
    <div className="min-h-screen bg-gradient-background bg-cyber-grid">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-border/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-sm text-muted-foreground">
                {currentUser?.branch} Branch Rankings
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Current User Rank Card */}
        {currentUser && currentUserRank > 0 && (
          <Card className="bg-gradient-card border-border/50 pulse-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Your Current Rank</h3>
                    <p className="text-sm text-muted-foreground">
                      Among {currentUser.branch} students
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">#{currentUserRank}</div>
                  <p className="text-sm text-muted-foreground">out of {leaderboard.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Performers */}
        {leaderboard.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboard.slice(0, 3).map((entry, index) => (
              <Card 
                key={entry.user.id}
                className={`${getRankBackground(entry.rank, entry.user.id === currentUser?.id)} card-float`}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {getRankIcon(entry.rank)}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {entry.user.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">{entry.score}%</div>
                    <div className="text-sm text-muted-foreground">Best Score</div>
                    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                      <span>{entry.accuracy}% avg</span>
                      <span>{entry.totalQuizzes} tests</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Full Leaderboard Table */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Complete Rankings - {currentUser?.branch} Branch
            </CardTitle>
            <CardDescription>
              Ranked by best score, average accuracy, and total quizzes completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">No rankings yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to complete a quiz in your branch!
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">
                      <Target className="h-4 w-4 mx-auto" />
                      Best Score
                    </TableHead>
                    <TableHead className="text-center">
                      <BookOpen className="h-4 w-4 mx-auto" />
                      Avg Score
                    </TableHead>
                    <TableHead className="text-center">
                      <Clock className="h-4 w-4 mx-auto" />
                      Avg Time
                    </TableHead>
                    <TableHead className="text-center">Total Tests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((entry) => (
                    <TableRow 
                      key={entry.user.id}
                      className={entry.user.id === currentUser?.id ? "bg-primary/5 border-primary/20" : ""}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {entry.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {entry.user.name}
                              {entry.user.id === currentUser?.id && (
                                <Badge className="ml-2 bg-primary/20 text-primary">You</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{entry.user.branch}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-primary">{entry.score}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{entry.accuracy}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{entry.timeTaken}min</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{entry.totalQuizzes}</Badge>
                      </TableCell>
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