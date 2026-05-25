import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MentorSidebar } from "@/components/MentorSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface MentorLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function MentorLayout({ children, title }: MentorLayoutProps) {
  const [userInitials, setUserInitials] = useState("SC");

  useEffect(() => {
    const authUser = api.getAuthUser();
    if (authUser) {
      const profile = authUser.mentor_profile || authUser.student_profile;
      const fullName: string = profile?.full_name || authUser.email || "";
      if (fullName) {
        const parts = fullName.trim().split(" ");
        const initials = parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : fullName.substring(0, 2).toUpperCase();
        setUserInitials(initials);
      }
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MentorSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border bg-card px-4 lg:px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              {title && (
                <h1 className="text-lg font-display font-semibold text-foreground">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/mentor/profile">
                <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Link>
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
