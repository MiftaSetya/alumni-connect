import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Swal } from "@/lib/alert";


interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  showProfile?: boolean;
}

export function DashboardLayout({ children, title, showSidebar = true, showProfile = true }: DashboardLayoutProps) {
  const [userInitials, setUserInitials] = useState("AJ");

  useEffect(() => {
    const authUser = api.getAuthUser();
    if (authUser) {
      const profile = authUser.student_profile || authUser.mentor_profile;
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
              {showProfile ? (
                <>
                  <Link to="/profile">
                    <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity cursor-pointer">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground font-medium text-xs hover:bg-muted"
                  onClick={async () => {
                    const confirmed = await Swal.confirm(
                      "Konfirmasi Logout",
                      "Apakah Anda yakin ingin keluar dari AlumniHub?",
                      "warning"
                    );
                    if (confirmed) {
                      localStorage.removeItem("alumni_connect_token");
                      localStorage.removeItem("alumni_connect_user");
                      window.location.href = "/login";
                    }
                  }}
                >
                  Logout
                </Button>
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
