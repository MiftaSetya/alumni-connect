import {
  LayoutDashboard,
  Users,
  Route,
  Briefcase,
  Video,
  User,
  Shield,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Swal } from "@/lib/alert";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Mentors", url: "/mentors", icon: Users },
  { title: "Job Referrals", url: "/jobs", icon: Briefcase },
  { title: "Webinars", url: "/webinars", icon: Video },
];



export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className={`py-5 flex items-center ${collapsed ? "justify-center" : "px-4 gap-3"}`}>
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              AlumniHub
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>

      <SidebarFooter className={collapsed ? "p-2" : "p-4"}>
        <button
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
          className={`w-full flex items-center rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${
            collapsed ? "justify-center p-2.5" : "gap-3 px-4 py-2.5"
          }`}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
