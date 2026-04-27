import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { forumPosts } from "@/data/mock-data";
import { MessageSquare, ThumbsUp, Plus } from "lucide-react";
import { motion } from "framer-motion";

const ForumPage = () => {
  return (
    <DashboardLayout title="Discussion Forum">
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Ask questions and share career insights.</p>
          <Button className="gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> New Post
          </Button>
        </div>

        <div className="space-y-4">
          {forumPosts.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="card-elevated">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{p.preview}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {p.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{p.author} · <Badge variant={p.authorRole === "Alumni" ? "default" : "secondary"} className="text-xs ml-1">{p.authorRole}</Badge></span>
                        <span>{p.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground flex-shrink-0">
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {p.replies}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {p.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ForumPage;
