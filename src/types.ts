// ── User & Auth ──────────────────────────────────────────────

export type UserRole = 'citizen' | 'authority' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  voterId?: string;
  constituency?: string;
  ward?: string;
  avatarUrl?: string;
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
