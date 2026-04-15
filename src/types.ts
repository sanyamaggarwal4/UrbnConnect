// ── User & Auth ──────────────────────────────────────────────

export type UserRole = 'citizen' | 'authority' | 'guest';

export interface CivicScoreBreakdown {
  treesAdopted: number;
  drivesJoined: number;
  issuesReported: number;
  total: number;          // weighted: tree×5 + drive×3 + report×2
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  voterId?: string;
  constituency?: string;
  ward?: string;
  avatarUrl?: string;
  civicScore?: CivicScoreBreakdown;
}

// ── Issue Categories (PRD Section 13) ────────────────────────

export type IssueCategory =
  | 'sanitation-waste'
  | 'water-drainage'
  | 'roads-infrastructure'
  | 'streetlights-electricity'
  | 'environment-damage'
  | 'low-greenery-deforestation'
  | 'animal-human-conflict'
  | 'citizen-safety'
  | 'public-health'
  | 'illegal-encroachment'
  | 'noise-nuisance'
  | 'public-property-damage'
  | 'other';

// ── Issue Severity & Status (PRD Sections 14 & 15) ──────────

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus =
  | 'reported'
  | 'under-review'
  | 'assigned'
  | 'in-progress'
  | 'resolved'
  | 'closed'
  | 'rejected';

// ── Location ─────────────────────────────────────────────────

export interface IssueLocation {
  area: string;
  ward?: string;
  municipalZone?: string;
  constituency?: string;
  lat?: number;
  lng?: number;
}

// ── Issue ─────────────────────────────────────────────────────

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  location: IssueLocation;
  reportedBy: string;       // user id
  isAnonymous: boolean;
  imageUrl?: string;
  upvotes: number;
  upvotedBy: string[];      // user ids
  createdAt: string;        // ISO date string
  updatedAt: string;        // ISO date string
}

// ── Category metadata (for UI chips / filters) ──────────────

export interface CategoryInfo {
  id: IssueCategory;
  label: string;
  color: string;
  icon: string;             // emoji for MVP simplicity
}

// ── Area Intelligence ────────────────────────────────────────

export interface AreaRating {
  areaName: string;
  totalIssues: number;
  resolvedCount: number;
  unresolvedCount: number;
  resolutionRate: number;   // 0–100
  categoryBreakdown: Partial<Record<IssueCategory, number>>;
}

// ── App Language ─────────────────────────────────────────────

export type Language = 'en' | 'hi';

// ── Sustainability Intelligence ────────────────────────────────

export interface SustainabilityMetrics {
  areaName: string;
  totalTrees: number;
  treesNeeded: number;
  greenCoveragePct: number;    // 0-100%
  deficitZone: boolean;        // High priority for plantation if true
  plantationPriority: 'low' | 'medium' | 'high' | 'critical';
}

// ── Community Hub (PRD 2) ────────────────────────────────────

export type DriveType = 'cleanliness' | 'plantation' | 'awareness' | 'volunteering' | 'health-safety';

export interface CommunityDrive {
  id: string;
  title: string;
  description: string;
  type: DriveType;
  date: string;       // ISO or simple date string
  location: string;   // Text-based
  authorityName: string; // Posted by
  participantsCount: number;
  imageUrl?: string;
}

export type TreeType = 'neem' | 'peepal' | 'banyan' | 'mango' | 'ashoka' | 'gulmohar' | 'coconut' | 'other';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  civicScore: number;
  treesAdopted: number;
  drivesJoined: number;
  issuesReported: number;
}

// ── Civic Incentives & Community Mobilization (PRD 3) ────────

export type DriveStatus = 'proposed' | 'gathering' | 'active' | 'completed' | 'expired';

export interface CitizenDrive {
  id: string;
  issueId: string;       // The issue this drive is related to
  issueTitle: string;    // For display
  title: string;
  description: string;
  type: DriveType;
  date?: string;
  location: string;
  locality?: string;     // For merge logic: same issue + same locality = merge
  createdBy: string;     // user name
  target: number;        // participant target
  participantsCount: number;
  status: DriveStatus;
}
