import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Video, ArrowRight, Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [mentorsList, setMentorsList] = useState<any[]>([]);
  const [webinarsList, setWebinarsList] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = api.getAuthUser();
    setCurrentUser(user);

    const fetchData = async () => {
      try {
        setLoading(true);
        const m = await api.getMentors();
        const w = await api.getWebinars();
        const j = await api.getJobs();
        const s = await api.getMentorshipSessions();
        setMentorsList(m);
        setWebinarsList(w);
        setJobsList(j);
        setSessionsList(s);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const studentName = currentUser?.student_profile?.full_name || currentUser?.mentor_profile?.full_name || "";

  const statCards = [
    { label: "Available Mentors", value: loading ? "..." : mentorsList.length.toString(), icon: Users, color: "text-primary" },
    { label: "Job Referrals", value: loading ? "..." : jobsList.length.toString(), icon: Briefcase, color: "text-success" },
    { label: "Upcoming Webinars", value: loading ? "..." : webinarsList.length.toString(), icon: Video, color: "text-warning" },
  ];

  const upcomingSessionsCount = sessionsList.filter((s) => s.status === "upcoming" || s.status === "pending").length;
  const welcomeMessage = upcomingSessionsCount > 0
    ? `You have ${upcomingSessionsCount} pending or upcoming mentoring session${upcomingSessionsCount > 1 ? "s" : ""} scheduled. Connect and learn from alumni.`
    : "Explore new opportunities and book mentorship sessions to learn from industry experts.";

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 max-w-7xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero rounded-xl p-6 lg:p-8"
        >
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground mb-2">
            Welcome back, {studentName}!
          </h2>
          <p className="text-primary-foreground/80 max-w-xl">
            {welcomeMessage}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Booked Mentorship Sessions */}
        <Card className="card-elevated">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-display font-semibold">My Booked Mentoring Sessions</CardTitle>
            <Link to="/mentors" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
              Book a Mentor <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-center py-6 text-muted-foreground animate-pulse">Loading sessions...</div>
            ) : sessionsList.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-card/50 text-sm">
                You have no booked mentoring sessions yet. Click "Book a Mentor" to connect with a mentor.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {sessionsList.map((session) => {
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                    upcoming: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                    completed: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                    declined: "bg-destructive/10 text-destructive border border-destructive/20",
                  };

                  const mentorName = session.mentor?.full_name || "Alumni Mentor";
                  const mentorTitle = session.mentor?.title || "Mentor";
                  const mentorCompany = session.mentor?.company || "AlumniHub";
                  const mentorAvatar = session.mentor?.avatar || mentorName.substring(0, 2).toUpperCase();

                  return (
                    <div key={session.id} className="flex items-center justify-between gap-3 p-3.5 rounded-lg border border-border bg-secondary/15 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{mentorAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{mentorName}</p>
                          <p className="text-xs text-muted-foreground truncate">{mentorTitle} at {mentorCompany}</p>
                          <p className="text-xs text-primary/95 font-medium mt-1 truncate">Topic: {session.topic}</p>
                          {session.status === "upcoming" && session.meet_link && (
                            <a
                              href={session.meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold mt-1.5 transition-colors"
                            >
                              <Video className="h-3 w-3" /> Join Meeting
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 text-right flex-shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${statusColors[session.status] || "bg-secondary text-secondary-foreground"}`}>
                          {session.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" /> {session.date ? session.date.split("T")[0] : ""}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" /> {session.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recommended Mentors */}
          <Card className="card-elevated">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-display font-semibold">Recommended Mentors</CardTitle>
              <Link to="/mentors" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground animate-pulse">Loading mentors...</div>
              ) : (
                mentorsList.slice(0, 3).map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{m.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.title} at {m.company}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Webinars */}
          <Card className="card-elevated">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-display font-semibold">Upcoming Webinars</CardTitle>
              <Link to="/webinars" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground animate-pulse">Loading webinars...</div>
              ) : (
                webinarsList.slice(0, 3).map((w) => (
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

          {/* Recent Job Referrals */}
          <Card className="card-elevated lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-display font-semibold">Recent Job Referrals</CardTitle>
              <Link to="/jobs" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground animate-pulse">Loading job referrals...</div>
              ) : (
                jobsList.slice(0, 3).map((j) => (
                  <div key={j.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{j.title}</p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        {j.company} · <MapPin className="h-3 w-3" /> {j.location}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{j.type}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
