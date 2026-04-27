import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { webinars } from "@/data/mock-data";
import { Calendar, Clock, Users, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const MentorWebinarsPage = () => {
  return (
    <MentorLayout title="Webinars">
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Manage and create webinars for students.</p>
          <Button className="gradient-primary text-primary-foreground" onClick={() => toast.success("Create webinar form coming soon!")}>
            <Plus className="h-4 w-4 mr-2" /> Create Webinar
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {webinars.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-elevated h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {w.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{w.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {w.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {w.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {w.attendees}/{w.maxAttendees}</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.success("Edit webinar form coming soon!")}>
                      <Edit className="h-4 w-4 mr-1.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => toast.success("Webinar deleted")}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorWebinarsPage;
