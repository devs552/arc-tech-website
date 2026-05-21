import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  icon: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPortfolioItem extends Document {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryImage extends Document {
  title: string;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamMember extends Document {
  name: string;
  position: string;
  image: string;
  bio: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  author: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: Date;
  updatedAt: Date;
}

export interface IHiringPost extends Document {
  title: string;
  description: string;
  position: string;
  department: string;
  experience: string;
  salary: string;
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobApplication extends Document {
  name: string;
  email: string;
  phone: string;
  position: string;
  resume: string;
  coverLetter: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  hiringPostId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISettings extends Document {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyLocation: string;
  companyDescription: string;
  logo: string;
  favicon: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  updatedAt: Date;
}

// Service Schema
const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

// Portfolio Schema
const PortfolioSchema = new Schema<IPortfolioItem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    technologies: [String],
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

// Gallery Schema
const GallerySchema = new Schema<IGalleryImage>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

// Team Member Schema
const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

// Blog Schema
const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Contact Submission Schema
const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
  },
  { timestamps: true }
);

// Hiring Post Schema
const HiringPostSchema = new Schema<IHiringPost>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    experience: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Job Application Schema
const JobApplicationSchema = new Schema<IJobApplication>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    resume: { type: String, required: true },
    coverLetter: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'shortlisted', 'rejected'],
      default: 'new',
    },
    hiringPostId: { type: String, required: true },
  },
  { timestamps: true }
);

// Settings Schema
const SettingsSchema = new Schema<ISettings>(
  {
    companyName: { type: String, default: 'Arc Tech' },
    companyEmail: { type: String, default: '' },
    companyPhone: { type: String, default: '' },
    companyLocation: { type: String, default: 'Islamabad, Pakistan' },
    companyDescription: { type: String, default: '' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
  },
  { timestamps: false }
);

export const Service =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export const Portfolio =
  mongoose.models.Portfolio ||
  mongoose.model<IPortfolioItem>('Portfolio', PortfolioSchema);
export const Gallery =
  mongoose.models.Gallery ||
  mongoose.model<IGalleryImage>('Gallery', GallerySchema);
export const TeamMember =
  mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const Blog =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    'ContactSubmission',
    ContactSubmissionSchema
  );
export const HiringPost =
  mongoose.models.HiringPost ||
  mongoose.model<IHiringPost>('HiringPost', HiringPostSchema);
export const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>(
    'JobApplication',
    JobApplicationSchema
  );
export const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>('Settings', SettingsSchema);
