import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col bg-background overflow-x-hidden">
      <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
      
      <div className="flex flex-1 w-full max-w-full overflow-x-hidden">
        {/* Desktop Sidebar */}
        {showSidebar && (
          <aside className="hidden xl:block w-64 shrink-0 border-r border-border bg-card">
            <Sidebar />
          </aside>
        )}

        {/* Mobile Sidebar */}
        {showSidebar && (
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar onFilterChange={() => setIsMobileSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
