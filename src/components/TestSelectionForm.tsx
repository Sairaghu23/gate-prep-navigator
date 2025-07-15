import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, BookOpen, Target } from "lucide-react";

interface TestSelectionFormProps {
  onStartTest: (config: TestConfig) => void;
}

export interface TestConfig {
  branch: string;
  subject: string;
  difficulty: string;
  duration: number;
}

const branches = [
  { value: "CSE", label: "Computer Science Engineering" },
  { value: "ECE", label: "Electronics & Communication Engineering" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "CE", label: "Civil Engineering" },
  { value: "EE", label: "Electrical Engineering" },
  { value: "CH", label: "Chemical Engineering" },
];

const subjects = {
  CSE: ["Algorithms", "Data Structures", "Computer Networks", "Operating Systems", "Database Management", "Software Engineering"],
  ECE: ["Signals & Systems", "Digital Electronics", "Communication Systems", "Control Systems", "Electromagnetic Theory"],
  ME: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer", "Machine Design", "Manufacturing Processes"],
  CE: ["Structural Analysis", "Concrete Technology", "Geotechnical Engineering", "Transportation Engineering"],
  EE: ["Power Systems", "Control Systems", "Electrical Machines", "Power Electronics", "Circuit Theory"],
  CH: ["Chemical Reaction Engineering", "Heat Transfer", "Mass Transfer", "Process Control", "Thermodynamics"],
};

export default function TestSelectionForm({ onStartTest }: TestSelectionFormProps) {
  const [branch, setBranch] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [duration, setDuration] = useState<number>(30);

  const handleStartTest = () => {
    if (branch && subject) {
      onStartTest({ branch, subject, difficulty, duration });
    }
  };

  const isFormValid = branch && subject;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">
            Configure Your GATE Mock Test
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Select your branch, subject, and test preferences to begin
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Branch Selection */}
          <div className="space-y-2">
            <Label htmlFor="branch" className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              GATE Branch
            </Label>
            <Select value={branch} onValueChange={(value) => {
              setBranch(value);
              setSubject(""); // Reset subject when branch changes
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your GATE branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Subject
            </Label>
            <Select 
              value={subject} 
              onValueChange={setSubject}
              disabled={!branch}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={branch ? "Select subject" : "Select branch first"} />
              </SelectTrigger>
              <SelectContent>
                {branch && subjects[branch as keyof typeof subjects]?.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Difficulty Level</Label>
            <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Easy" id="easy" />
                <Label htmlFor="easy" className="text-sm text-success font-medium">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Medium" id="medium" />
                <Label htmlFor="medium" className="text-sm text-warning font-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Advanced" id="advanced" />
                <Label htmlFor="advanced" className="text-sm text-destructive font-medium">Advanced</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Test Duration
            </Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Test Button */}
          <Button 
            onClick={handleStartTest}
            disabled={!isFormValid}
            variant="hero"
            size="lg"
            className="w-full mt-8"
          >
            Start Mock Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}