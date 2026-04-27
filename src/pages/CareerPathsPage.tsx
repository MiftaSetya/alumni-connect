import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { careerPaths } from "@/data/mock-data";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CareerPathsPage = () => {
  return (
    <DashboardLayout title="Career Paths">
      <div className="space-y-4 max-w-4xl">
        <p className="text-muted-foreground">Explore alumni career journeys from graduation to their current roles.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {careerPaths.map((cp, i) => (
            <motion.div key={cp.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/career-paths/${cp.id}`}>
                <Card className="card-elevated h-full hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">{cp.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">{cp.name}</h3>
                        <p className="text-sm text-muted-foreground">{cp.currentTitle}</p>
                        <p className="text-sm text-primary font-medium">{cp.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{cp.timeline.length} milestones</span>
                      <span>·</span>
                      <span>{cp.timeline[0].year} – Present</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3">
                      View Timeline <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CareerPathsPage;
