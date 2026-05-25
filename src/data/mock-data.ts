// All data is now served from the backend API.
// These empty exports are kept only as a fallback interface shape.
// The api.ts file will use empty arrays when the backend is unavailable.

export let mentors: any[] = [];
export let jobs: any[] = [];
export let webinars: any[] = [];
export let careerPaths: any[] = [];
export let forumPosts: any[] = [];

export const adminStats = {
  totalStudents: 0,
  totalAlumni: 0,
  activeMentorships: 0,
  jobPostings: 0,
  pendingVerifications: 0,
  webinarsThisMonth: 0,
};
