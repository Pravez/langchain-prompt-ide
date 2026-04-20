import { usePromptStore } from "@/store/usePromptStore"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Plus, Trash2, FileText, Sun, Moon, FolderGit2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@/assets/app_icon.png"
import { useTheme } from "next-themes"

export function HistorySidebar() {
  const {
    savedPrompts,
    currentPromptId,
    title,
    loadPrompt,
    createNewPrompt,
    deletePrompt,
  } = usePromptStore()

  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed top-0 left-0 flex h-screen w-64 flex-col border-r bg-muted/30">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="LC Prompts IDE Logo" className="h-6 w-6" />
          <h2 className="text-lg font-semibold">LC Prompts IDE</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={createNewPrompt}
          title="New Prompt"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <h3 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Current Work
          </h3>
          <div
            className={cn(
              "group flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
            )}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span className="flex-1 truncate">{title}</span>
          </div>
        </div>

        <div className="px-3 py-4">
          <Separator className="mb-4" />
          <h3 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Previous Works
          </h3>
          <div className="space-y-1">
            {savedPrompts.length === 0 ? (
              <p className="px-2 text-sm text-muted-foreground italic">
                No saved prompts yet.
              </p>
            ) : (
              savedPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className={cn(
                    "group flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    currentPromptId === prompt.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => loadPrompt(prompt.id)}
                >
                  <FileText className="mr-2 h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{prompt.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePrompt(prompt.id)
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

      <div className="mt-auto flex items-center justify-between gap-2 border-t p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/Pravez/langchain-prompt-ide"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
          >
            <FolderGit2Icon className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
