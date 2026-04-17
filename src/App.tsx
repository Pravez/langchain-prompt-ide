import { PromptHeader } from './components/PromptHeader';
import { MessageList } from './components/MessageList';
import { HistorySidebar } from './components/HistorySidebar';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <HistorySidebar />
      <div className="flex-1 ml-64 p-8">
        <PromptHeader />
        <main>
          <MessageList />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
