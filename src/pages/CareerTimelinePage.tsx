import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, Briefcase, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const iconMap = {
  education: GraduationCap,
  job: Briefcase,
  promotion: TrendingUp,
};

const colorMap = {
  education: "bg-info text-info-foreground",
  job: "bg-primary text-primary-foreground",
  promotion: "bg-success text-success-foreground",
};

const CareerTimelinePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [careerPath, setCareerPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareerPath = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await api.getCareerPathById(id);
          setCareerPath(data);
        }
      } catch (error) {
        console.error("Error loading career timeline:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareerPath();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Career Timeline">
        <div className="text-center py-12 text-muted-foreground animate-pulse">Loading career timeline...</div>
      </DashboardLayout>
    );
  }

  if (!careerPath) {
    return (
      <DashboardLayout title="Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Career path not found.</p>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Career Timeline">
      <div className="max-w-3xl mx-auto space-y-6 w-full">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{careerPath.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">{careerPath.name}</h2>
                <p className="text-muted-foreground">{careerPath.currentTitle} at {careerPath.company}</p>
              </div>
            </div>

            <div className="relative">
              {careerPath.timeline && careerPath.timeline.length > 0 ? (
                <>
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {careerPath.timeline.map((item: any, i: number) => {
                      const Icon = iconMap[item.type as keyof typeof iconMap] || Briefcase;
                      const color = colorMap[item.type as keyof typeof colorMap] || "bg-primary text-primary-foreground";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 relative"
                        >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="pt-1.5">
                            <p className="text-xs text-muted-foreground font-medium mb-0.5">{item.year}</p>
                            <p className="font-semibold text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.org}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No milestones recorded yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CareerTimelinePage;
