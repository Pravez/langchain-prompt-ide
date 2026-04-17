import { usePromptStore } from '@/store/usePromptStore';
import { MessageItem } from './MessageItem';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

export function MessageList() {
  const { messages, addMessage } = usePromptStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Button variant="outline" size="sm" onClick={addMessage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Message
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
