import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, Mail, MapPin, GraduationCap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Swal } from "@/lib/alert";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    major: "",
    university: "",
    location: "",
    graduationYear: "",
    bio: "",
  });

  useEffect(() => {
    const authUser = api.getAuthUser();
    setUser(authUser);
    if (authUser) {
      const profile = authUser.student_profile || authUser.mentor_profile || {};
      setFormData({
        fullName: profile.full_name || "",
        email: authUser.email || "",
        major: profile.major || "",
        university: profile.university || "",
        location: profile.location || "",
        graduationYear: profile.graduation_year?.toString() || "",
        bio: profile.bio || "",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const updatedUser = await api.updateProfile({
        full_name: formData.fullName,
        major: formData.major,
        university: formData.university,
        location: formData.location,
        graduation_year: formData.graduationYear ? parseInt(formData.graduationYear) : null,
        bio: formData.bio,
      });
      setUser(updatedUser);
      // Sync formData from the returned DB values
      const profile = updatedUser.student_profile || updatedUser.mentor_profile || {};
      setFormData((prev) => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        major: profile.major || "",
        university: profile.university || "",
        location: profile.location || "",
        graduationYear: profile.graduation_year?.toString() || "",
        bio: profile.bio || "",
      }));
      Swal.success("Berhasil", "Profil Anda berhasil diperbarui!");
    } catch (error: any) {
      Swal.error("Gagal", error.message || "Gagal memperbarui profil.");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "AJ";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };
  const initialAvatar = getInitials(formData.fullName);

  return (
    <DashboardLayout title="Profile">
      <div className="space-y-6 w-full">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initialAvatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-display font-bold text-foreground">{formData.fullName || "Loading..."}</h2>
                  {(formData.major || formData.university) && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <BookOpen className="h-4 w-4" /> {formData.major}{formData.major && formData.university && " · "}{formData.university}
                    </p>
                  )}
                  {formData.location && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" /> {formData.location}
                    </p>
                  )}
                  {formData.graduationYear && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <GraduationCap className="h-4 w-4" /> Graduated in {formData.graduationYear}
                    </p>
                  )}
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-4 w-4" /> {formData.email}
                  </p>
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
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Major</label>
                    <Input value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">University</label>
                    <Input value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Location</label>
                    <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Graduation Year</label>
                    <Input value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Bio</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
                <Button type="submit" className="gradient-primary text-primary-foreground font-semibold h-11">
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
