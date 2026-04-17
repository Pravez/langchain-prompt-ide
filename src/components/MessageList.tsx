import { usePromptStore } from "@/store/usePromptStore"
import { MessageItem } from "./MessageItem"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AddButtonProps {
  index: number
  label: string
  onAdd: (index: number) => void
}

const AddButton = ({ index, label, onAdd }: AddButtonProps) => (
  <div className="group relative flex h-0 items-center justify-center mb-4">
    <div className="absolute left-0 h-px w-full bg-border opacity-0 transition-opacity group-hover:opacity-100" />
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="z-10 h-6 w-6 rounded-full bg-background border shadow-sm transition-all hover:scale-110 active:scale-95"
          onClick={() => onAdd(index)}
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </div>
)

export function MessageList() {
  const { messages, addMessage, removeMessage } = usePromptStore()
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  const handleRemove = (id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      removeMessage(id)
      setRemovingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }, 250)
  }

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex flex-col gap-4">
        <div className="relative flex flex-col pl-2">
          <AddButton index={0} label="Add message at the beginning" onAdd={addMessage} />
          
          <div className="flex flex-col gap-2 py-2">
            {messages.map((message, index) => {
              const isRemoving = removingIds.has(message.id)
              return (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex flex-col gap-2",
                    isRemoving 
                      ? "animate-out fade-out slide-out-to-top-2 duration-250 ease-in fill-mode-forwards"
                      : "animate-in fade-in slide-in-from-top-2 duration-250 ease-out"
                  )}
                >
                  <MessageItem message={message} onRemove={() => handleRemove(message.id)} />
                  <AddButton 
                    index={index + 1} 
                    label={index === messages.length - 1 ? "Add message at the end" : "Add message here"} 
                    onAdd={addMessage}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
