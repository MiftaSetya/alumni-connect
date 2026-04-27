import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mentors } from "@/data/mock-data";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const BookMentoringPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mentor = mentors.find((m) => m.id === id);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");

  if (!mentor) return <DashboardLayout title="Mentor Not Found"><p>Mentor not found.</p></DashboardLayout>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mentoring session booked successfully!");
    navigate("/mentors");
  };

  return (
    <DashboardLayout title="Book Mentoring Session">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">{mentor.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-display">{mentor.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{mentor.title} at {mentor.company}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Time</Label>
                  <Select value={time} onValueChange={setTime} required>
                    <SelectTrigger>
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Discussion Topic</Label>
                <Textarea placeholder="What would you like to discuss?" value={topic} onChange={(e) => setTopic(e.target.value)} rows={4} required />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
                Confirm Booking
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BookMentoringPage;
