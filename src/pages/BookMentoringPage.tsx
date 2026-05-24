import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Swal } from "@/lib/alert";
import { api } from "@/lib/api";

const BookMentoringPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const mentorsList = await api.getMentors();
        const found = mentorsList.find((m: any) => m.id === id);
        setMentor(found);
      } catch (error) {
        console.error("Error loading mentor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentor) return;
    try {
      await api.bookMentorshipSession({
        mentor_id: mentor.id,
        topic,
        date,
        time,
        message: topic,
      });
      await Swal.success(
        "Pemesanan Berhasil",
        `Sesi mentoring bersama ${mentor.name} berhasil diajukan! Silakan tunggu konfirmasi.`
      );
      navigate("/mentors");
    } catch (error) {
      Swal.error("Gagal", "Gagal melakukan pemesanan sesi mentoring.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Book Mentoring Session">
        <div className="text-center py-12 text-muted-foreground animate-pulse">Loading mentor details...</div>
      </DashboardLayout>
    );
  }

  if (!mentor) {
    return (
      <DashboardLayout title="Mentor Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Mentor not found.</p>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const initialAvatar = mentor.name ? mentor.name.substring(0, 2).toUpperCase() : "M";

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
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initialAvatar}</AvatarFallback>
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
                      {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map((t) => (
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
