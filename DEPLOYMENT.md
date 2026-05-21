# Arc Tech Platform - Deployment & Setup Guide

## Project Status
✅ All screens now loading successfully
✅ Frontend rendering with animations and glow theme
✅ SessionProvider configured for authentication
✅ Proxy/Middleware properly configured for Next.js 16
✅ Public pages functional with mock data

## Environment Variables Required

Before deploying, add these environment variables in Vercel project settings:

```
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/arctech?retryWrites=true&w=majority
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
NEXTAUTH_URL=https://[your-domain].vercel.app
RESEND_API_KEY=[your-resend-api-key]
```

## Running Locally

```bash
# Install dependencies
pnpm install

# Add environment variables to .env.local
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
app/
├── page.tsx                 # Home page
├── services/                # Services page
├── portfolio/               # Portfolio page
├── gallery/                 # Gallery page
├── blogs/                   # Blog listings
├── career/                  # Career/Jobs page
├── contact/                 # Contact form
├── auth/                    # Authentication
│   ├── signin/
│   └── signup/
├── dashboard/               # Admin dashboard
│   └── page.tsx
├── admin/                   # Admin CRUD pages
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
└── api/                     # API routes
    ├── auth/                # Authentication
    ├── services/            # CRUD endpoints
    ├── portfolio/
    ├── gallery/
    ├── team/
    ├── blogs/
    ├── contact/
    ├── hiring/
    ├── applications/
    ├── users/
    ├── settings/
    ├── upload/              # File uploads to Vercel Blob
    └── email/               # Email notifications
```

## Key Features Implemented

### Admin Panel
- Dashboard with analytics
- Services management (CRUD)
- Portfolio management (CRUD)
- Gallery management (CRUD)
- Team management (CRUD)
- Blog/CMS (CRUD with publish status)
- Contact submissions viewer
- Hiring posts management (CRUD)
- Job applications tracking (CRUD)
- Users management with role-based access (CRUD)
- Settings/company info

### Public Pages
- Home page with featured services
- Services showcase
- Portfolio gallery
- Image gallery with filtering
- Blog listing
- Career/Jobs page
- Contact form

### Authentication
- Email/Password signup
- Email/Password signin
- NextAuth.js v5 integration
- Role-based access control (Admin, Editor, Viewer)
- Protected routes with middleware

### Design
- Blue/Cyan glow theme
- Responsive mobile-first design
- Smooth Framer Motion animations
- Glassmorphism effects
- Professional gradient text

## Initial Setup Checklist

1. **Set Environment Variables** in Vercel Settings > Environment Variables:
   - [ ] MONGODB_URI
   - [ ] NEXTAUTH_SECRET
   - [ ] NEXTAUTH_URL
   - [ ] RESEND_API_KEY

2. **Create First Admin User**:
   - Navigate to http://localhost:3000/auth/signup
   - Create an account
   - Connect to MongoDB and update user role to "admin"

3. **Configure Company Settings**:
   - Go to /admin/settings
   - Add company info, logo, social links

4. **Add Content**:
   - [ ] Add services via /admin/services
   - [ ] Add portfolio items via /admin/portfolio
   - [ ] Upload gallery images via /admin/gallery
   - [ ] Add team members via /admin/team
   - [ ] Create blog posts via /admin/blogs
   - [ ] Post job openings via /admin/hiring

5. **Enable Integrations**:
   - [ ] Vercel Blob (already configured)
   - [ ] Resend (for email notifications)
   - [ ] MongoDB Atlas (for database)

## API Endpoints

### Public Endpoints
- GET `/api/services` - Get all services
- GET `/api/portfolio` - Get portfolio items
- GET `/api/gallery` - Get gallery images
- GET `/api/team` - Get team members
- GET `/api/blogs?published=true` - Get published blogs
- GET `/api/hiring?active=true` - Get active job postings
- POST `/api/contact` - Submit contact form
- POST `/api/applications` - Submit job application

### Admin Endpoints (Protected)
- POST/PUT/DELETE `/api/services/[id]` - Manage services
- POST/PUT/DELETE `/api/portfolio/[id]` - Manage portfolio
- POST/PUT/DELETE `/api/gallery/[id]` - Manage gallery
- POST/PUT/DELETE `/api/team/[id]` - Manage team
- POST/PUT/DELETE `/api/blogs/[id]` - Manage blogs
- POST/PUT/DELETE `/api/hiring/[id]` - Manage hiring
- POST/PUT/DELETE `/api/applications/[id]` - Manage applications
- GET/POST/PUT/DELETE `/api/users/[id]` - Manage users
- GET/PUT `/api/settings` - Manage settings

### Utility Endpoints
- POST `/api/upload` - Upload files to Vercel Blob
- POST `/api/email` - Send email notifications

## Troubleshooting

### MONGODB_URI Error
Add the environment variable to Vercel project settings or .env.local file.

### SessionProvider Warnings
Make sure all pages using `useSession()` are wrapped with `<SessionProvider>`. This is automatically done in the root layout.

### File Upload Issues
- Vercel Blob integration must be connected in Vercel project settings
- Check that the integration is properly configured

### Email Not Sending
- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard for API key validity
- Ensure email templates are configured

## Next Steps

1. Deploy to Vercel:
   ```bash
   git push  # Will trigger automatic Vercel deployment
   ```

2. Set environment variables in Vercel dashboard

3. Create first admin user and configure company info

4. Start adding content to populate the platform

5. Share with team and customers

## Support

For issues or questions:
- Check Vercel logs: `vercel logs`
- Review NextAuth documentation: https://authjs.dev
- MongoDB Atlas documentation: https://docs.atlas.mongodb.com
- Vercel Blob docs: https://vercel.com/docs/storage/vercel-blob

---

**Arc Tech - Professional Software Solutions**
Based in Islamabad, Pakistan
