import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { Swal } from "@/lib/alert";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";

const WebinarsPage = () => {
  const [webinarsList, setWebinarsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const data = await api.getWebinars();
      setWebinarsList(data);
    } catch (error) {
      console.error("Error loading webinars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  const handleRegister = async (w: any) => {
    const isConfirmed = await Swal.confirm(
      "Konfirmasi Pendaftaran",
      `Apakah Anda yakin ingin mendaftar ke webinar "${w.title}"?`,
      "info"
    );

    if (!isConfirmed) return;

    try {
      await api.registerWebinar(w.id);
      await Swal.success("Berhasil", "Anda berhasil mendaftar ke webinar!");
      fetchWebinars();
    } catch (error) {
      Swal.error("Gagal", "Gagal mendaftar ke webinar.");
    }
  };

  const handleCancelRegister = async (w: any) => {
    const isConfirmed = await Swal.confirm(
      "Batalkan Pendaftaran",
      `Apakah Anda yakin ingin membatalkan pendaftaran dari webinar "${w.title}"?`,
      "warning"
    );

    if (!isConfirmed) return;

    try {
      await api.unregisterWebinar(w.id);
      await Swal.success("Berhasil", "Pendaftaran berhasil dibatalkan.");
      fetchWebinars();
    } catch (error) {
      Swal.error("Gagal", "Gagal membatalkan pendaftaran.");
    }
  };

  return (
    <DashboardLayout title="Webinars">
      <div className="space-y-6 w-full">
        <p className="text-muted-foreground">Upcoming webinars and events hosted by alumni.</p>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">
            Loading webinars...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {webinarsList.map((w, i) => (
              <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`card-elevated h-full border-t-2 ${w.isRegistered ? 'border-t-emerald-500' : 'border-t-transparent'}`}>
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-display font-semibold text-foreground text-base leading-snug">{w.title}</h3>
                      {w.isRegistered && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                          Registered
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{w.description}</p>
                    <p className="text-sm text-primary font-medium mb-3">Hosted by {w.host}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(w.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatTime(w.time)}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {w.attendees}/{w.maxAttendees}</span>
                    </div>
                    {w.isRegistered && w.meet_link && (
                      <div className="mt-1 mb-4 p-2.5 bg-emerald-500/5 rounded-lg border border-emerald-500/15 flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 truncate">
                          <Video className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{w.meet_link}</span>
                        </span>
                        <a
                          href={w.meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex-shrink-0"
                        >
                          Join
                        </a>
                      </div>
                    )}
                    {w.isRegistered ? (
                      <Button onClick={() => handleCancelRegister(w)} variant="outline" className="mt-auto border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold h-10">
                        Cancel Registration
                      </Button>
                    ) : (
                      <Button onClick={() => handleRegister(w)} className="mt-auto gradient-primary text-primary-foreground font-semibold h-10">
                        Register
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WebinarsPage;
