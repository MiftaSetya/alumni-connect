import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, Mail, MapPin, GraduationCap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProfilePage = () => {
  return (
    <DashboardLayout title="Profile">
      <div className="space-y-6 w-full">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">AJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-display font-bold text-foreground">Alex Johnson</h2>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <BookOpen className="h-4 w-4" /> Computer Science · State University
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" /> San Francisco, CA
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <GraduationCap className="h-4 w-4" /> Class of 2026
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-4 w-4" /> alex@university.edu
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["React", "Python", "Machine Learning", "Data Analysis"].map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-base font-display font-semibold">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated!"); }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <Input defaultValue="Alex Johnson" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <Input type="email" defaultValue="alex@university.edu" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Major</label>
                    <Input defaultValue="Computer Science" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">University</label>
                    <Input defaultValue="State University" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Location</label>
                    <Input defaultValue="San Francisco, CA" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Graduation Year</label>
                    <Input defaultValue="2026" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Bio</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="Computer Science student passionate about building products that make a difference. Currently exploring opportunities in software engineering and product management."
                  />
                </div>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
