import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, ArrowLeft, ArrowRight, Flag, CheckCircle, AlertTriangle } from "lucide-react";
import { TestConfig } from "./TestSelectionForm";
import { questionService, Question } from "../services/questionService";
import { authService } from "@/services/authService";


interface QuizInterfaceProps {
  config: TestConfig;
  onTestComplete: (results: TestResults) => void;
  onGoBack: () => void;
}

export interface TestResults {
  config: TestConfig;
  questions: Question[];
  answers: (number | null)[];
  timeSpent: number;
  score: number;
  topicPerformance: Record<string, { correct: number; total: number }>;
}

export default function QuizInterface({ config, onTestComplete, onGoBack }: QuizInterfaceProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load questions on component mount
  useEffect(() => {
    try {
      const generatedQuestions = questionService.generateQuestions(config);
      if (generatedQuestions.length === 0) {
        setError("No questions available for the selected criteria");
        return;
      }
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(null));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
      setLoading(false);
    }
  }, [config]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-lg">Loading questions...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error || questions.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" onClick={onGoBack}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Test</h3>
              <p className="text-muted-foreground mb-4">
                {error || "No questions available for the selected criteria"}
              </p>
              <p className="text-sm text-muted-foreground">
                Please try a different subject or difficulty level.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitTest();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    
    // Calculate results
    let correctCount = 0;
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctCount++;
      
      if (!topicPerformance[question.topic]) {
        topicPerformance[question.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[question.topic].total++;
      if (isCorrect) topicPerformance[question.topic].correct++;
    });

    const results: TestResults = {
      config,
      questions,
      answers,
      timeSpent: config.duration * 60 - timeLeft,
      score: (correctCount / questions.length) * 100,
      topicPerformance
    };

    onTestComplete(results);
  };

  const answeredCount = answers.filter(answer => answer !== null).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header with timer and progress */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onGoBack}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h2 className="font-semibold text-foreground">{config.subject}</h2>
                <p className="text-sm text-muted-foreground">{config.branch} • {config.difficulty}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>{answeredCount}/{questions.length} answered</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className={`h-5 w-5 ${timeLeft < 300 ? 'text-destructive' : 'text-primary'}`} />
                <span className={timeLeft < 300 ? 'text-destructive font-bold' : 'text-foreground'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm animate-scale-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Topic: {currentQuestion.topic}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <CardDescription className="text-base text-foreground leading-relaxed">
            {currentQuestion.question}
          </CardDescription>

          <RadioGroup 
            value={answers[currentQuestionIndex]?.toString() || ""} 
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 text-sm cursor-pointer py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleSubmitTest}
                className="mr-2"
              >
                <Flag className="h-4 w-4" />
                End Test
              </Button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button variant="hero" onClick={handleSubmitTest}>
                  <Flag className="h-4 w-4" />
                  Submit Test
                </Button>
              ) : (
                <Button variant="default" onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}