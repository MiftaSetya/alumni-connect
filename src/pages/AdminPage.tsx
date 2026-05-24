import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Shield, CheckCircle, XCircle, UserCheck, FileText, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Swal } from "@/lib/alert";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api";

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAlumni: 0,
    activeMentorships: 0,
    jobPostings: 0,
  });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const s = await api.getAdminStats();
      const p = await api.getPendingUsers();
      const j = await api.getJobs();
      setStats({
        totalStudents: s.totalStudents,
        totalAlumni: s.totalAlumni,
        activeMentorships: s.activeMentorships,
        jobPostings: s.jobPostings,
      });
      setPendingUsers(p);
      setJobsList(j);
    } catch (error) {
      Swal.error("Gagal Memuat Data", "Terjadi kesalahan saat memuat informasi dashboard admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, approve: boolean) => {
    const currentUser = selectedUser;
    // Tutup sementara dialog agar focus trap Radix UI melepas pointer-events, 
    // sehingga tombol SweetAlert (Swal) bisa diklik dengan normal.
    setSelectedUser(null);

    const actionText = approve ? "menyetujui" : "menolak";
    const isConfirmed = await Swal.confirm(
      "Apakah Anda yakin?",
      `Anda akan ${actionText} pendaftaran pengguna ini. Tindakan ini tidak dapat dibatalkan.`,
      approve ? "info" : "warning"
    );

    if (!isConfirmed) {
      // Jika dibatalkan, tampilkan kembali dialog review
      setSelectedUser(currentUser);
      return;
    }

    try {
      if (approve) {
        await api.approveUser(id);
        await Swal.success("Pendaftaran Disetujui", "Pengguna telah berhasil disetujui untuk masuk sistem.");
      } else {
        await api.rejectUser(id);
        await Swal.success("Pendaftaran Ditolak", "Pendaftaran pengguna telah ditolak dan akun telah dihapus.");
      }
      fetchData();
    } catch (error) {
      Swal.error("Tindakan Gagal", "Gagal memproses persetujuan akun.");
      setSelectedUser(currentUser); // Kembalikan ke dialog jika terjadi error
    }
  };

  const getDocumentUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const localUrl = localStorage.getItem("alumni_connect_api_url");
    const baseUrl = localUrl
      ? localUrl.replace("/api", "")
      : (import.meta.env.VITE_API_URL as string)?.replace("/api", "") || "http://127.0.0.1:8000";
    return `${baseUrl}/storage/${path}`;
  };

  const getUserName = (user: any) => {
    if (user.role === "student" && user.student_profile) return user.student_profile.full_name;
    if (user.role === "alumni" && user.mentor_profile) return user.mentor_profile.full_name;
    return user.email;
  };

  const statItems = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-primary" },
    { label: "Total Alumni", value: stats.totalAlumni, icon: UserCheck, color: "text-success" },
    { label: "Active Mentorships", value: stats.activeMentorships, icon: Shield, color: "text-info" },
    { label: "Job Postings", value: stats.jobPostings, icon: Briefcase, color: "text-warning" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" showSidebar={false} showProfile={false}>
      <div className="space-y-6 w-full">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-muted-foreground animate-pulse">Loading dashboard details...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statItems.map((s, i) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="font-display text-base">
                    Pending Verifications
                    <Badge variant="secondary" className="ml-2 text-xs">{pendingUsers.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingUsers.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-lg bg-card/50">
                      No pending user verifications.
                    </div>
                  ) : (
                    pendingUsers.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="cursor-pointer flex-1" onClick={() => setSelectedUser(u)}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{getUserName(u)}</span>
                            <Badge variant={u.role === "student" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                              {u.role === "student" ? "Mahasiswa" : "Alumni"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10 bg-transparent h-8 w-8" onClick={() => setSelectedUser(u)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-success hover:bg-success/10 bg-transparent h-8 w-8" onClick={() => handleAction(u.id, true)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 bg-transparent h-8 w-8" onClick={() => handleAction(u.id, false)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="font-display text-base">Recent Job Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobsList.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-lg bg-card/50">
                      No job posts shared yet.
                    </div>
                  ) : (
                    jobsList.slice(0, 4).map((j) => (
                      <div key={j.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{j.title}</p>
                          <p className="text-xs text-muted-foreground">{j.company} · {j.postedBy}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">{j.type}</Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[450px]">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Verification Review</DialogTitle>
                <DialogDescription>Review details and proof of document before approving this user.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-0.5">Full Name</h4>
                    <p className="text-sm font-semibold text-foreground">{getUserName(selectedUser)}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-0.5">Role</h4>
                    <Badge variant={selectedUser.role === "student" ? "default" : "secondary"}>
                      {selectedUser.role === "student" ? "Mahasiswa" : "Alumni"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-0.5">Email</h4>
                  <p className="text-sm text-foreground">{selectedUser.email}</p>
                </div>


                {selectedUser.role === "alumni" && selectedUser.mentor_profile && (
                  <div className="grid grid-cols-2 gap-4 border-t pt-3">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-0.5">Position / Title</h4>
                      <p className="text-sm text-foreground">{selectedUser.mentor_profile.title || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-0.5">Company</h4>
                      <p className="text-sm text-foreground">{selectedUser.mentor_profile.company || "-"}</p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-3">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5">
                    {selectedUser.role === "student" ? "KTM (Kartu Tanda Mahasiswa)" : "Ijazah"} Document
                  </h4>
                  <div className="border rounded-lg overflow-hidden bg-muted/10 p-2 flex justify-center items-center">
                    {selectedUser.verification_document?.toLowerCase().endsWith(".pdf") ? (
                      <a
                        href={getDocumentUrl(selectedUser.verification_document)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1.5 py-4 font-semibold text-sm"
                      >
                        <FileText className="h-5 w-5 text-destructive" />
                        Buka File PDF Bukti (KTM / Ijazah)
                      </a>
                    ) : selectedUser.verification_document ? (
                      <img
                        src={getDocumentUrl(selectedUser.verification_document)}
                        alt="Dokumen Bukti"
                        className="max-h-60 w-full object-contain rounded border"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <p className="text-xs text-muted-foreground py-4">No document uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 border-t pt-3">
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleAction(selectedUser.id, false)}>
                  Tolak (Reject)
                </Button>
                <Button className="gradient-primary text-primary-foreground font-semibold" onClick={() => handleAction(selectedUser.id, true)}>
                  Setujui (Approve)
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminPage;
