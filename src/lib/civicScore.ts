import type { CivicScoreBreakdown, CitizenDrive } from '../types';

// ── Weighted scoring constants ────────────────────────────────────────────
export const SCORE_WEIGHTS = {
    treeAdopted: 5,
    driveJoined: 3,
    issueReported: 2,
} as const;

/** Calculate total civic score from a breakdown object */
export function calculateCivicScore(breakdown: Omit<CivicScoreBreakdown, 'total'>): number {
    return (
        breakdown.treesAdopted * SCORE_WEIGHTS.treeAdopted +
        breakdown.drivesJoined * SCORE_WEIGHTS.driveJoined +
        breakdown.issuesReported * SCORE_WEIGHTS.issueReported
    );
}

/** Returns the civic rank label based on total score */
export function getCivicRankLabel(total: number): { label: string; color: string; emoji: string } {
    if (total >= 300) return { label: 'Eco Champion', color: '#15803D', emoji: '🏆' };
    if (total >= 150) return { label: 'Green Guardian', color: '#16A34A', emoji: '🌿' };
    if (total >= 75)  return { label: 'Civic Contributor', color: '#22C55E', emoji: '🌱' };
    if (total >= 30)  return { label: 'Active Citizen', color: '#4ADE80', emoji: '🌾' };
    return { label: 'Getting Started', color: '#86EFAC', emoji: '🌾' };
}

/** Determines if a user is a top contributor (score >= 300) */
export function isTopContributor(total: number): boolean {
    return total >= 300;
}

/**
 * Given a drive's current state, compute what its display status should be.
 * Mutation-free — returns the resolved status string.
 */
export function resolveDriveStatus(drive: CitizenDrive): CitizenDrive['status'] {
    if (drive.status === 'completed' || drive.status === 'expired') {
        return drive.status;
    }
    if (drive.participantsCount >= drive.target) {
        return 'active';
    }
    if (drive.participantsCount > 0) {
        return 'gathering';
    }
    return 'proposed';
}

/**
 * Merge logic: checks if an incoming drive request matches an existing one
 * (same issueId + same locality). Returns the merged drive if match found,
 * or null to indicate a new drive should be created.
 */
export function findMergeCandidate(
    existingDrives: CitizenDrive[],
    issueId: string,
    locality: string,
): CitizenDrive | null {
    return (
        existingDrives.find(
            (d) =>
                d.issueId === issueId &&
                d.locality?.toLowerCase() === locality.toLowerCase() &&
                d.status !== 'completed' &&
                d.status !== 'expired',
        ) ?? null
    );
}

/** Status display helper — returns human label + color */
export function getDriveStatusMeta(status: CitizenDrive['status']): { label: string; color: string; bg: string } {
    switch (status) {
        case 'active':    return { label: 'Active 🔥', color: '#16A34A', bg: 'rgba(22,163,74,0.12)' };
        case 'gathering': return { label: 'Gathering Support', color: '#D97706', bg: 'rgba(217,119,6,0.1)' };
        case 'completed': return { label: 'Completed ✅', color: '#2563EB', bg: 'rgba(37,99,235,0.1)' };
        case 'expired':   return { label: 'Expired', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
        default:          return { label: 'Proposed', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' };
    }
}
