export type MessageRole = 'human' | 'system' | 'ai';

export type TemplateFormat = 'f-string' | 'mustache';

export interface MessageTemplate {
  id: string;
  role: MessageRole;
  content: string;
  templateFormat: TemplateFormat;
}

export interface ChatPromptTemplate {
  id: string;
  title: string;
  templateFormat: TemplateFormat;
  messages: MessageTemplate[];
}
