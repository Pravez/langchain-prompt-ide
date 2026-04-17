import { usePromptStore } from '@/store/usePromptStore';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Plus, Trash2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HistorySidebar() {
  const {
    savedPrompts,
    currentPromptId,
    title,
    loadPrompt,
    createNewPrompt,
    deletePrompt,
  } = usePromptStore();

  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Prompts</h2>
        <Button variant="ghost" size="icon" onClick={createNewPrompt} title="New Prompt">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Work
          </h3>
          <div
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium bg-secondary text-secondary-foreground"
            )}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span className="truncate flex-1">{title}</span>
          </div>
        </div>

        <div className="px-3 py-4">
          <Separator className="mb-4" />
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Previous Works
          </h3>
          <div className="space-y-1">
            {savedPrompts.length === 0 ? (
              <p className="px-2 text-sm text-muted-foreground italic">No saved prompts yet.</p>
            ) : (
              savedPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    currentPromptId === prompt.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => loadPrompt(prompt.id)}
                >
                  <FileText className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate flex-1">{prompt.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePrompt(prompt.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
