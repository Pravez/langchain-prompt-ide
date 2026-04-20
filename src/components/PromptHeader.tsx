import { useState, useRef } from "react"
import { usePromptStore } from "@/store/usePromptStore"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  parseLangChainJSON,
  exportToLangChainJSON,
} from "@/lib/langchain/serialization"
import { toast } from "sonner"
import { Settings, ChevronDown, FileJson, Clipboard } from "lucide-react"
import { ConfigSidebar } from "./ConfigSidebar"

export function PromptHeader() {
  const {
    title,
    setTitle,
    importTemplate,
    messages,
    templateFormat,
    saveCurrentPrompt,
  } = usePromptStore()
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    saveCurrentPrompt()
    toast.success("Prompt saved to history")
  }

  const handleExport = () => {
    try {
      const json = exportToLangChainJSON({ title, messages, templateFormat })
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Prompt exported successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to export prompt template")
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const template = await parseLangChainJSON(file.name, text)
      importTemplate(template)
      toast.success("Prompt imported successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to import prompt template")
    } finally {
      // Reset input so the same file can be selected again
      if (e.target) e.target.value = ""
    }
  }

  const handleClipboardImport = async () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard API not supported in this browser or context.")
      return
    }

    try {
      const text = await navigator.clipboard.readText()
      if (!text || text.trim() === "") {
        toast.error("Clipboard is empty")
        return
      }
      const template = await parseLangChainJSON("clipboard.json", text)
      importTemplate(template)
      toast.success("Prompt imported from clipboard")
    } catch (error) {
      console.error(error)
      if (error instanceof Error && error.name === "NotAllowedError") {
        // If access was denied, we can optionally check the permission status to give better feedback
        let message =
          "Clipboard access denied or dismissed. Please allow access when prompted."

        if (navigator.permissions && navigator.permissions.query) {
          try {
            // @ts-expect-error: 'clipboard-read' is not yet in the standard PermissionName enum in all environments
            const permissionStatus = await navigator.permissions.query({
              name: "clipboard-read",
            })
            if (permissionStatus.state === "denied") {
              message =
                "Clipboard access denied. Please enable it in your browser settings."
            }
          } catch (e) {
            // Some browsers (like Firefox) throw a TypeError if 'clipboard-read' is not supported
            console.debug("Permissions API query for clipboard-read failed:", e)
          }
        }
        toast.error(message)
      } else {
        toast.error(
          "Failed to import from clipboard. Ensure it's valid JSON data.",
        )
      }
    }
  }

  return (
    <div className="mb-8 flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
      <div className="mr-4 flex-1">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Prompt Title"
          className="h-auto border-none p-0 text-2xl font-bold shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="default" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={handleExport}>
          Export
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Import <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
              <FileJson className="mr-2 h-4 w-4" />
              <span>From File</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleClipboardImport}
            >
              <Clipboard className="mr-2 h-4 w-4" />
              <span>From Clipboard</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsConfigOpen(true)}
          title="Template Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      <ConfigSidebar open={isConfigOpen} onOpenChange={setIsConfigOpen} />
    </div>
  )
}
