import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { webinars } from "@/data/mock-data";
import { Calendar, Clock, Users, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
                  <h3 className="font-display font-semibold text-foreground mb-1">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{w.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {w.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {w.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {w.attendees}/{w.maxAttendees}</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1.5" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Webinar</DialogTitle>
                          <DialogDescription>
                            Make changes to your webinar here. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`title-${w.id}`} className="text-right">
                              Title
                            </Label>
                            <Input id={`title-${w.id}`} defaultValue={w.title} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`desc-${w.id}`} className="text-right">
                              Description
                            </Label>
                            <Textarea id={`desc-${w.id}`} defaultValue={w.description} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`date-${w.id}`} className="text-right">
                              Date
                            </Label>
                            <Input id={`date-${w.id}`} defaultValue={w.date} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`time-${w.id}`} className="text-right">
                              Time
                            </Label>
                            <Input id={`time-${w.id}`} defaultValue={w.time} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`capacity-${w.id}`} className="text-right">
                              Capacity
                            </Label>
                            <Input id={`capacity-${w.id}`} type="number" defaultValue={w.maxAttendees} className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" onClick={() => toast.success("Webinar updated successfully!")}>Save changes</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
