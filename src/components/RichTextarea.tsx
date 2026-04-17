import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { cn } from "@/lib/utils";
import { VariableHighlight } from '@/lib/tiptap-variable-extension';
import { useEffect } from 'react';

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextarea({ value, onChange, placeholder, className }: RichTextareaProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      VariableHighlight,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      if (markdown !== value) {
        onChange(markdown);
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:outline-none",
          className
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div className="w-full relative">
      <EditorContent editor={editor} />
      {editor && placeholder && editor.isEmpty && (
        <div className="absolute top-2.5 left-3.5 pointer-events-none text-muted-foreground text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
}
