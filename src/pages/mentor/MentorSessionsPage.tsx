import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const sessions = [
  {
    id: "1",
    mentee: "Alex Johnson",
    avatar: "AJ",
    topic: "Career Guidance in Tech",
    date: "2026-04-21",
    time: "10:00 AM",
    duration: "45 min",
    status: "upcoming" as const,
    message: "I'd love to discuss career paths in software engineering and get your advice on transitioning to a senior role.",
  },
  {
    id: "2",
    mentee: "Priya Sharma",
    avatar: "PS",
    topic: "Resume Review",
    date: "2026-04-22",
    time: "2:00 PM",
    duration: "30 min",
    status: "upcoming" as const,
    message: "Could you review my resume for product management roles? I've recently updated it.",
  },
  {
    id: "3",
    mentee: "Lisa Wang",
    avatar: "LW",
    topic: "Interview Preparation",
    date: "2026-04-23",
    time: "11:00 AM",
    duration: "60 min",
    status: "upcoming" as const,
    message: "I have an upcoming interview at Meta and would love to do a mock interview session.",
  },
  {
    id: "4",
    mentee: "James Lee",
    avatar: "JL",
    topic: "System Design Discussion",
    date: "2026-04-15",
    time: "3:00 PM",
    duration: "45 min",
    status: "completed" as const,
    message: "Thanks for the great session on system design!",
  },
  {
    id: "5",
    mentee: "Maria Garcia",
    avatar: "MG",
    topic: "Career Switch to Data Science",
    date: "2026-04-12",
    time: "1:00 PM",
    duration: "30 min",
    status: "completed" as const,
    message: "Discussed roadmap for transitioning from backend engineering to data science.",
  },
];

const MentorSessionsPage = () => {
  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const completed = sessions.filter((s) => s.status === "completed");

  return (
    <MentorLayout title="Mentoring Sessions">
      <div className="space-y-8 w-full">
        {/* Upcoming Sessions */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Upcoming Sessions
            <Badge variant="secondary" className="ml-2 text-xs">{upcoming.length}</Badge>
          </h2>
          <div className="space-y-4">
            {upcoming.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="card-elevated">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{s.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-display font-semibold text-foreground">{s.topic}</h3>
                          <p className="text-sm text-primary font-medium">{s.mentee}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {s.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.time}</span>
                            <Badge variant="outline" className="text-xs">{s.duration}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 max-w-xl">{s.message}</p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                        <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => toast.success("Session confirmed!")}>
                          <CheckCircle className="h-4 w-4 mr-1.5" /> Confirm
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => toast.error("Session declined")}>
                          <XCircle className="h-4 w-4 mr-1.5" /> Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed Sessions */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Completed Sessions
            <Badge variant="secondary" className="ml-2 text-xs">{completed.length}</Badge>
          </h2>
          <div className="space-y-4">
            {completed.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="card-elevated opacity-80">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{s.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-display font-semibold text-foreground">{s.topic}</h3>
                          <p className="text-sm text-muted-foreground font-medium">{s.mentee}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {s.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.time}</span>
                            <Badge variant="outline" className="text-xs">{s.duration}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 max-w-xl">{s.message}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        <CheckCircle className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorSessionsPage;
