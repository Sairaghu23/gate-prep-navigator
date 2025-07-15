import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, ArrowLeft, ArrowRight, Flag, CheckCircle } from "lucide-react";
import { TestConfig } from "./TestSelectionForm";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  topic: string;
}

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

// Mock questions data - in real app, this would come from API
const generateMockQuestions = (config: TestConfig): Question[] => {
  const questionPool = {
    CSE: {
      Algorithms: [
        {
          question: "What is the time complexity of Quick Sort in the average case?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          correctAnswer: 1,
          topic: "Sorting Algorithms"
        },
        {
          question: "Which data structure is used in Breadth First Search?",
          options: ["Stack", "Queue", "Tree", "Graph"],
          correctAnswer: 1,
          topic: "Graph Algorithms"
        },
        {
          question: "What is the space complexity of Merge Sort?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswer: 2,
          topic: "Sorting Algorithms"
        }
      ]
    },
    ECE: {
      "Signals & Systems": [
        {
          question: "What is the Fourier Transform of a unit impulse function?",
          options: ["1", "0", "∞", "δ(ω)"],
          correctAnswer: 0,
          topic: "Fourier Analysis"
        }
      ]
    }
  };

  const questions = questionPool[config.branch as keyof typeof questionPool]?.[config.subject] || 
    questionPool.CSE.Algorithms;

  return questions.slice(0, 10).map((q, index) => ({
    id: index + 1,
    ...q,
    difficulty: config.difficulty
  }));
};

export default function QuizInterface({ config, onTestComplete, onGoBack }: QuizInterfaceProps) {
  const [questions] = useState<Question[]>(() => generateMockQuestions(config));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(config.duration * 60); // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

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