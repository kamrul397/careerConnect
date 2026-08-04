# 💼 CareerConnect — Full-Stack Job Portal (MERN + Next.js)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query/latest)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> **Portfolio Project** developed by **Kamrul Islam** — *Junior Full-Stack MERN & Next.js Developer*.  
> Created to demonstrate modern full-stack web development competencies, REST API design, state caching, and role-based access control (RBAC).

---

## 🔗 Live Demos

- 🚀 **Live Web App (Vercel)**: [https://career-connect-iota-pied.vercel.app](https://career-connect-iota-pied.vercel.app)
- ⚙️ **Backend API (Render)**: [https://careerconnect-server-kb9o.onrender.com](https://careerconnect-server-kb9o.onrender.com)

---

## 🎯 Project Overview & Purpose

CareerConnect is a feature-rich job search & recruitment platform built to solve real-world hiring workflows. Candidates can search and apply for jobs, Recruiters can post listings and track applicants, and Administrators can manage site content, approve postings, and manage company profiles.

### Why I Built This Project:
As a Junior MERN + Next.js Developer, my goal for this project was to master:
1. **Server-Side & Client-Side Data Fetching**: Implementing TanStack Query (React Query v5) for automatic caching (`staleTime`), query invalidation, and zero-delay UI transitions.
2. **Role-Based Security**: Protecting routes and endpoints with JWT verification and custom Express middlewares (`verifyToken`, `verifyAdmin`, `verifyRecruiter`).
3. **Database Aggregation**: Writing custom MongoDB aggregation pipelines for job category counts, job type distributions, and user statistics.
4. **Responsive Mobile-First UI**: Crafting accessible layouts with Tailwind CSS, custom drawers, and mobile accordion filters.

---

## ✨ Key Features & User Roles

### 👨‍💻 1. Candidate Features
- **Smart Search & Filters**: Search jobs by title, company, location, category, or work type (*Full-time, Part-time, Remote, Hybrid, Contract*).
- **Work Type Availability Badges**: Interactive filter badges displaying live available job counts per work type.
- **One-Click Applications**: Apply to jobs with automatic duplicate application checks and live status updates (*Pending, Shortlisted, Interview, Hired, Rejected*).
- **Saved Jobs Dashboard**: Bookmark jobs with instant `Applied ✓` indicators for positions already applied for.
- **Cloudinary Resume Upload**: Upload PDF resumes directly with upload status feedback.

### 🏢 2. Recruiter Features
- **Job Posting Management**: Post new job listings with salary ranges, work arrangements, and detailed descriptions.
- **Applicant Review Portal**: Inspect candidate profiles and evaluate submitted PDF resumes.

### 🛡️ 3. Admin Management
- **Dedicated Manage Jobs Dashboard (`/dashboard/admin/jobs`)**: Review all platform jobs, toggle approval status (`Approved ✓`, `Pending ⏳`, `Rejected ✕`), edit job details, or delete listings.
- **Company Profile Verification (`/dashboard/admin/companies`)**: Add and manage verified employer company profiles.
- **Platform Analytics**: Monitor overall platform user and job statistics.

---

## 🛠️ Tech Stack & Tools

- **Frontend**: Next.js 16 (App Router), React 19, TanStack Query v5, Tailwind CSS v4, Lucide Icons, Sonner Toast
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB Atlas with native MongoDB Node Driver (`MongoClient`)
- **Authentication**: Firebase Auth (Google & Email/Password) + Custom Server JWT Verification
- **Storage**: Cloudinary API (PDF Resumes & Profile Images)

---

## 💡 Engineering Highlights & Key Lessons Learned

During the development of CareerConnect, I encountered and solved several technical challenges:

* **Caching & Cache Invalidation with TanStack Query v5**: Replaced manual `useEffect` fetching with `useQuery` and `useQueryClient.invalidateQueries()`, reducing unnecessary network requests while maintaining real-time UI synchronization.
* **ID Comparison Mismatch**: Resolved string vs. MongoDB `ObjectId` comparison issues in saved job state checks by standardizing string conversions.
* **Firebase Auth Re-hydration**: Solved temporary `null` auth state on browser refreshes by configuring dynamic `enabled` query flags (`enabled: !!dbUser?.email`).
* **Resilient String Normalization**: Built case-insensitive regex and string normalization functions (`normalize(str)`) so job types like `"Full Time"` and `"Full-time"` match seamlessly.

---

## ⚡ Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/kamrul397/careerConnect.git
cd careerconnect

# 2. Setup & Start Backend Server
cd server
npm install
npm start
# Server runs on http://localhost:5000

# 3. Setup & Start Frontend Client (in a new terminal window)
cd client
npm install
npm run dev
# Client runs on http://localhost:3000
```

---

## 👨‍💻 Developer Profile

**Kamrul Islam**  
*Junior Full-Stack MERN & Next.js Developer*  

- 📧 **Email**: [kamrulislam25262800@gmail.com](mailto:kamrulislam25262800@gmail.com)
- 💬 **WhatsApp**: [+880 1894-565173](https://wa.me/8801894565173)
- 🐙 **GitHub**: [github.com/kamrul397](https://github.com/kamrul397)

---
*⭐ Thank you for checking out my project! Feedback and suggestions are always welcome.*
