import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestResults as TestResultsType } from "./QuizInterface";
import { Trophy, Clock, Target, BookOpen, RotateCcw, Home } from "lucide-react";

interface TestResultsProps {
  results: TestResultsType;
  onRetakeTest: () => void;
  onGoHome: () => void;
}

export default function TestResults({ results, onRetakeTest, onGoHome }: TestResultsProps) {
  const { config, questions, answers, timeSpent, score, topicPerformance } = results;
  
  const correctAnswers = answers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;
  
  const incorrectAnswers = answers.filter((answer, index) => 
    answer !== null && answer !== questions[index].correctAnswer
  ).length;
  
  const skippedAnswers = answers.filter(answer => answer === null).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return "Excellent! You're well prepared for GATE.";
    if (score >= 75) return "Good performance! Keep practicing to reach excellence.";
    if (score >= 60) return "Decent attempt. Focus on weak areas for improvement.";
    if (score >= 40) return "Fair performance. Significant improvement needed.";
    return "Needs attention. Consider revisiting fundamentals.";
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    Object.entries(topicPerformance).forEach(([topic, performance]) => {
      const accuracy = (performance.correct / performance.total) * 100;
      if (accuracy < 50) {
        recommendations.push(`Focus more on ${topic} – accuracy: ${accuracy.toFixed(0)}%`);
      } else if (accuracy >= 80) {
        recommendations.push(`You perform best in ${topic} – accuracy: ${accuracy.toFixed(0)}%`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push("Maintain consistent practice across all topics.");
    }

    return recommendations;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Overall Results Header */}
      <Card className="shadow-lg border-0 bg-gradient-primary text-primary-foreground">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Trophy className="h-16 w-16 mx-auto animate-bounce-in" />
            <h1 className="text-3xl font-bold">Test Completed!</h1>
            <div className="text-6xl font-bold animate-scale-in">
              {score.toFixed(0)}%
            </div>
            <p className="text-xl opacity-90">
              {getPerformanceMessage(score)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-success">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-destructive">{incorrectAnswers}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-warning">{skippedAnswers}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Correct Answers</span>
                <span className="font-medium">{((correctAnswers / questions.length) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(correctAnswers / questions.length) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Test Details */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Test Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch:</span>
                <Badge variant="secondary">{config.branch}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject:</span>
                <span className="font-medium">{config.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <Badge variant={
                  config.difficulty === 'Easy' ? 'default' : 
                  config.difficulty === 'Medium' ? 'secondary' : 'destructive'
                }>
                  {config.difficulty}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time Spent:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{formatTime(timeSpent)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic-wise Performance */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Topic-wise Performance</CardTitle>
          <CardDescription>Your performance breakdown by topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(topicPerformance).map(([topic, performance]) => {
              const accuracy = (performance.correct / performance.total) * 100;
              return (
                <div key={topic} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{topic}</span>
                    <span className={`text-sm font-medium ${
                      accuracy >= 75 ? 'text-success' : 
                      accuracy >= 50 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {performance.correct}/{performance.total} ({accuracy.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Areas to focus on for improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {getRecommendations().map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onGoHome} size="lg">
          <Home className="h-4 w-4" />
          Go Home
        </Button>
        <Button variant="hero" onClick={onRetakeTest} size="lg">
          <RotateCcw className="h-4 w-4" />
          Retake Test
        </Button>
      </div>
    </div>
  );
}