import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Swal } from "@/lib/alert";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.error("Login Gagal", "Silakan masukkan email dan password Anda.");
      return;
    }
    try {
      const data = await api.login(email, password);
      await Swal.fire({
        title: "Login Berhasil!",
        description: "Selamat datang kembali di AlumniHub.",
        type: "success",
        confirmText: "Masuk Dashboard",
      });
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "alumni") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      Swal.error("Login Gagal", error.message || "Email atau password salah.");
    }
  };


  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <GraduationCap className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">
            AlumniHub
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Connect with alumni mentors, explore career paths, and discover opportunities that shape your future.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">AlumniHub</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
                Sign In
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
