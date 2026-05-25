import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Video, CalendarCheck, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";

const MentorDashboardPage = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [myWebinars, setMyWebinars] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const authUser = api.getAuthUser();
    setCurrentUser(authUser);

    const fetchData = async () => {
      try {
        setLoading(true);
        const name = authUser?.mentor_profile?.full_name || authUser?.student_profile?.full_name || "";
        
        const allJobs = await api.getJobs();
        const allWebinars = await api.getWebinars();
        const allSessions = await api.getMentorshipSessions();

        // Filter to only show items posted/hosted by this mentor
        const filteredJobs = allJobs.filter((j: any) => j.postedBy === name);
        const filteredWebinars = allWebinars.filter((w: any) => w.host === name);

        setMyJobs(filteredJobs);
        setMyWebinars(filteredWebinars);
        setSessions(allSessions);
      } catch (error) {
        console.error("Error fetching mentor dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mentorName = currentUser?.mentor_profile?.full_name || currentUser?.student_profile?.full_name || "";

  const completedSessions = Array.isArray(sessions)
    ? sessions.filter((s: any) => s.status === "completed").length
    : 0;

  const upcomingSessions = Array.isArray(sessions)
    ? sessions
        .filter((s: any) => s.status === "pending" || s.status === "upcoming")
        .slice(0, 3)
        .map((s: any) => ({
          id: s.id,
          mentee: s.student?.full_name || s.student_name || "Student",
          avatar: (s.student?.full_name || s.student_name || "S").substring(0, 2).toUpperCase(),
          topic: s.topic || s.notes || "Mentoring Session",
          date: s.date ? s.date.split("T")[0] : "",
          time: s.time || "",
        }))
    : [];

  const statCards = [
    { label: "Sessions Completed", value: loading ? "..." : completedSessions.toString(), icon: CalendarCheck, color: "text-success" },
    { label: "Jobs Posted", value: loading ? "..." : myJobs.length.toString(), icon: Briefcase, color: "text-warning" },
    { label: "Webinars Hosted", value: loading ? "..." : myWebinars.length.toString(), icon: Video, color: "text-info" },
  ];

  return (
    <MentorLayout title="Dashboard">
      <div className="space-y-6 w-full">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero rounded-xl p-6 lg:p-8"
        >
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground mb-2">
            Welcome back, {mentorName}!
          </h2>
          <p className="text-primary-foreground/80 max-w-xl">
            {upcomingSessions.length > 0
              ? `You have ${upcomingSessions.length} pending or upcoming mentoring session${upcomingSessions.length > 1 ? "s" : ""}. Keep inspiring the next generation!`
              : "You have no upcoming sessions. Share your expertise by creating webinars or posting job referrals!"}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-elevated">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <Card className="card-elevated">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-display font-semibold">Upcoming Sessions</CardTitle>
              <Link to="/mentor/sessions" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground animate-pulse">Loading sessions...</div>
              ) : upcomingSessions.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">No upcoming or pending sessions.</div>
              ) : (
                upcomingSessions.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{s.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{s.mentee}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.topic}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatDate(s.date)}
                      </p>
                      <p className="text-xs text-primary font-medium">{formatTime(s.time)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Webinars */}
          <Card className="card-elevated">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-display font-semibold">Your Webinars</CardTitle>
              <Link to="/mentor/webinars" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground animate-pulse">Loading webinars...</div>
              ) : myWebinars.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">You haven't hosted any webinars yet.</div>
              ) : (
                myWebinars.slice(0, 3).map((w) => (
                  <div key={w.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-semibold text-foreground">{w.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {w.date}
                      </span>
                      <span className="text-xs text-muted-foreground">{w.attendees}/{w.maxAttendees} attendees</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Job Posts */}
          <Card className="card-elevated lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-display font-semibold">Your Job Posts</CardTitle>
              <Link to="/mentor/post-job" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                Post new <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground animate-pulse">Loading job posts...</div>
              ) : myJobs.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">You haven't posted any jobs yet.</div>
              ) : (
                myJobs.slice(0, 3).map((j) => (
                  <div key={j.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{j.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{j.company} · {j.location}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{j.type}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorDashboardPage;
