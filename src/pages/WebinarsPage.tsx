import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { webinars } from "@/data/mock-data";
import { Calendar, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const WebinarsPage = () => {
  return (
    <DashboardLayout title="Webinars">
      <div className="space-y-6 w-full">
        <p className="text-muted-foreground">Upcoming webinars and events hosted by alumni.</p>
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
                  <p className="text-sm text-primary font-medium mb-3">Hosted by {w.host}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {w.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {w.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {w.attendees}/{w.maxAttendees}</span>
                  </div>
                  <Button
                    className="mt-auto gradient-primary text-primary-foreground"
                    onClick={() => toast.success("Registered for webinar!")}
                  >
                    Register
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebinarsPage;
