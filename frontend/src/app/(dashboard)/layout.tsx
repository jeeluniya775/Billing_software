import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ModuleNav } from '@/components/layout/ModuleNav';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto w-full">
              {/* Top Greeting area will be in individual pages, but ModuleNav is global for authenticated routes */}
              <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 sticky top-0 z-20 shadow-sm">
                <ModuleNav />
              </div>

              <div className="p-6 md:p-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
