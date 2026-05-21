# Arc Tech - Full Stack Software House Platform

A complete Next.js application with admin panel and public-facing pages for Arc Tech software house, located in Islamabad, Pakistan.

## 🚀 Features

### Admin Panel
- **Dashboard**: Analytics and quick stats
- **Services Management**: CRUD operations for services
- **Portfolio Management**: Showcase projects with technologies
- **Gallery Management**: Organize images by categories
- **Team Management**: Add and manage team members
- **Blogs (CMS)**: Create, edit, and publish blog posts
- **Contact Submissions**: View and manage contact form submissions
- **Hiring Posts**: Create and manage job openings
- **Job Applications**: Review and manage applications with status tracking
- **Users Management**: Add users with role-based access control (RBAC)
- **Settings**: Configure company information and social links

### Public Pages
- **Home**: Landing page with featured services
- **Services**: Display all services with descriptions
- **Portfolio**: Showcase projects with technologies
- **Gallery**: Image gallery with category filtering
- **Blogs**: Read published blog posts
- **Career**: Browse open positions and apply
- **Contact**: Send inquiries to the company

### Authentication
- Role-based access control (Admin, Editor, Viewer, User)
- NextAuth.js v5 with credentials provider
- Password hashing with bcryptjs
- Secure session management

### Design
- Modern blue/cyan glow theme
- Smooth animations with Framer Motion
- Responsive design
- Dark mode optimized

## 📋 Prerequisites

- Node.js 18+ and pnpm
- MongoDB Atlas account
- Vercel Blob integration
- Resend email service (for notifications)

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arctech

# NextAuth
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email Service
RESEND_API_KEY=your-resend-api-key

# Vercel Blob (auto-configured via integration)
BLOB_READ_WRITE_TOKEN=your-blob-token
```

### 2. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 3. Database Setup

The MongoDB connection will auto-initialize with required collections when first accessed. No manual setup needed.

### 4. Create Initial Admin User

Use the sign-up page at `/auth/signup` to create the first admin account, then manually update the role to 'admin' in MongoDB.

Alternatively, use MongoDB Compass:
```javascript
db.users.updateOne(
  { email: "admin@arctech.com" },
  { $set: { role: "admin" } }
)
```

### 5. Install Dependencies & Run

```bash
# Install dependencies (already done)
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
app/
├── page.tsx                 # Home page
├── layout.tsx               # Root layout
├── globals.css              # Global styles
├── api/                     # API routes
│   ├── auth/               # Authentication
│   ├── services/           # CRUD endpoints
│   ├── portfolio/
│   ├── gallery/
│   ├── team/
│   ├── blogs/
│   ├── contact/
│   ├── hiring/
│   ├── applications/
│   ├── users/
│   ├── settings/
│   ├── upload/             # File upload
│   └── email/              # Email notifications
├── admin/                   # Admin pages
│   ├── services/
│   ├── portfolio/
│   ├── gallery/
│   ├── team/
│   ├── blogs/
│   ├── contact/
│   ├── hiring/
│   ├── applications/
│   ├── users/
│   └── settings/
├── auth/                    # Auth pages
│   ├── signin/
│   └── signup/
├── dashboard/              # Admin dashboard
├── services/               # Public pages
├── portfolio/
├── gallery/
├── blogs/
├── career/
└── contact/

components/
├── admin/                  # Admin components
├── dashboard/              # Dashboard components
└── public/                 # Public site components

lib/
├── db.ts                   # MongoDB connection
├── models/                 # Mongoose schemas
├── utils/                  # Utility functions
└── auth.ts                 # NextAuth config

middleware.ts              # Route protection
auth.ts                    # Auth configuration
tailwind.config.ts         # Tailwind configuration
```

## 🔑 Key Roles & Permissions

- **Admin**: Full access to all features
- **Editor**: Can manage content (services, portfolio, blogs, etc.)
- **Viewer**: Read-only access to dashboard
- **User**: Only public pages accessible

## 📧 Email Setup

Email notifications require Resend API key:

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`

## 📦 Vercel Blob Setup

File uploads automatically use connected Vercel Blob storage:

1. Connected via Vercel integration
2. Used for: service images, portfolio images, gallery images, team photos, blog images, resume uploads
3. Configure in project settings

## 🚀 Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Connect to Vercel and deploy
```

### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (use your Vercel domain)
   - `RESEND_API_KEY`
   - `BLOB_READ_WRITE_TOKEN`

### Database & Services

- **MongoDB**: Use Atlas production URL
- **Email**: Resend configured
- **Storage**: Vercel Blob connected

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize:
- Primary color: `#06b6d4` (cyan)
- Accent color: `#0ea5e9` (sky blue)
- Background: `#0a0e27` (dark blue)

### Company Information

Update in Admin → Settings:
- Company name, email, phone
- Location and description
- Logo and favicon URLs
- Social media links

## 🔐 Security

- Passwords hashed with bcryptjs
- NextAuth.js v5 with secure sessions
- Middleware protects admin routes
- Input validation on all forms
- MongoDB injection protection with parameterized queries

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Works on all screen sizes
- Touch-friendly navigation

## 🎯 Next Steps

1. **Setup environment variables**
2. **Create initial admin account**
3. **Configure company settings**
4. **Add services and portfolio items**
5. **Create team members**
6. **Post job openings** (if hiring)
7. **Deploy to Vercel**

## 📞 Support

For issues or questions:
- Check the docs folder
- Review API endpoints in `app/api`
- Check console logs for errors

## 📄 License

All rights reserved - Arc Tech 2026
