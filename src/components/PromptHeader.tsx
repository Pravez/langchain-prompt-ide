import { useState } from 'react';
import { usePromptStore } from '@/store/usePromptStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { parseLangChainJSON, exportToLangChainJSON } from '@/lib/langchain/serialization';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';
import { ConfigSidebar } from './ConfigSidebar';

export function PromptHeader() {
  const { title, setTitle, importTemplate, messages, templateFormat, saveCurrentPrompt } = usePromptStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleSave = () => {
    saveCurrentPrompt();
    toast.success('Prompt saved to history');
  };

  const handleExport = () => {
    try {
      const json = exportToLangChainJSON({ title, messages, templateFormat });
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Prompt exported successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export prompt template');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const template = await parseLangChainJSON(file.name, text);
      importTemplate(template);
      toast.success('Prompt imported successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to import prompt template');
    }
  };

  return (
    <div className="flex items-center justify-between mb-8 p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex-1 mr-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Prompt Title"
          className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="default" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={handleExport}>
          Export
        </Button>
        <label htmlFor="import-prompt">
          <Button variant="outline" asChild>
            <span>Import</span>
          </Button>
          <input
            id="import-prompt"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </label>
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
  );
}
