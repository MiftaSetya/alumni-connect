import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { mentors } from "@/data/mock-data";
import { Search, Star, MessageSquare, Route } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MentorsPage = () => {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null);

  const filtered = mentors.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchIndustry = industry === "all" || m.industry === industry;
    return matchSearch && matchIndustry;
  });

  return (
    <DashboardLayout title="Mentor Directory">
      <div className="space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search mentors by name, company, or skills..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Consumer Goods">Consumer Goods</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="card-elevated h-full cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedMentor(m)}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{m.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground">{m.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{m.title}</p>
                      <p className="text-sm text-primary font-medium">{m.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1 text-warning"><Star className="h-3.5 w-3.5 fill-current" /> {m.rating}</span>
                    <span>{m.sessions} sessions</span>
                    <span>Class of {m.graduationYear}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{m.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedMentor && (
            <>
              <DialogHeader>
                <DialogTitle>Mentor Profile</DialogTitle>
                <DialogDescription>Details about {selectedMentor.name}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">{selectedMentor.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-display text-xl font-bold">{selectedMentor.name}</h3>
                    <p className="text-muted-foreground">{selectedMentor.title}</p>
                    <p className="text-primary font-medium">{selectedMentor.company}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Industry</p>
                    <p className="font-medium">{selectedMentor.industry}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Graduation Year</p>
                    <p className="font-medium">{selectedMentor.graduationYear}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Rating</p>
                    <p className="font-medium flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {selectedMentor.rating}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Sessions Completed</p>
                    <p className="font-medium">{selectedMentor.sessions}</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">About</p>
                  <p className="text-sm">{selectedMentor.bio}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.skills.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <div className="flex gap-2 w-full">
                  <Button asChild className="flex-1 gradient-primary text-primary-foreground">
                    <Link to={`/mentors/${selectedMentor.id}/book`}>
                      <MessageSquare className="h-4 w-4 mr-2" /> Book Mentoring
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/career-paths/${selectedMentor.id}`}>
                      <Route className="h-4 w-4 mr-2" /> View Career Path
                    </Link>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MentorsPage;
