export type MessageRole = "human" | "system" | "ai"

export type TemplateFormat = "f-string" | "mustache"

export interface MessageTemplate {
  id: string
  role: MessageRole
  content: string
  templateFormat: TemplateFormat
}

export type ChatPromptTemplateContent = {
  title: string
  templateFormat: TemplateFormat
  messages: MessageTemplate[]
}

export type ChatPromptTemplate = {
  id: string
} & ChatPromptTemplateContent
