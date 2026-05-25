import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This page is deprecated — job posting is handled directly inside JobsPage via the Post Job modal.
// Redirect to /jobs for both student and alumni roles.
const PostJobPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jobs", { replace: true });
  }, [navigate]);
  return null;
};

export default PostJobPage;
