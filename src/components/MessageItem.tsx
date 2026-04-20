import { type MessageTemplate, type MessageRole } from "@/types"
import { usePromptStore } from "@/store/usePromptStore"
import { Card, CardContent } from "./ui/card"
import { NativeSelect, NativeSelectOption } from "./ui/native-select"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { RichTextarea } from "./RichTextarea"

interface MessageItemProps {
  message: MessageTemplate
  onRemove?: () => void
}

export function MessageItem({ message, onRemove }: MessageItemProps) {
  const { updateMessage, removeMessage } = usePromptStore()

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    } else {
      removeMessage(message.id)
    }
  }

  return (
    <Card className="relative mb-4">
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="w-32">
              <NativeSelect
                value={message.role}
                onChange={(e) =>
                  updateMessage(message.id, {
                    role: e.target.value as MessageRole,
                  })
                }
              >
                <NativeSelectOption value="system">System</NativeSelectOption>
                <NativeSelectOption value="human">Human</NativeSelectOption>
                <NativeSelectOption value="ai">Assistant</NativeSelectOption>
              </NativeSelect>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <RichTextarea
            value={message.content}
            onChange={(val) => updateMessage(message.id, { content: val })}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  )
}
