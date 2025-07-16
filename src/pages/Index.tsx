import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TestSelectionForm, { TestConfig } from "@/components/TestSelectionForm";
import QuizInterface from "@/components/QuizInterface";
import TestResults from "@/components/TestResults";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";
import Leaderboard from "@/components/Leaderboard";
import ChatRoom from "@/components/ChatRoom";
import { TestResults as TestResultsType } from "@/components/QuizInterface";
import { authService } from "@/services/authService";
import { User } from "@/types/user";
import { BookOpen, Target, TrendingUp, Users } from "lucide-react";

type AppState = 'auth' | 'dashboard' | 'selection' | 'test' | 'results' | 'leaderboard' | 'chat';

export default function Index() {
  const [currentState, setCurrentState] = useState<AppState>('auth');
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [testResults, setTestResults] = useState<TestResultsType | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentState('dashboard');
    }
  }, []);

  const handleLogin = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setCurrentState('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentState('auth');
    setTestConfig(null);
    setTestResults(null);
  };

  const handleStartQuiz = () => {
    setCurrentState('selection');
  };

  const handleStartTest = (config: TestConfig) => {
    setTestConfig(config);
    setCurrentState('test');
  };

  const handleTestComplete = (results: TestResultsType) => {
    // Refresh user data to get updated quiz history
    const updatedUser = authService.getCurrentUser();
    setCurrentUser(updatedUser);
    setTestResults(results);
    setCurrentState('results');
  };

  const handleRetakeTest = () => {
    setCurrentState('selection');
  };

  const handleGoHome = () => {
    setCurrentState('dashboard');
    setTestConfig(null);
    setTestResults(null);
  };

  const handleGoBack = () => {
    setCurrentState('selection');
  };

  const handleViewLeaderboard = () => {
    setCurrentState('leaderboard');
  };

  const handleOpenChat = () => {
    setCurrentState('chat');
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
  };

  // Authentication flow
  if (currentState === 'auth') {
    return <AuthForm onLogin={handleLogin} />;
  }

  // Dashboard
  if (currentState === 'dashboard' && currentUser) {
    return (
      <Dashboard
        user={currentUser}
        onStartQuiz={handleStartQuiz}
        onViewLeaderboard={handleViewLeaderboard}
        onOpenChat={handleOpenChat}
        onLogout={handleLogout}
      />
    );
  }

  // Quiz Selection
  if (currentState === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-background bg-cyber-grid p-4">
        <div className="container mx-auto py-8">
          <TestSelectionForm onStartTest={handleStartTest} />
        </div>
      </div>
    );
  }

  // Quiz Interface
  if (currentState === 'test' && testConfig) {
    return (
      <div className="min-h-screen bg-gradient-background bg-cyber-grid p-4">
        <div className="container mx-auto py-8">
          <QuizInterface 
            config={testConfig} 
            onTestComplete={handleTestComplete}
            onGoBack={handleGoBack}
          />
        </div>
      </div>
    );
  }

  // Test Results
  if (currentState === 'results' && testResults) {
    return (
      <div className="min-h-screen bg-gradient-background bg-cyber-grid p-4">
        <div className="container mx-auto py-8">
          <TestResults 
            results={testResults}
            onRetakeTest={handleRetakeTest}
            onGoHome={handleGoHome}
          />
        </div>
      </div>
    );
  }

  // Leaderboard
  if (currentState === 'leaderboard') {
    return <Leaderboard onBack={handleBackToDashboard} />;
  }

  // Chat Room
  if (currentState === 'chat') {
    return <ChatRoom onBack={handleBackToDashboard} />;
  }

  // Fallback to auth if no valid state
  return <AuthForm onLogin={handleLogin} />;
}
