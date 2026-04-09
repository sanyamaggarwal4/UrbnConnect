import type { CommunityDrive, LeaderboardEntry, TreeType } from '../types';

export const MOCK_DRIVES: CommunityDrive[] = [
    {
        id: 'cd-001',
        title: 'Mega Tree Plantation Drive',
        description: 'Join us to plant 500 saplings across the Pusa Road corridor. Tools and saplings will be provided by the municipality.',
        type: 'plantation',
        date: 'This Sunday, 8:00 AM',
        location: 'Pusa Road, Central Zone',
        authorityName: 'NDMC Forestry Dept.',
        participantsCount: 142,
    },
    {
        id: 'cd-002',
        title: 'Ghaffar Market Cleanliness Drive',
        description: 'A community effort to clear plastic waste and promote proper waste segregation in major market areas.',
        type: 'cleanliness',
        date: 'Next Saturday, 7:00 AM',
        location: 'Ghaffar Market',
        authorityName: 'MCD Sanitation',
        participantsCount: 89,
    },
    {
        id: 'cd-003',
        title: 'Dengue Awareness Campaign',
        description: 'Door-to-door awareness campaign about preventing water stagnation to curb dengue outbreaks.',
        type: 'awareness',
        date: 'Tomorrow, 10:00 AM',
        location: 'Karol Bagh Residential Blocks',
        authorityName: 'Dept of Public Health',
        participantsCount: 34,
    },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    {
        rank: 1,
        userId: 'u-1',
        userName: 'Aarav Sharma',
        civicScore: 450,
        treesAdopted: 12,
        drivesJoined: 8,
        issuesReported: 15,
    },
    {
        rank: 2,
        userId: 'u-2',
        userName: 'Priya Patel',
        civicScore: 425,
        treesAdopted: 15,
        drivesJoined: 5,
        issuesReported: 10,
    },
    {
        rank: 3,
        userId: 'u-3',
        userName: 'Rahul Verma',
        civicScore: 380,
        treesAdopted: 8,
        drivesJoined: 10,
        issuesReported: 11,
    },
    {
        rank: 4,
        userId: 'u-4',
        userName: 'Neha Gupta',
        civicScore: 310,
        treesAdopted: 5,
        drivesJoined: 6,
        issuesReported: 9,
    },
    {
        rank: 5,
        userId: 'u-5',
        userName: 'Karan Singh',
        civicScore: 295,
        treesAdopted: 7,
        drivesJoined: 4,
        issuesReported: 7,
    },
];

export const TREE_TYPES: { id: TreeType; name: string }[] = [
    { id: 'neem', name: 'Neem' },
    { id: 'peepal', name: 'Peepal' },
    { id: 'banyan', name: 'Banyan' },
    { id: 'mango', name: 'Mango' },
    { id: 'ashoka', name: 'Ashoka' },
    { id: 'gulmohar', name: 'Gulmohar' },
    { id: 'coconut', name: 'Coconut' },
    { id: 'other', name: 'Other' },
];
