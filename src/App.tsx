import { PromptHeader } from "./components/PromptHeader"
import { MessageList } from "./components/MessageList"
import { HistorySidebar } from "./components/HistorySidebar"
import { Toaster } from "./components/ui/sonner"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        <HistorySidebar />
        <div className="ml-64 flex-1 p-8">
          <PromptHeader />
          <main>
            <MessageList />
          </main>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App
