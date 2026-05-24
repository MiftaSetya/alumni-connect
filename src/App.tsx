import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MentorsPage from "./pages/MentorsPage";
import BookMentoringPage from "./pages/BookMentoringPage";
import CareerPathsPage from "./pages/CareerPathsPage";
import CareerTimelinePage from "./pages/CareerTimelinePage";
import JobsPage from "./pages/JobsPage";
import WebinarsPage from "./pages/WebinarsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import MentorDashboardPage from "./pages/mentor/MentorDashboardPage";
import MentorSessionsPage from "./pages/mentor/MentorSessionsPage";
import MentorPostJobPage from "./pages/mentor/MentorPostJobPage";
import MentorWebinarsPage from "./pages/mentor/MentorWebinarsPage";
import MentorProfilePage from "./pages/mentor/MentorProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/mentors/:id/book" element={<BookMentoringPage />} />
          <Route path="/career-paths" element={<CareerPathsPage />} />
          <Route path="/career-paths/:id" element={<CareerTimelinePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/webinars" element={<WebinarsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />
          <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
          <Route path="/mentor/sessions" element={<MentorSessionsPage />} />
          <Route path="/mentor/post-job" element={<MentorPostJobPage />} />
          <Route path="/mentor/webinars" element={<MentorWebinarsPage />} />
          <Route path="/mentor/profile" element={<MentorProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
