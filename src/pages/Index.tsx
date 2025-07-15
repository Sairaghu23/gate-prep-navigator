import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TestSelectionForm, { TestConfig } from "@/components/TestSelectionForm";
import QuizInterface from "@/components/QuizInterface";
import TestResults from "@/components/TestResults";
import { TestResults as TestResultsType } from "@/components/QuizInterface";
import { BookOpen, Target, TrendingUp, Users } from "lucide-react";

type AppState = 'home' | 'selection' | 'test' | 'results';

export default function Index() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [testResults, setTestResults] = useState<TestResultsType | null>(null);

  const handleStartSelection = () => {
    setCurrentState('selection');
  };

  const handleStartTest = (config: TestConfig) => {
    setTestConfig(config);
    setCurrentState('test');
  };

  const handleTestComplete = (results: TestResultsType) => {
    setTestResults(results);
    setCurrentState('results');
  };

  const handleRetakeTest = () => {
    setCurrentState('selection');
  };

  const handleGoHome = () => {
    setCurrentState('home');
    setTestConfig(null);
    setTestResults(null);
  };

  const handleGoBack = () => {
    setCurrentState('selection');
  };

  if (currentState === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-background p-4">
        <div className="container mx-auto py-8">
          <TestSelectionForm onStartTest={handleStartTest} />
        </div>
      </div>
    );
  }

  if (currentState === 'test' && testConfig) {
    return (
      <div className="min-h-screen bg-gradient-background p-4">
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

  if (currentState === 'results' && testResults) {
    return (
      <div className="min-h-screen bg-gradient-background p-4">
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

  // Home page
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground animate-fade-in">
            GATE Mock Test
            <span className="block text-primary">Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Practice with realistic GATE exam questions, track your performance, 
            and identify areas for improvement with our comprehensive mock test platform.
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleStartSelection}
            className="text-lg px-8 py-6 animate-bounce-in"
          >
            <BookOpen className="h-5 w-5" />
            Start Mock Test
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="text-center pb-4">
              <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Multiple Subjects</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Practice across all GATE branches including CSE, ECE, ME, CE, EE, and more with 
                subject-specific questions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="text-center pb-4">
              <div className="h-12 w-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-success-foreground" />
              </div>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Get detailed performance reports with topic-wise analysis and 
                personalized recommendations for improvement.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="text-center pb-4">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Adaptive Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Choose from Easy, Medium, or Advanced difficulty levels to match 
                your preparation stage and gradually increase challenge.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">6+</div>
                <div className="text-muted-foreground">GATE Branches</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-muted-foreground">Subjects Covered</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-muted-foreground">Practice Questions</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-muted-foreground">Access Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 GATE Mock Test Platform. Built for aspiring engineers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
