import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  AIMessagePromptTemplate,
  SystemMessagePromptTemplate,
  BaseMessagePromptTemplate
} from "@langchain/core/prompts";
import {
  type ChatPromptTemplate as InternalChatPromptTemplate,
  type MessageTemplate,
  type MessageRole,
} from "@/types";
import { load } from "langchain/load"

/**
 * Maps our internal role to LangChain prompt class
 */
const roleToClass = {
  system: SystemMessagePromptTemplate,
  human: HumanMessagePromptTemplate,
  ai: AIMessagePromptTemplate,
};

/**
 * Loads a ChatPromptTemplate from a LangChain JSON object.
 */
export async function parseLangChainJSON(
  filename: string,
  text: string
): Promise<InternalChatPromptTemplate> {
  // LangChain's fromJSON might return a variety of prompt types depending on the input
  // Since we expect a ChatPromptTemplate, we'll try to load it as one.
  const langchainTemplate = await load<ChatPromptTemplate>(text);
  console.log(langchainTemplate)

  const messages: MessageTemplate[] = (langchainTemplate.promptMessages as BaseMessagePromptTemplate[]).map((m) => {
    // Determine role based on the class type or _type property
    let role: MessageRole = "human";
    if (m instanceof SystemMessagePromptTemplate) {
      role = "system";
    } else if (m instanceof AIMessagePromptTemplate) {
      role = "ai";
    } else if (m instanceof HumanMessagePromptTemplate) {
      role = "human";
    }

    return {
      id: crypto.randomUUID(),
      title: filename,
      role,
      content: m.prompt.template,
      templateFormat: m.prompt.templateFormat,
    };
  });

  const templateFormat = (langchainTemplate as ChatPromptTemplate).templateFormat || "f-string";

  return {
    title: "Imported Prompt",
    templateFormat,
    messages,
  };
}

/**
 * Exports an internal ChatPromptTemplate to a LangChain JSON object.
 */
export function exportToLangChainJSON(template: InternalChatPromptTemplate): any {
  const promptMessages = template.messages.map((m) => {
    const PromptClass = roleToClass[m.role] || HumanMessagePromptTemplate;
    return PromptClass.fromTemplate(m.content, {templateFormat: template.templateFormat});
  });

  const langchainTemplate = ChatPromptTemplate.fromMessages(promptMessages, {templateFormat: template.templateFormat});

  // Return the serializable representation
  return langchainTemplate.toJSON();
}
