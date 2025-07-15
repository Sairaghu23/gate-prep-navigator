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
      "Algorithms": [
        {
          question: "What is the worst-case time complexity of Quick Sort?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          correctAnswer: 2,
          topic: "Sorting Algorithms"
        },
        {
          question: "Which algorithm is used for finding strongly connected components?",
          options: ["Dijkstra's", "Kruskal's", "Kosaraju's", "Prim's"],
          correctAnswer: 2,
          topic: "Graph Algorithms"
        },
        {
          question: "What is the space complexity of merge sort?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctAnswer: 2,
          topic: "Sorting Algorithms"
        },
        {
          question: "In a min-heap with n elements, what is the time complexity to extract minimum?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswer: 1,
          topic: "Data Structures"
        },
        {
          question: "Which of the following is NOT a stable sorting algorithm?",
          options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Insertion Sort"],
          correctAnswer: 2,
          topic: "Sorting Algorithms"
        },
        {
          question: "What is the time complexity of finding an element in a balanced BST?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswer: 1,
          topic: "Data Structures"
        },
        {
          question: "Which algorithm is used for topological sorting?",
          options: ["BFS", "DFS", "Both BFS and DFS", "Dijkstra's"],
          correctAnswer: 2,
          topic: "Graph Algorithms"
        },
        {
          question: "What is the maximum number of edges in a simple graph with n vertices?",
          options: ["n", "n-1", "n(n-1)/2", "n²"],
          correctAnswer: 2,
          topic: "Graph Theory"
        }
      ],
      "Data Structures": [
        {
          question: "Which data structure is used to implement recursion?",
          options: ["Queue", "Stack", "Tree", "Graph"],
          correctAnswer: 1,
          topic: "Stack"
        },
        {
          question: "What is the maximum height of an AVL tree with n nodes?",
          options: ["O(log n)", "O(n)", "O(√n)", "O(n log n)"],
          correctAnswer: 0,
          topic: "Trees"
        },
        {
          question: "In a circular linked list, the last node points to:",
          options: ["NULL", "First node", "Previous node", "Itself"],
          correctAnswer: 1,
          topic: "Linked Lists"
        },
        {
          question: "What is the time complexity of inserting an element at the beginning of an array?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctAnswer: 2,
          topic: "Arrays"
        },
        {
          question: "Which traversal technique is used in expression evaluation?",
          options: ["Preorder", "Inorder", "Postorder", "Level order"],
          correctAnswer: 2,
          topic: "Trees"
        },
        {
          question: "What is the space complexity of a recursive algorithm with depth d?",
          options: ["O(1)", "O(d)", "O(log d)", "O(d²)"],
          correctAnswer: 1,
          topic: "Recursion"
        }
      ],
      "Computer Networks": [
        {
          question: "Which layer of OSI model handles routing?",
          options: ["Physical", "Data Link", "Network", "Transport"],
          correctAnswer: 2,
          topic: "OSI Model"
        },
        {
          question: "What is the default subnet mask for Class B network?",
          options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
          correctAnswer: 1,
          topic: "IP Addressing"
        },
        {
          question: "Which protocol is used for reliable data transfer?",
          options: ["UDP", "TCP", "IP", "ICMP"],
          correctAnswer: 1,
          topic: "Transport Layer"
        },
        {
          question: "What is the maximum transmission unit (MTU) for Ethernet?",
          options: ["512 bytes", "1024 bytes", "1500 bytes", "2048 bytes"],
          correctAnswer: 2,
          topic: "Data Link Layer"
        },
        {
          question: "Which algorithm is used in distance vector routing?",
          options: ["Dijkstra's", "Bellman-Ford", "Floyd-Warshall", "Kruskal's"],
          correctAnswer: 1,
          topic: "Routing"
        }
      ]
    },
    ECE: {
      "Signals & Systems": [
        {
          question: "What is the Fourier Transform of a unit impulse function δ(t)?",
          options: ["1", "0", "∞", "δ(ω)"],
          correctAnswer: 0,
          topic: "Fourier Analysis"
        },
        {
          question: "A system is said to be causal if:",
          options: ["Output depends on future inputs", "Output depends only on present and past inputs", "Output is independent of input", "System is linear"],
          correctAnswer: 1,
          topic: "System Properties"
        },
        {
          question: "The Z-transform of unit step function is:",
          options: ["1/(1-z⁻¹)", "z/(z-1)", "1/(z-1)", "z⁻¹/(1-z⁻¹)"],
          correctAnswer: 1,
          topic: "Z-Transform"
        },
        {
          question: "Sampling theorem states that sampling frequency should be:",
          options: ["Equal to signal frequency", "Half of signal frequency", "Twice the highest frequency", "Four times the signal frequency"],
          correctAnswer: 2,
          topic: "Sampling"
        },
        {
          question: "ROC of Z-transform for a right-sided sequence is:",
          options: ["|z| < R", "|z| > R", "R₁ < |z| < R₂", "|z| = R"],
          correctAnswer: 1,
          topic: "Z-Transform"
        }
      ],
      "Digital Electronics": [
        {
          question: "How many flip-flops are required for a MOD-16 counter?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          topic: "Counters"
        },
        {
          question: "Which gate is called a universal gate?",
          options: ["AND", "OR", "NAND", "XOR"],
          correctAnswer: 2,
          topic: "Logic Gates"
        },
        {
          question: "The Boolean expression for XOR gate is:",
          options: ["AB", "A+B", "A⊕B", "A'B'"],
          correctAnswer: 2,
          topic: "Boolean Algebra"
        },
        {
          question: "In 2's complement representation, -5 in 4-bit is:",
          options: ["1011", "1010", "1101", "1111"],
          correctAnswer: 0,
          topic: "Number Systems"
        }
      ]
    },
    ME: {
      "Thermodynamics": [
        {
          question: "Which law of thermodynamics deals with entropy?",
          options: ["Zeroth law", "First law", "Second law", "Third law"],
          correctAnswer: 2,
          topic: "Laws of Thermodynamics"
        },
        {
          question: "For an ideal gas, which process has maximum work output?",
          options: ["Isothermal", "Adiabatic", "Isobaric", "Isochoric"],
          correctAnswer: 0,
          topic: "Thermodynamic Processes"
        },
        {
          question: "Carnot cycle consists of:",
          options: ["2 isothermal + 2 adiabatic processes", "2 isobaric + 2 isochoric processes", "4 isothermal processes", "4 adiabatic processes"],
          correctAnswer: 0,
          topic: "Carnot Cycle"
        },
        {
          question: "COP of a refrigerator is always:",
          options: ["Less than 1", "Greater than 1", "Equal to 1", "Can be any value"],
          correctAnswer: 1,
          topic: "Refrigeration"
        }
      ],
      "Fluid Mechanics": [
        {
          question: "Bernoulli's equation is based on:",
          options: ["Conservation of mass", "Conservation of energy", "Conservation of momentum", "Newton's law"],
          correctAnswer: 1,
          topic: "Fluid Flow"
        },
        {
          question: "Reynolds number is the ratio of:",
          options: ["Inertial to viscous forces", "Pressure to viscous forces", "Gravitational to inertial forces", "Elastic to inertial forces"],
          correctAnswer: 0,
          topic: "Dimensional Analysis"
        },
        {
          question: "For laminar flow in pipes, friction factor depends on:",
          options: ["Reynolds number only", "Roughness only", "Both Re and roughness", "Pipe diameter only"],
          correctAnswer: 0,
          topic: "Pipe Flow"
        }
      ]
    },
    CE: {
      "Structural Engineering": [
        {
          question: "In a simply supported beam, maximum bending moment occurs at:",
          options: ["Supports", "Quarter span", "Mid span", "Three-quarter span"],
          correctAnswer: 2,
          topic: "Bending Moment"
        },
        {
          question: "Young's modulus is the ratio of:",
          options: ["Stress to strain", "Strain to stress", "Force to area", "Load to deflection"],
          correctAnswer: 0,
          topic: "Material Properties"
        },
        {
          question: "For a rectangular beam, the neutral axis passes through:",
          options: ["Top fiber", "Bottom fiber", "Centroid", "Quarter height"],
          correctAnswer: 2,
          topic: "Beam Theory"
        }
      ],
      "Concrete Technology": [
        {
          question: "Standard consistency of cement is determined by:",
          options: ["Vicat apparatus", "Le-Chatelier apparatus", "Blaine air permeability", "Autoclave"],
          correctAnswer: 0,
          topic: "Cement Testing"
        },
        {
          question: "Water-cement ratio affects:",
          options: ["Strength only", "Durability only", "Both strength and durability", "Neither strength nor durability"],
          correctAnswer: 2,
          topic: "Concrete Mix Design"
        }
      ]
    },
    EE: {
      "Power Systems": [
        {
          question: "Load factor is the ratio of:",
          options: ["Average load to maximum load", "Maximum load to average load", "Peak load to average load", "Connected load to maximum load"],
          correctAnswer: 0,
          topic: "Load Characteristics"
        },
        {
          question: "Which protection is used for transmission lines?",
          options: ["Overcurrent", "Distance", "Differential", "Earth fault"],
          correctAnswer: 1,
          topic: "Protection Systems"
        },
        {
          question: "Corona effect is observed in:",
          options: ["Low voltage lines", "Medium voltage lines", "High voltage lines", "All voltage levels"],
          correctAnswer: 2,
          topic: "Transmission Lines"
        }
      ],
      "Control Systems": [
        {
          question: "For a stable system, poles should lie in:",
          options: ["Right half of s-plane", "Left half of s-plane", "On imaginary axis", "At origin"],
          correctAnswer: 1,
          topic: "Stability"
        },
        {
          question: "Root locus technique is used for:",
          options: ["Frequency response", "Time response", "Stability analysis", "All of the above"],
          correctAnswer: 3,
          topic: "Root Locus"
        }
      ]
    }
  };

  // Calculate number of questions based on time limit and difficulty
  const getQuestionCount = (duration: number, difficulty: string) => {
    let baseQuestions = Math.floor(duration / 2); // 2 minutes per question base
    
    switch(difficulty) {
      case 'Easy': return Math.max(10, baseQuestions);
      case 'Medium': return Math.max(15, Math.floor(baseQuestions * 1.2));
      case 'Advanced': return Math.max(20, Math.floor(baseQuestions * 1.5));
      default: return 15;
    }
  };

  const questionCount = getQuestionCount(config.duration, config.difficulty);
  const branchQuestions = questionPool[config.branch as keyof typeof questionPool];
  const subjectQuestions = branchQuestions?.[config.subject] || [];
  
  // If not enough questions in selected subject, mix with other subjects from same branch
  let allQuestions = [...subjectQuestions];
  if (allQuestions.length < questionCount && branchQuestions) {
    Object.values(branchQuestions).forEach(subject => {
      if (subject !== subjectQuestions) {
        allQuestions = [...allQuestions, ...subject];
      }
    });
  }

  // Shuffle questions and take required number
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

  return selectedQuestions.map((q, index) => ({
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