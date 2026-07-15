// Mock data for the Furry Sitterz admin dashboard.
// All data is deterministic so demo screens look consistent between refreshes.

export type UserRole = "owner" | "sitter" | "admin";
export type UserStatus = "active" | "suspended" | "pending";

export interface PetOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  status: UserStatus;
  totalBookings: number;
  rating: number;
  lastActive: string;
  city: string;
  pets: string[];
}

export interface PetSitter {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  status: UserStatus;
  verified: boolean;
  services: ServiceType[];
  pricePerHour: number;
  availability: "available" | "busy" | "off";
  experienceYears: number;
  totalJobs: number;
  completedJobs: number;
  rating: number;
  lastActive: string;
  city: string;
  bio: string;
}

export type ServiceType =
  | "Dog Walking"
  | "Boarding"
  | "Grooming"
  | "House Sitting"
  | "Check-in Visits"
  | "Vet Runs";

export type BookingStatus =
  | "Pending"
  | "Accepted"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed";

export interface Booking {
  id: string;
  service: ServiceType;
  ownerId: string;
  ownerName: string;
  sitterId: string;
  sitterName: string;
  petNames: string[];
  date: string;
  time: string;
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes: string;
  timeline: { label: string; date: string }[];
}

export interface Payment {
  id: string;
  bookingId: string;
  customer: string;
  sitter: string;
  service: ServiceType;
  amount: number;
  method: "Card" | "Wallet" | "Bank Transfer" | "Apple Pay";
  date: string;
  status: PaymentStatus;
}

export interface Review {
  id: string;
  reviewer: string;
  receiver: string;
  service: ServiceType;
  rating: number;
  comment: string;
  date: string;
  hidden: boolean;
  images: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  reported: boolean;
  hidden: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  category: "Booking" | "Payment" | "Account" | "Sitter" | "Other";
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "Pending" | "Resolved" | "Closed";
  createdAt: string;
  lastReply: string;
  messages: { author: string; date: string; body: string; me?: boolean }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  audience: "All Users" | "Owners" | "Sitters";
  date: string;
  status: "Sent" | "Scheduled" | "Draft";
}

// --- deterministic helpers -------------------------------------------------

const firstNames = [
  "Bessie", "Marcus", "Ava", "Elijah", "Noah", "Sophia", "Liam", "Mia",
  "Amelia", "James", "Zoe", "Oliver", "Chloe", "Harper", "Lucas", "Isla",
  "Theo", "Nora", "Ezra", "Ivy", "Jonah", "Lena", "Ryan", "Priya",
  "Dev", "Aisha", "Mateo", "Nadia", "Kai", "Sana",
];
const lastNames = [
  "Cooper", "Patel", "Nguyen", "Rivera", "Johnson", "Kim", "Ahmed",
  "Sanchez", "Williams", "Garcia", "Brown", "Chen", "Hughes", "Novak",
  "Baker", "Silva", "Diallo", "Fischer", "Rowe", "Yamada",
];
const cities = [
  "Austin", "Denver", "Portland", "Brooklyn", "Seattle", "Chicago",
  "Boston", "Miami", "Nashville", "Atlanta", "Dallas", "San Diego",
];
const petsPool = ["Milo", "Bella", "Luna", "Charlie", "Coco", "Rocky", "Daisy", "Simba", "Nala", "Oscar", "Ziggy", "Peanut"];
const serviceTypes: ServiceType[] = [
  "Dog Walking", "Boarding", "Grooming", "House Sitting", "Check-in Visits", "Vet Runs",
];
const bookingStatuses: BookingStatus[] = [
  "Pending", "Accepted", "Confirmed", "In Progress", "Completed", "Cancelled",
];
const paymentStatuses: PaymentStatus[] = ["Paid", "Pending", "Refunded", "Failed"];

// Simple seeded pseudo-random so lists stay stable across renders.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick<T>(arr: readonly T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

function isoDate(daysAgo: number, r: () => number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(Math.floor(r() * 24), Math.floor(r() * 60), 0, 0);
  return d.toISOString();
}

