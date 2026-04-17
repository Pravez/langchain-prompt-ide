import { type MessageTemplate, type MessageRole } from "@/types";
import { usePromptStore } from '@/store/usePromptStore';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { RichTextarea } from './RichTextarea';

interface MessageItemProps {
  message: MessageTemplate;
}

export function MessageItem({ message }: MessageItemProps) {
  const { updateMessage, removeMessage } = usePromptStore();

  return (
    <Card className="mb-4 relative">
      <CardContent className="pt-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => removeMessage(message.id)}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-32">
              <Select
                value={message.role}
                onValueChange={(value: MessageRole) =>
                  updateMessage(message.id, { role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="ai">Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <RichTextarea
            value={message.content}
            onChange={(val) => updateMessage(message.id, { content: val })}
            placeholder="Enter message content..."
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
