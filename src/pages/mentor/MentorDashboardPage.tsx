import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mentors, webinars, jobs } from "@/data/mock-data";
import { Users, Briefcase, Video, CalendarCheck, ArrowRight, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const statCards = [
  { label: "Mentees", value: "48", icon: Users, color: "text-primary" },
  { label: "Sessions Completed", value: "156", icon: CalendarCheck, color: "text-success" },
  { label: "Jobs Posted", value: "5", icon: Briefcase, color: "text-warning" },
  { label: "Webinars Hosted", value: "3", icon: Video, color: "text-info" },
];

const upcomingSessions = [
  { id: "1", mentee: "Alex Johnson", avatar: "AJ", topic: "Career Guidance in Tech", date: "2026-04-21", time: "10:00 AM" },
  { id: "2", mentee: "Priya Sharma", avatar: "PS", topic: "Resume Review", date: "2026-04-22", time: "2:00 PM" },
  { id: "3", mentee: "Lisa Wang", avatar: "LW", topic: "Interview Preparation", date: "2026-04-23", time: "11:00 AM" },
];

const MentorDashboardPage = () => {
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
            Welcome back, Sarah! 👋
          </h2>
          <p className="text-primary-foreground/80 max-w-xl">
            You have 3 upcoming mentoring sessions this week. Keep inspiring the next generation!
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              {upcomingSessions.map((s) => (
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
                      <Calendar className="h-3 w-3" /> {s.date}
                    </p>
                    <p className="text-xs text-primary font-medium">{s.time}</p>
                  </div>
                </div>
              ))}
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
              {webinars.slice(0, 3).map((w) => (
                <div key={w.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-semibold text-foreground">{w.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {w.date}
                    </span>
                    <span className="text-xs text-muted-foreground">{w.attendees}/{w.maxAttendees} attendees</span>
                  </div>
                </div>
              ))}
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
              {jobs.slice(0, 3).map((j) => (
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
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorDashboardPage;