function avatarFor(name: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=fde7d1,f6d5ba,e8c3a3,f9e4c8`;
}

// --- generators ------------------------------------------------------------

export const petOwners: PetOwner[] = Array.from({ length: 42 }, (_, i) => {
  const r = seeded(i + 1);
  const name = `${pick(firstNames, r)} ${pick(lastNames, r)}`;
  return {
    id: `OWN-${1000 + i}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@mail.com`,
    phone: `+1 (555) ${String(Math.floor(r() * 900) + 100)}-${String(Math.floor(r() * 9000) + 1000)}`,
    avatar: avatarFor(name),
    joinDate: isoDate(Math.floor(r() * 500), r),
    status: r() < 0.85 ? "active" : r() < 0.5 ? "pending" : "suspended",
    totalBookings: Math.floor(r() * 40),
    rating: Number((3.5 + r() * 1.5).toFixed(1)),
    lastActive: isoDate(Math.floor(r() * 30), r),
    city: pick(cities, r),
    pets: Array.from({ length: 1 + Math.floor(r() * 3) }, () => pick(petsPool, r)),
  };
});

export const petSitters: PetSitter[] = Array.from({ length: 32 }, (_, i) => {
  const r = seeded(i + 500);
  const name = `${pick(firstNames, r)} ${pick(lastNames, r)}`;
  const services = Array.from(new Set(Array.from({ length: 1 + Math.floor(r() * 4) }, () => pick(serviceTypes, r))));
  const totalJobs = 20 + Math.floor(r() * 260);
  return {
    id: `SIT-${2000 + i}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@sitter.pet`,
    phone: `+1 (555) ${String(Math.floor(r() * 900) + 100)}-${String(Math.floor(r() * 9000) + 1000)}`,
    avatar: avatarFor(name + "sitter"),
    joinDate: isoDate(Math.floor(r() * 800), r),
    status: r() < 0.85 ? "active" : r() < 0.5 ? "pending" : "suspended",
    verified: r() > 0.25,
    services,
    pricePerHour: 15 + Math.floor(r() * 40),
    availability: r() < 0.6 ? "available" : r() < 0.5 ? "busy" : "off",
    experienceYears: 1 + Math.floor(r() * 10),
    totalJobs,
    completedJobs: totalJobs - Math.floor(r() * 6),
    rating: Number((4 + r()).toFixed(1)),
    lastActive: isoDate(Math.floor(r() * 14), r),
    city: pick(cities, r),
    bio: "Loves animals and has years of experience with dogs, cats, and small pets. Available for weekend bookings and vet runs.",
  };
});

export const bookings: Booking[] = Array.from({ length: 68 }, (_, i) => {
  const r = seeded(i + 900);
  const owner = petOwners[Math.floor(r() * petOwners.length)];
  const sitter = petSitters[Math.floor(r() * petSitters.length)];
  const service = pick(serviceTypes, r);
  const status = pick(bookingStatuses, r);
  const amount = 25 + Math.floor(r() * 220);
  const daysAgo = Math.floor(r() * 60) - 15;
  const date = isoDate(daysAgo, r);
  return {
    id: `BK-${10000 + i}`,
    service,
    ownerId: owner.id,
    ownerName: owner.name,
    sitterId: sitter.id,
    sitterName: sitter.name,
    petNames: Array.from({ length: 1 + Math.floor(r() * 2) }, () => pick(petsPool, r)),
    date,
    time: `${String(8 + Math.floor(r() * 10)).padStart(2, "0")}:${r() < 0.5 ? "00" : "30"}`,
    amount,
    status,
    paymentStatus:
      status === "Cancelled" ? "Refunded" :
      status === "Completed" ? "Paid" :
      pick(paymentStatuses, r),
    notes: "Please ensure fresh water and evening walk before pickup.",
    timeline: [
      { label: "Booking created", date: isoDate(daysAgo + 4, r) },
      { label: "Sitter accepted", date: isoDate(Math.max(0, daysAgo + 3), r) },
      { label: "Payment received", date: isoDate(Math.max(0, daysAgo + 2), r) },
      { label: "Service scheduled", date: date },
    ],
  };
});

export const payments: Payment[] = bookings.map((b, i) => {
  const r = seeded(i + 1500);
  return {
    id: `TXN-${30000 + i}`,
    bookingId: b.id,
    customer: b.ownerName,
    sitter: b.sitterName,
    service: b.service,
    amount: b.amount,
    method: pick(["Card", "Wallet", "Bank Transfer", "Apple Pay"] as const, r),
    date: b.date,
    status: b.paymentStatus,
  };
});

const reviewComments = [
  "Absolutely wonderful with our dog. Sent updates and pictures throughout the day!",
  "Very professional and prompt. Highly recommend for boarding.",
  "Good service but arrived 15 minutes late. Otherwise great.",
  "Our cat was so relaxed when we got home. Amazing sitter.",
  "Communication could improve, but the walks were thorough.",
  "Best grooming experience we've had — Milo looks fantastic.",
];

export const reviews: Review[] = Array.from({ length: 48 }, (_, i) => {
  const r = seeded(i + 2000);
  const owner = petOwners[Math.floor(r() * petOwners.length)];
  const sitter = petSitters[Math.floor(r() * petSitters.length)];
  return {
    id: `RV-${5000 + i}`,
    reviewer: owner.name,
    receiver: sitter.name,
    service: pick(serviceTypes, r),
    rating: 3 + Math.floor(r() * 3),
    comment: pick(reviewComments, r),
    date: isoDate(Math.floor(r() * 90), r),
    hidden: r() < 0.08,
    images: Math.floor(r() * 3),
  };
});

const postTitles = [
  "Best treats for anxious dogs?",
  "Weekend meetup at Riverside Park!",
  "Vet recommendation for senior cats",
  "DIY grooming tips for double-coat breeds",
  "Traveling with pets — cross-country tips",
  "How to socialize a rescue puppy",
  "Feeding schedule for kittens",
];

export const communityPosts: CommunityPost[] = Array.from({ length: 24 }, (_, i) => {
  const r = seeded(i + 3000);
  const author = `${pick(firstNames, r)} ${pick(lastNames, r)}`;
  return {
    id: `POST-${7000 + i}`,
    author,
    avatar: avatarFor(author + "post"),
    title: pick(postTitles, r),
    content: "Sharing my experience with the community — would love to hear your thoughts and tips!",
    date: isoDate(Math.floor(r() * 45), r),
    likes: Math.floor(r() * 180),
    comments: Math.floor(r() * 40),
    reported: r() < 0.15,
    hidden: r() < 0.06,
  };
});

const ticketSubjects = [
  "Refund not received",
  "Sitter cancelled last minute",
  "Cannot update payment method",
  "App crashes when booking",
  "Question about verification",
  "Rating dispute",
];

export const supportTickets: SupportTicket[] = Array.from({ length: 20 }, (_, i) => {
  const r = seeded(i + 4000);
  const customer = `${pick(firstNames, r)} ${pick(lastNames, r)}`;
  return {
    id: `TCK-${6000 + i}`,
    subject: pick(ticketSubjects, r),
    customer,
    category: pick(["Booking", "Payment", "Account", "Sitter", "Other"] as const, r),
    priority: pick(["Low", "Medium", "High", "Urgent"] as const, r),
    status: pick(["Open", "Pending", "Resolved", "Closed"] as const, r),
    createdAt: isoDate(Math.floor(r() * 30), r),
    lastReply: isoDate(Math.floor(r() * 5), r),
    messages: [
      { author: customer, date: isoDate(3, r), body: "Hi team, I need help with my recent booking. Can someone look into this?" },
      { author: "Support", date: isoDate(2, r), body: "Thanks for reaching out! We're checking your account and will get back shortly.", me: true },
      { author: customer, date: isoDate(1, r), body: "Appreciate it — waiting on your update." },
    ],
  };
});

export const notifications: Notification[] = [
  { id: "N-1", title: "Holiday bookings surge", message: "Increased demand expected next weekend.", audience: "Sitters", date: isoDate(1, seeded(11)), status: "Sent" },
  { id: "N-2", title: "New safety guidelines", message: "Please review the updated pet handling guidelines.", audience: "All Users", date: isoDate(4, seeded(12)), status: "Sent" },
  { id: "N-3", title: "Refer & earn bonus doubled", message: "Invite friends to earn $20 credits.", audience: "Owners", date: isoDate(7, seeded(13)), status: "Sent" },
  { id: "N-4", title: "Scheduled maintenance", message: "Platform maintenance Sunday 2AM UTC.", audience: "All Users", date: isoDate(-2, seeded(14)), status: "Scheduled" },
];

// --- dashboard aggregates --------------------------------------------------

export function dashboardStats() {
  const totalUsers = petOwners.length + petSitters.length;
  const activeUsers = [...petOwners, ...petSitters].filter((u) => u.status === "active").length;
  const todayISO = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter((b) => b.date.startsWith(todayISO)).length;
  const revenue = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const avgRating =
    reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length);

  return {
    totalUsers,
    totalOwners: petOwners.length,
    totalSitters: petSitters.length,
    activeUsers,
    totalBookings: bookings.length,
    todaysBookings,
    pending: bookings.filter((b) => b.status === "Pending").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
    cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    monthlyRevenue: Math.round(revenue * 0.32),
    totalRevenue: revenue,
    avgRating: Number(avgRating.toFixed(2)),
  };
}

export function revenueSeries() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const r = seeded(77);
  return months.map((m) => ({
    month: m,
    revenue: Math.floor(6000 + r() * 12000),
    bookings: Math.floor(40 + r() * 120),
  }));
}

export function servicePopularity() {
  const counts = new Map<ServiceType, number>();
  serviceTypes.forEach((s) => counts.set(s, 0));
  bookings.forEach((b) => counts.set(b.service, (counts.get(b.service) ?? 0) + 1));
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export function bookingStatusBreakdown() {
  const counts = new Map<BookingStatus, number>();
  bookingStatuses.forEach((s) => counts.set(s, 0));
  bookings.forEach((b) => counts.set(b.status, (counts.get(b.status) ?? 0) + 1));
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export function userGrowth() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const r = seeded(200);
  let owners = 40;
  let sitters = 20;
  return months.map((m) => {
    owners += Math.floor(r() * 30) + 5;
    sitters += Math.floor(r() * 20) + 2;
    return { month: m, owners, sitters };
  });
}

export function topSitters(limit = 5) {
  return [...petSitters].sort((a, b) => b.completedJobs - a.completedJobs).slice(0, limit);
}

export function recentBookings(limit = 5) {
  return [...bookings].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function recentReviews(limit = 4) {
  return [...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function recentRegistrations(limit = 5) {
  return [...petOwners, ...petSitters]
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      role: (u.id.startsWith("SIT") ? "sitter" : "owner") as UserRole,
      joinDate: u.joinDate,
    }))
    .sort((a, b) => b.joinDate.localeCompare(a.joinDate))
    .slice(0, limit);
}

export const cmsPages = [
  { slug: "privacy-policy", title: "Privacy Policy", updatedAt: isoDate(9, seeded(60)), body: "Furry Sitterz respects your privacy. This policy describes what information we collect and how it's used across our platform..." },
  { slug: "terms-conditions", title: "Terms & Conditions", updatedAt: isoDate(14, seeded(61)), body: "By using Furry Sitterz you agree to the following terms of service which govern bookings, payments, and community behavior..." },
  { slug: "about-us", title: "About Us", updatedAt: isoDate(30, seeded(62)), body: "We're a passionate team of pet lovers building trusted connections between pet parents and expert sitters." },
  { slug: "faqs", title: "FAQs", updatedAt: isoDate(3, seeded(63)), body: "Common questions about bookings, payments, insurance and how sitter verification works." },
  { slug: "contact", title: "Contact Information", updatedAt: isoDate(1, seeded(64)), body: "Support: help@furrysitterz.com — Phone: +1 (555) 010-1288 — Hours: 24/7." },
];

export { serviceTypes, bookingStatuses, paymentStatuses };
