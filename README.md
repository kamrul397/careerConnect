# 🚀 CareerConnect — Full-Stack Tech Job Portal & Recruitment Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query/latest)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

CareerConnect is a modern, high-performance **Full-Stack MERN + Next.js** web application designed to connect job seekers with verified tech employers. Built with role-based access control (RBAC) for Candidates, Recruiters, and Administrators, the platform features dynamic job filtering, real-time application tracking, PDF resume uploads, and admin content governance.

---

## 🌐 Live Demo & Deployment

- **Frontend Client (Vercel)**: [https://career-connect-iota-pied.vercel.app](https://career-connect-iota-pied.vercel.app)
- **Backend API (Render)**: [https://careerconnect-server-kb9o.onrender.com](https://careerconnect-server-kb9o.onrender.com)

---

## ✨ Key Features & Role-Based Workflows

### 👨‍💻 Candidate Features
* **Advanced Job Discovery**: Instant search and filtering by job title, company, location, category, and work type (*Full-time, Part-time, Remote, Hybrid, Contract*).
* **Work Type Availability Badges**: Interactive filter badges displaying live job counts for each work type.
* **One-Click Applications**: Seamless job application workflow with automatic duplicate prevention and real-time status tracking (*Pending, Shortlisted, Interview, Hired, Rejected*).
* **Saved Jobs Dashboard**: Bookmark high-potential listings with instant `Applied ✓` indicators for positions already applied to.
* **Resume & Profile Management**: Upload PDF resumes directly to Cloudinary with progress tracking and full profile customization.

### 🏢 Recruiter & Employer Features
* **Job Posting Portal**: Create rich job postings complete with salary ranges, work arrangements, technology stacks, and detailed requirements.
* **Applicant Review System**: Inspect applicant lists, review candidate credentials, and evaluate uploaded PDF resumes.
* **Listing Management**: Edit active job listings or adjust hiring requirements in real-time.

### 🛡️ Admin Governance & Dashboard
* **Full Job Management Page (`/dashboard/admin/jobs`)**: Complete admin dashboard to inspect, edit, delete, or change approval status (`Approved ✓`, `Pending ⏳`, `Rejected ✕`) for any job listing across the platform.
* **Company Verification (`/dashboard/admin/companies`)**: Admin-only approval workflow for onboarding legitimate company profiles to eliminate spam listings.
* **Platform Analytics & User Oversight**: Real-time public & admin dynamic statistics powered by MongoDB aggregations.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Framework**: Next.js 16 (App Router with Turbopack) & React 19
* **State & Caching**: TanStack Query (React Query v5) for in-memory caching (`staleTime`) and zero-delay client navigation
* **Styling**: Tailwind CSS v4 & Lucide React Icons
* **Authentication**: Firebase Authentication (Google & Email/Password) + Custom JWT Verification
* **Form & Validation**: React Hook Form, Zod & Sonner Toast Notifications
* **Visual Data**: Recharts for dynamic analytics visualization

### **Backend**
* **Runtime & Framework**: Node.js & Express.js (ES Modules)
* **Database**: MongoDB Atlas with native MongoDB Driver (`MongoClient`)
* **Security & Tokens**: JSON Web Tokens (JWT), HTTP-Only Cookies, CORS Protection, and custom RBAC Middleware (`verifyToken`, `verifyAdmin`, `verifyRecruiter`)
* **Media Storage**: Cloudinary API for PDF resumes and profile photos

---

## 📁 Repository Structure

```text
careerconnect/
├── client/                     # Next.js 16 Frontend Application
│   ├── app/                    # App Router Pages & API Client
│   │   ├── (auth)/             # Login, Register & Profile setup
│   │   ├── (main)/             # Public Pages (Home, Jobs, Job Details, About, Companies)
│   │   └── dashboard/          # Role-Based Dashboards (Candidate, Recruiter, Admin)
│   ├── components/             # Reusable UI & Layout Components
│   ├── hooks/                  # Custom Hooks (useAuth, useCategories)
│   ├── services/               # API Integration Services (Axios)
│   └── lib/                    # Axios Instance Configuration
│
└── server/                     # Node.js & Express API Backend
    ├── config/                 # Database Connection (MongoDB)
    ├── controllers/            # API Route Logic (Jobs, Auth, Users, Saved Jobs, Companies)
    ├── middleware/             # Security Middleware (JWT, Roles)
    └── routes/                 # Express API Endpoint Routes
```

---

## ⚡ Local Development Setup

### **Prerequisites**
- Node.js (v18.x or higher)
- MongoDB Atlas Database connection string
- Firebase Project & Cloudinary API Credentials

### **1. Clone Repository**
```bash
git clone https://github.com/kamrul397/careerConnect.git
cd careerconnect
```

### **2. Setup Server (Backend)**
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```
Start the backend server:
```bash
npm start
# Server runs on http://localhost:5000
```

### **3. Setup Client (Frontend)**
```bash
cd ../client
npm install
```
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset
```
Start the Next.js development server:
```bash
npm run dev
# Client runs on http://localhost:3000
```

---

## 👨‍💻 Author & Contact

**Kamrul Islam** — *Full-Stack MERN & Next.js Developer*

- **Email**: [kamrulislam25262800@gmail.com](mailto:kamrulislam25262800@gmail.com)
- **WhatsApp**: [+880 1894-565173](https://wa.me/8801894565173)
- **GitHub**: [github.com/kamrul397](https://github.com/kamrul397)

---

*⭐ If you find this project helpful, please consider giving it a star on GitHub!*
