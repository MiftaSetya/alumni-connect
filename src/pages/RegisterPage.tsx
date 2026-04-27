import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "alumni" | "">("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <GraduationCap className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">
            Join AlumniConnect
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
                    onClick={() => setRole("student")}
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
                    onClick={() => setRole("alumni")}
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
