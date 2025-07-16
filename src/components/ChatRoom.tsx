import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService } from '@/services/chatService';
import { authService } from '@/services/authService';
import { ChatMessage } from '@/types/user';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  Crown, 
  User,
  Clock
} from 'lucide-react';

interface ChatRoomProps {
  onBack: () => void;
}

export default function ChatRoom({ onBack }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      loadMessages();
    }
  }, [currentUser]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = () => {
    if (currentUser) {
      const branchMessages = chatService.getMessagesByBranch(currentUser.branch);
      setMessages(branchMessages);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    const success = chatService.sendMessage(newMessage);
    
    if (success) {
      setNewMessage('');
      loadMessages(); // Refresh messages
    }
    
    setIsLoading(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const canAccessChat = chatService.canAccessChat();

  if (!canAccessChat) {
    return (
      <div className="min-h-screen bg-gradient-background bg-cyber-grid">
        <header className="border-b border-border/20 bg-card/50 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack} className="border-border/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Chat Room</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Complete a Quiz First</h3>
                <p className="text-muted-foreground">
                  You need to complete at least one quiz to access the chat room.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background bg-cyber-grid flex flex-col">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="border-border/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Chat Room</h1>
              <p className="text-sm text-muted-foreground">
                {currentUser?.branch} Branch Discussion
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-4xl">
        <Card className="flex-1 bg-card/80 backdrop-blur-sm border-border/50 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Discussion Forum
            </CardTitle>
            <CardDescription>
              Ask questions and get help from top scorers in your branch
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages Area */}
            <ScrollArea 
              ref={scrollAreaRef}
              className="flex-1 h-96 border border-border/50 rounded-lg p-4 bg-background/50"
            >
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="h-12 w-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                      <MessageCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">No messages yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Be the first to start a discussion!
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex gap-3 group">
                      <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                        {message.userName.charAt(0)}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {message.userName}
                          </span>
                          
                          {message.isTopScorer && (
                            <Badge className="bg-warning/20 text-warning border-warning/30">
                              <Crown className="h-3 w-3 mr-1" />
                              Top Scorer
                            </Badge>
                          )}
                          
                          {message.userId === currentUser?.id && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              You
                            </Badge>
                          )}
                          
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-3 text-sm text-foreground">
                          {message.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a question or share your thoughts..."
                className="flex-1 bg-input/50 border-border/50 focus:border-primary"
                disabled={isLoading}
                maxLength={500}
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim() || isLoading}
                className="bg-gradient-primary hover:scale-105 transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="text-xs text-muted-foreground text-center">
              💡 Tip: Top scorers are marked with a crown. Ask them for study tips!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}