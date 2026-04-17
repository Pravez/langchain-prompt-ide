import { usePromptStore } from "@/store/usePromptStore"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { type TemplateFormat } from "@/types"

interface ConfigSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfigSidebar({ open, onOpenChange }: ConfigSidebarProps) {
  const { templateFormat, setTemplateFormat } = usePromptStore()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Template Configuration</SheetTitle>
          <SheetDescription>
            Configure global settings for this prompt template.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="template-format">Template Engine</Label>
            <Select
              value={templateFormat}
              onValueChange={(value: TemplateFormat) =>
                setTemplateFormat(value)
              }
            >
              <SelectTrigger id="template-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="f-string">f-string</SelectItem>
                <SelectItem value="mustache">mustache</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Controls the templating engine used for variables.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
