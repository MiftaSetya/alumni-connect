import * as mockData from "@/data/mock-data";

// Dynamically get the API base URL from env or localStorage
const getApiBaseUrl = (): string => {
  const localUrl = localStorage.getItem("alumni_connect_api_url");
  if (localUrl) return localUrl;
  return (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000/api";
};

// Helper to make fetch calls with auto auth headers
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiBaseUrl();
  const token = localStorage.getItem("alumni_connect_token");

  const headers: any = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}/${endpoint.replace(/^\//, "")}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired or unauthorized, clean up
    localStorage.removeItem("alumni_connect_token");
    localStorage.removeItem("alumni_connect_user");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Request failed with status ${response.status}`);
    (error as any).isBackendResponse = true;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    try {
      const data = await apiFetch("auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.token && data.user) {
        localStorage.setItem("alumni_connect_token", data.token);
        localStorage.setItem("alumni_connect_user", JSON.stringify(data.user));
      }
      return data;
    } catch (error: any) {
      if (error.isBackendResponse) {
        throw error;
      }
      console.warn("Backend unavailable, falling back to mock login.", error);
      
      // Check if we have this user in our registered mock users
      const mockUsers = JSON.parse(localStorage.getItem("alumni_connect_mock_users") || "[]");
      const foundMock = mockUsers.find((mu: any) => mu.email === email);
      
      let mockUser;
      if (foundMock) {
        mockUser = foundMock.user;
        if (!mockUser.is_approved) {
          const approvalError = new Error("Akun Anda belum disetujui oleh admin. Silakan hubungi admin atau tunggu hingga akun Anda diverifikasi.");
          (approvalError as any).isBackendResponse = true;
          throw approvalError;
        }
      } else {
        // Dual-mode mock fallback logic
        mockUser = {
          id: "mock-student-id",
          email,
          role: "student",
          is_approved: true, // Default profiles are pre-approved
          student_profile: { full_name: "Mock Student", avatar: "MS" },
          mentor_profile: null,
        };

        if (email.includes("admin")) {
          mockUser = {
            id: "mock-admin-id",
            email,
            role: "admin",
            is_approved: true,
            student_profile: null,
            mentor_profile: null,
          };
        } else if (email.includes("sarah") || email.includes("michael") || email.includes("mentor")) {
          mockUser = {
            id: "mock-mentor-id",
            email,
            role: "alumni",
            is_approved: true,
            student_profile: null,
            mentor_profile: { full_name: "Sarah Connor", avatar: "SC" },
          };
        }
      }

      localStorage.setItem("alumni_connect_token", "mock-session-token");
      localStorage.setItem("alumni_connect_user", JSON.stringify(mockUser));
      return { token: "mock-session-token", user: mockUser };
    }
  },

  register: async (name: string, email: string, password: string, role: string, verificationFile?: File) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (verificationFile) {
        formData.append("verification_file", verificationFile);
      }
      return await apiFetch("auth/register", {
        method: "POST",
        body: formData,
      });
    } catch (error: any) {
      if (error.isBackendResponse) {
        throw error;
      }
      console.warn("Backend unavailable, falling back to mock registration.", error);
      
      // Save mock user to localStorage (is_approved: false by default, requires admin approval)
      const mockUser = {
        id: `mock-user-${Date.now()}`,
        email,
        role,
        is_approved: false, // All registered users require admin approval
        student_profile: role === "student" ? { full_name: name, avatar: name.substring(0, 2).toUpperCase() } : null,
        mentor_profile: role === "alumni" ? { full_name: name, avatar: name.substring(0, 2).toUpperCase() } : null,
      };
      
      const mockUsers = JSON.parse(localStorage.getItem("alumni_connect_mock_users") || "[]");
      mockUsers.push({ email, password, user: mockUser });
      localStorage.setItem("alumni_connect_mock_users", JSON.stringify(mockUsers));

      return { token: "mock-session-token", user: mockUser };
    }
  },

  getPendingUsers: async () => {
    try {
      return await apiFetch("admin/users/pending");
    } catch (error) {
      console.warn("Backend pending users API unavailable, returning mock pending users.");
      
      // Load offline mock users from localStorage that are pending approval
      const mockUsers = JSON.parse(localStorage.getItem("alumni_connect_mock_users") || "[]");
      const pendingFromLocalStorage = mockUsers
        .filter((mu: any) => !mu.user.is_approved)
        .map((mu: any) => ({
          id: mu.user.id,
          email: mu.user.email,
          role: mu.user.role,
          is_approved: false,
          verification_document: "verification_documents/mock_ktm.pdf",
          student_profile: mu.user.student_profile,
          mentor_profile: mu.user.mentor_profile,
          created_at: new Date().toISOString(),
        }));

      // Combine with default mock pending users
      const defaultMockPending = [
        {
          id: "mock-pending-student-1",
          email: "tony.stark@university.edu",
          role: "student",
          is_approved: false,
          verification_document: "verification_documents/mock_ktm.pdf",
          student_profile: {
            full_name: "Tony Stark",
            major: "Mechanical Engineering",
            university: "State University",
          },
          created_at: new Date().toISOString(),
        },
        {
          id: "mock-pending-alumni-1",
          email: "bruce.wayne@google.com",
          role: "alumni",
          is_approved: false,
          verification_document: "verification_documents/mock_ijazah.jpg",
          mentor_profile: {
            full_name: "Bruce Wayne",
            title: "CEO",
            company: "Wayne Enterprises",
          },
          created_at: new Date().toISOString(),
        }
      ];

      // Filter default mock users by approval/rejection state stored in localStorage
      const approvedIds = JSON.parse(localStorage.getItem("alumni_connect_approved_mock_ids") || "[]");
      const rejectedIds = JSON.parse(localStorage.getItem("alumni_connect_rejected_mock_ids") || "[]");

      const activeDefaults = defaultMockPending.filter(
        (u) => !approvedIds.includes(u.id) && !rejectedIds.includes(u.id)
      );

      return [...pendingFromLocalStorage, ...activeDefaults];
    }
  },

  approveUser: async (id: string) => {
    try {
      return await apiFetch(`admin/users/${id}/approve`, {
        method: "POST",
      });
    } catch (error) {
      console.warn("Backend approve user API unavailable, using mock.");
      
      // Update custom registered mock user state to is_approved: true
      const mockUsers = JSON.parse(localStorage.getItem("alumni_connect_mock_users") || "[]");
      const updatedMockUsers = mockUsers.map((mu: any) => {
        if (mu.user.id === id) {
          return {
            ...mu,
            user: { ...mu.user, is_approved: true }
          };
        }
        return mu;
      });
      localStorage.setItem("alumni_connect_mock_users", JSON.stringify(updatedMockUsers));

      // Track approved default mock IDs
      const approvedIds = JSON.parse(localStorage.getItem("alumni_connect_approved_mock_ids") || "[]");
      if (!approvedIds.includes(id)) {
        approvedIds.push(id);
        localStorage.setItem("alumni_connect_approved_mock_ids", JSON.stringify(approvedIds));
      }

      return { success: true };
    }
  },

  rejectUser: async (id: string) => {
    try {
      return await apiFetch(`admin/users/${id}/reject`, {
        method: "POST",
      });
    } catch (error) {
      console.warn("Backend reject user API unavailable, using mock.");

      // Remove custom mock user from localStorage
      const mockUsers = JSON.parse(localStorage.getItem("alumni_connect_mock_users") || "[]");
      const filtered = mockUsers.filter((mu: any) => mu.user.id !== id);
      localStorage.setItem("alumni_connect_mock_users", JSON.stringify(filtered));

      // Track rejected default mock IDs
      const rejectedIds = JSON.parse(localStorage.getItem("alumni_connect_rejected_mock_ids") || "[]");
      if (!rejectedIds.includes(id)) {
        rejectedIds.push(id);
        localStorage.setItem("alumni_connect_rejected_mock_ids", JSON.stringify(rejectedIds));
      }

      return { success: true };
    }
  },

  logout: async () => {
    try {
      await apiFetch("auth/logout", { method: "POST" });
    } catch (e) {
      // Ignored if backend fails
    }
    localStorage.removeItem("alumni_connect_token");
    localStorage.removeItem("alumni_connect_user");
  },

  getAuthUser: () => {
    const userStr = localStorage.getItem("alumni_connect_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Admin and Stats
  getAdminStats: async () => {
    try {
      return await apiFetch("admin/stats");
    } catch (error) {
      console.warn("Backend admin stats API unavailable, using local dynamic counting.");
      try {
        const mentorsList = await api.getMentors();
        const jobsList = await api.getJobs();
        return {
          totalStudents: 156,
          totalAlumni: mentorsList.length,
          activeMentorships: 12,
          jobPostings: jobsList.length,
        };
      } catch {
        return mockData.adminStats;
      }
    }
  },

  // Mentors / Alumni Profiles
  getMentors: async (search?: string) => {
    try {
      const endpoint = search ? `mentors?search=${encodeURIComponent(search)}` : "mentors";
      const data = await apiFetch(endpoint);
      return data.map((m: any) => ({
        id: m.id,
        name: m.full_name,
        avatar: m.avatar || "M",
        title: m.title || "Mentor",
        company: m.company || "AlumniHub",
        industry: m.industry || "General",
        skills: m.skills ? m.skills.map((s: any) => s.name) : [],
        bio: m.bio || "",
        graduationYear: m.graduation_year || 2020,
        rating: parseFloat(m.rating) || 4.5,
        sessions: parseInt(m.sessions_count) || 0,
        isVerified: m.is_verified === 1 || m.is_verified === true || m.is_verified === "1",
      }));
    } catch (error) {
      if (search) {
        return mockData.mentors.filter(
          (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            m.company.toLowerCase().includes(search.toLowerCase())
        );
      }
      return mockData.mentors;
    }
  },

  verifyAlumni: async (id: string, isVerified: boolean) => {
    try {
      return await apiFetch(`mentors/${id}`, {
        method: "POST",
        body: JSON.stringify({ is_verified: isVerified }),
      });
    } catch (error) {
      console.warn("Backend unavailable, using mock verifyAlumni.");
      return { success: true };
    }
  },

  // Jobs
  getJobs: async (search?: string) => {
    try {
      const endpoint = search ? `jobs?search=${encodeURIComponent(search)}` : "jobs";
      const data = await apiFetch(endpoint);
      return data.map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.type,
        deadline: j.deadline ? j.deadline.split("T")[0] : "",
        postedBy: (typeof j.posted_by === "object" && j.posted_by !== null)
          ? (j.posted_by.full_name || "Alumni Mentor")
          : (j.posted_by_mentor?.full_name || j.posted_by || "Alumni Mentor"),
        description: j.description,
      }));
    } catch (error) {
      if (search) {
        return mockData.jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.company.toLowerCase().includes(search.toLowerCase())
        );
      }
      return mockData.jobs;
    }
  },

  createJob: async (job: {
    title: string;
    company: string;
    location: string;
    type: string;
    deadline: string;
    description: string;
  }) => {
    try {
      return await apiFetch("jobs", {
        method: "POST",
        body: JSON.stringify(job),
      });
    } catch (error) {
      console.warn("Backend unavailable, using mock createJob.");
      const mockNewJob = {
        id: Math.random().toString(),
        ...job,
        postedBy: "Sarah Chen",
      };
      return mockNewJob;
    }
  },

  deleteJob: async (id: string) => {
    try {
      return await apiFetch(`jobs/${id}`, { method: "DELETE" });
    } catch (error) {
      console.warn("Backend unavailable, using mock deleteJob.");
      return true;
    }
  },

  // Webinars
  getWebinars: async (search?: string) => {
    try {
      const endpoint = search ? `webinars?search=${encodeURIComponent(search)}` : "webinars";
      const data = await apiFetch(endpoint);
      return data.map((w: any) => ({
        id: w.id,
        title: w.title,
        description: w.description,
        host: (typeof w.host === "object" && w.host !== null)
          ? (w.host.full_name || "Alumni Mentor")
          : (typeof w.host === "string" ? w.host : "Alumni Mentor"),
        date: w.date ? w.date.split("T")[0] : "",
        time: w.time,
        attendees: w.registrations_count || 0,
        maxAttendees: w.max_attendees || 100,
        meet_link: w.meet_link || "",
      }));
    } catch (error) {
      return mockData.webinars;
    }
  },

  registerWebinar: async (id: string) => {
    try {
      return await apiFetch(`webinars/${id}/register`, { method: "POST" });
    } catch (error) {
      console.warn("Backend unavailable, using mock registerWebinar.");
      return { success: true };
    }
  },

  unregisterWebinar: async (id: string) => {
    try {
      return await apiFetch(`webinars/${id}/unregister`, { method: "POST" });
    } catch (error) {
      console.warn("Backend unavailable, using mock unregisterWebinar.");
      return { success: true };
    }
  },

  createWebinar: async (webinar: {
    title: string;
    description: string;
    date: string;
    time: string;
    max_attendees: number;
    meet_link: string;
  }) => {
    try {
      return await apiFetch("webinars", {
        method: "POST",
        body: JSON.stringify(webinar),
      });
    } catch (error) {
      console.warn("Backend unavailable, using mock createWebinar.");
      return { id: Math.random().toString(), ...webinar, attendees: 0, host: "Sarah Chen" };
    }
  },

  deleteWebinar: async (id: string) => {
    try {
      return await apiFetch(`webinars/${id}`, { method: "DELETE" });
    } catch (error) {
      console.warn("Backend unavailable, using mock deleteWebinar.");
      return true;
    }
  },

  // Career Paths
  getCareerPaths: async () => {
    try {
      const data = await apiFetch("career-paths");
      return data.map((cp: any) => ({
        id: cp.id,
        name: cp.full_name,
        avatar: cp.avatar || cp.full_name?.substring(0, 2).toUpperCase() || "CP",
        currentTitle: cp.title || "Mentor",
        company: cp.company || "AlumniHub",
        timeline: cp.career_milestones ? cp.career_milestones.map((m: any) => ({
          year: m.year,
          title: m.title,
          org: m.org,
          type: m.type as "education" | "job" | "promotion",
        })) : [],
      }));
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock career paths.");
      return mockData.careerPaths;
    }
  },

  getCareerPathById: async (id: string) => {
    try {
      const cp = await apiFetch(`career-paths/${id}`);
      return {
        id: cp.id,
        name: cp.full_name,
        avatar: cp.avatar || cp.full_name?.substring(0, 2).toUpperCase() || "CP",
        currentTitle: cp.title || "Mentor",
        company: cp.company || "AlumniHub",
        timeline: cp.career_milestones ? cp.career_milestones.map((m: any) => ({
          year: m.year,
          title: m.title,
          org: m.org,
          type: m.type as "education" | "job" | "promotion",
        })) : [],
      };
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock career path.");
      const found = mockData.careerPaths.find((c) => c.id === id);
      return found || null;
    }
  },

  // Forums & Discussions
  getForumPosts: async (search?: string) => {
    try {
      const endpoint = search ? `forum-threads?search=${encodeURIComponent(search)}` : "forum-threads";
      const data = await apiFetch(endpoint);
      return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        author: p.author?.student_profile?.full_name || p.author?.mentor_profile?.full_name || "AlumniHub User",
        authorRole: p.author?.role === "student" ? "Student" : "Alumni",
        date: new Date(p.created_at).toISOString().split("T")[0],
        replies: p.comments_count || 0,
        likes: p.likes_count || 0,
        tags: p.tags ? p.tags.map((t: any) => t.name) : [],
        preview: p.content.substring(0, 150) + (p.content.length > 150 ? "..." : ""),
      }));
    } catch (error) {
      return mockData.forumPosts;
    }
  },

  createForumPost: async (post: { title: string; content: string; tags: string[] }) => {
    try {
      return await apiFetch("forum-threads", {
        method: "POST",
        body: JSON.stringify(post),
      });
    } catch (error) {
      console.warn("Backend unavailable, using mock createForumPost.");
      const mockNewPost = {
        id: Math.random().toString(),
        title: post.title,
        author: "Alex Johnson",
        authorRole: "Student",
        date: new Date().toISOString().split("T")[0],
        replies: 0,
        likes: 0,
        tags: post.tags,
        preview: post.content.substring(0, 150),
      };
      return mockNewPost;
    }
  },

  likeForumPost: async (id: string) => {
    try {
      return await apiFetch(`forum-threads/${id}/like`, { method: "POST" });
    } catch (error) {
      console.warn("Backend unavailable, using mock likeForumPost.");
      return { success: true };
    }
  },

  // Mentorship Sessions
  getMentorshipSessions: async () => {
    try {
      return await apiFetch("mentorship-sessions");
    } catch (error) {
      console.warn("Backend unavailable, using mock getMentorshipSessions.");
      return [];
    }
  },

  bookMentorshipSession: async (session: {
    mentor_id: string;
    topic: string;
    date: string;
    time: string;
    message?: string;
  }) => {
    try {
      return await apiFetch("mentorship-sessions", {
        method: "POST",
        body: JSON.stringify(session),
      });
    } catch (error) {
      console.warn("Backend unavailable, using mock bookMentorshipSession.");
      return { success: true };
    }
  },

  updateSessionStatus: async (id: string, status: "pending" | "upcoming" | "completed" | "declined") => {
    try {
      return await apiFetch(`mentorship-sessions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.warn("Backend unavailable, using mock updateSessionStatus.");
      return { success: true };
    }
  },

  updateProfile: async (profileData: {
    full_name?: string;
    major?: string;
    university?: string;
    location?: string;
    graduation_year?: number | null;
    bio?: string;
    title?: string;
    company?: string;
  }) => {
    try {
      const updatedUser = await apiFetch("auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });
      // Sync updated user data into localStorage
      localStorage.setItem("alumni_connect_user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      if (error.isBackendResponse) throw error;
      console.warn("Backend unavailable, saving profile to localStorage only.");
      // Offline fallback: merge into localStorage user
      const currentUser = JSON.parse(localStorage.getItem("alumni_connect_user") || "{}");
      if (currentUser.student_profile) {
        currentUser.student_profile = { ...currentUser.student_profile, ...profileData };
      } else if (currentUser.mentor_profile) {
        currentUser.mentor_profile = { ...currentUser.mentor_profile, ...profileData };
      }
      localStorage.setItem("alumni_connect_user", JSON.stringify(currentUser));
      return currentUser;
    }
  },
};

