import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Swal } from "@/lib/alert";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "alumni" | "">("");
  const [verificationFile, setVerificationFile] = useState<File | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      Swal.error("Registrasi Gagal", "Silakan pilih apakah Anda Mahasiswa atau Alumni.");
      return;
    }
    if (!name || !email || !password) {
      Swal.error("Registrasi Gagal", "Semua kolom input wajib diisi.");
      return;
    }
    if (!verificationFile) {
      Swal.error(
        "Registrasi Gagal",
        role === "student"
          ? "Silakan unggah KTM (Kartu Tanda Mahasiswa) Anda sebagai bukti."
          : "Silakan unggah Ijazah Anda sebagai bukti."
      );
      return;
    }
    try {
      await api.register(name, email, password, role, verificationFile);
      await Swal.success(
        "Pendaftaran Berhasil!",
        "Akun Anda telah terdaftar dan sedang menunggu persetujuan dari admin."
      );
      navigate("/login");
    } catch (error: any) {
      Swal.error("Registrasi Gagal", error.message || "Terjadi kesalahan saat mendaftar.");
    }
  };


  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <GraduationCap className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">
            Join AlumniHub
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Whether you're a student seeking guidance or an alumni ready to give back, there's a place for you here.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="text-center space-y-2 pb-2">
            <h2 className="text-2xl font-display font-bold text-foreground">Create an account</h2>
            <p className="text-muted-foreground text-sm">Start your journey today</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">I am a</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("student");
                      setVerificationFile(null);
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      role === "student"
                        ? "border-primary bg-sidebar-accent text-primary font-semibold"
                        : "border-border hover:border-primary/40 text-muted-foreground"
                    }`}
                  >
                    <User className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole("alumni");
                      setVerificationFile(null);
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      role === "alumni"
                        ? "border-primary bg-sidebar-accent text-primary font-semibold"
                        : "border-border hover:border-primary/40 text-muted-foreground"
                    }`}
                  >
                    <GraduationCap className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm">Alumni</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
                </div>
              </div>
              {role && (
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-sm font-medium">
                    {role === "student" ? "Upload KTM (Kartu Tanda Mahasiswa)" : "Upload Ijazah"}
                  </Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border rounded-lg hover:border-primary/40 transition-colors cursor-pointer relative bg-muted/20">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-10 w-10 text-muted-foreground"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-muted-foreground justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                        >
                          <span>{verificationFile ? "Ganti file" : "Pilih file dokumen bukti"}</span>
                          <input
                            id="file-upload"
                            name="verification_file"
                            type="file"
                            accept="image/*,.pdf"
                            className="sr-only"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setVerificationFile(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {verificationFile ? (
                          <span className="font-semibold text-foreground block max-w-[250px] truncate">
                            {verificationFile.name}
                          </span>
                        ) : (
                          "Format: PNG, JPG, PDF (Maks. 5MB)"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
                Create Account
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
