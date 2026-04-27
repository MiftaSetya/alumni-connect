import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminStats, mentors, jobs } from "@/data/mock-data";
import { Users, Briefcase, Shield, Video, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const stats = [
  { label: "Total Students", value: adminStats.totalStudents, icon: Users, color: "text-primary" },
  { label: "Total Alumni", value: adminStats.totalAlumni, icon: UserCheck, color: "text-success" },
  { label: "Active Mentorships", value: adminStats.activeMentorships, icon: Shield, color: "text-info" },
  { label: "Job Postings", value: adminStats.jobPostings, icon: Briefcase, color: "text-warning" },
];

const AdminPage = () => {
  return (
    <DashboardLayout title="Admin Dashboard" showSidebar={false} showProfile={false}>
      <div className="space-y-6 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-elevated">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-base">Pending Alumni Verifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mentors.slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.title} at {m.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-success hover:bg-success/10" onClick={() => toast.success("Alumni verified")}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => toast.error("Alumni rejected")}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-base">Recent Job Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobs.slice(0, 4).map((j) => (
                <div key={j.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{j.title}</p>
                    <p className="text-xs text-muted-foreground">{j.company} · {j.postedBy}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{j.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
