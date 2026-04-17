import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  type ChatPromptTemplate,
  type ChatPromptTemplateContent,
  type MessageTemplate,
  type TemplateFormat,
} from "@/types"

interface PromptStore {
  title: string
  templateFormat: TemplateFormat
  messages: MessageTemplate[]
  savedPrompts: ChatPromptTemplate[]
  currentPromptId: string | null
  setTitle: (title: string) => void
  setTemplateFormat: (format: TemplateFormat) => void
  addMessage: (index?: number) => void
  removeMessage: (id: string) => void
  updateMessage: (id: string, updates: Partial<MessageTemplate>) => void
  reorderMessages: (startIndex: number, endIndex: number) => void
  importTemplate: (template: ChatPromptTemplateContent) => void
  saveCurrentPrompt: () => void
  loadPrompt: (id: string) => void
  createNewPrompt: () => void
  deletePrompt: (id: string) => void
  autoSave: () => void
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => {
      const autoSave = () => {
        const state = get()
        if (!state.currentPromptId) return

        const currentPrompt: ChatPromptTemplate = {
          id: state.currentPromptId,
          title: state.title,
          templateFormat: state.templateFormat,
          messages: state.messages,
        }

        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === currentPrompt.id ? currentPrompt : p
          ),
        }))
      }

      return {
        title: "Untitled Prompt",
        templateFormat: "f-string",
        messages: [
          {
            id: crypto.randomUUID(),
            role: "system",
            content: "",
            templateFormat: "f-string",
          },
        ],
        savedPrompts: [],
        currentPromptId: null,
        setTitle: (title) => {
          set({ title })
          autoSave()
        },
        setTemplateFormat: (templateFormat) => {
          set({ templateFormat })
          autoSave()
        },
        addMessage: (index) => {
          set((state) => {
            const newMessage: MessageTemplate = {
              id: crypto.randomUUID(),
              role: "human",
              content: "",
              templateFormat: "f-string",
            }
            const newMessages = [...state.messages]
            if (typeof index === "number") {
              newMessages.splice(index, 0, newMessage)
            } else {
              newMessages.push(newMessage)
            }
            return { messages: newMessages }
          })
          autoSave()
        },
        removeMessage: (id) => {
          set((state) => ({
            messages: state.messages.filter((m) => m.id !== id),
          }))
          autoSave()
        },
        updateMessage: (id, updates) => {
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          }))
          autoSave()
        },
        reorderMessages: (startIndex, endIndex) => {
          set((state) => {
            const newMessages = [...state.messages]
            const [removed] = newMessages.splice(startIndex, 1)
            newMessages.splice(endIndex, 0, removed)
            return { messages: newMessages }
          })
          autoSave()
        },
        importTemplate: (template) =>
          set({
            title: template.title,
            templateFormat: template.templateFormat,
            messages: template.messages.map((m) => ({
              ...m,
              id: m.id || crypto.randomUUID(),
            })),
            currentPromptId: crypto.randomUUID(),
          }),
        saveCurrentPrompt: () =>
          set((state) => {
            const currentPrompt: ChatPromptTemplate = {
              id: state.currentPromptId || crypto.randomUUID(),
              title: state.title,
              templateFormat: state.templateFormat,
              messages: state.messages,
            }

            const existingIndex = state.savedPrompts.findIndex(
              (p) => p.id === currentPrompt.id
            )

            const newSavedPrompts = [...state.savedPrompts]
            if (existingIndex >= 0) {
              newSavedPrompts[existingIndex] = currentPrompt
            } else {
              newSavedPrompts.unshift(currentPrompt)
            }

            return {
              savedPrompts: newSavedPrompts,
              currentPromptId: currentPrompt.id,
            }
          }),
        loadPrompt: (id) =>
          set((state) => {
            const prompt = state.savedPrompts.find((p) => p.id === id)
            if (!prompt) return state
            return {
              title: prompt.title,
              templateFormat: prompt.templateFormat,
              messages: prompt.messages,
              currentPromptId: prompt.id,
            }
          }),
        createNewPrompt: () => {
          set({
            title: "Untitled Prompt",
            templateFormat: "f-string",
            messages: [
              {
                id: crypto.randomUUID(),
                role: "system",
                content: "",
                templateFormat: "f-string",
              },
            ],
            currentPromptId: null,
          })
        },
        deletePrompt: (id) =>
          set((state) => ({
            savedPrompts: state.savedPrompts.filter((p) => p.id !== id),
            currentPromptId:
              state.currentPromptId === id ? null : state.currentPromptId,
          })),
        autoSave,
      }
    },
    {
      name: "langchain-prompt-store",
    }
  )
)
