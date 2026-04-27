import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  showProfile?: boolean;
}

export function DashboardLayout({ children, title, showSidebar = true, showProfile = true }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {showSidebar && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border bg-card px-4 lg:px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {showSidebar && <SidebarTrigger className="text-muted-foreground hover:text-foreground" />}
              {title && (
                <h1 className="text-lg font-display font-semibold text-foreground">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-3">
              {showProfile && (
                <>
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
                  </Button>
                  <Link to="/profile">
                    <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity cursor-pointer">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        AJ
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
