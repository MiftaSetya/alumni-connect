import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { careerPaths } from "@/data/mock-data";
import { ArrowLeft, GraduationCap, Briefcase, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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
  const cp = careerPaths.find((c) => c.id === id);

  if (!cp) return <DashboardLayout title="Not Found"><p>Career path not found.</p></DashboardLayout>;

  return (
    <DashboardLayout title="Career Timeline">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{cp.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">{cp.name}</h2>
                <p className="text-muted-foreground">{cp.currentTitle} at {cp.company}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {cp.timeline.map((item, i) => {
                  const Icon = iconMap[item.type];
                  const color = colorMap[item.type];
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
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CareerTimelinePage;
