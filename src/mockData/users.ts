import type { User } from '../types';

// Weighted formula: treesAdopted×5 + drivesJoined×3 + issuesReported×2
export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Sanyam Aggarwal',
        email: 'sanyam.aggarwal@gmail.com',
        role: 'citizen',
        voterId: 'DL/09/042/987654',
        constituency: 'Karol Bagh',
        ward: 'Ward 52',
        civicScore: {
            treesAdopted: 3,
            drivesJoined: 4,
            issuesReported: 7,
            total: 3 * 5 + 4 * 3 + 7 * 2,   // 15+12+14 = 41
        },
    },
    {
        id: 'u2',
        name: 'Priya Verma',
        email: 'priya.verma@gmail.com',
        role: 'citizen',
        voterId: 'DL/09/042/654321',
        constituency: 'Rajinder Nagar',
        ward: 'Ward 50',
        civicScore: {
            treesAdopted: 8,
            drivesJoined: 6,
            issuesReported: 12,
            total: 8 * 5 + 6 * 3 + 12 * 2,  // 40+18+24 = 82
        },
    },
    {
        id: 'u3',
        name: 'Rohan Gupta',
        email: 'rohan.gupta@gmail.com',
        role: 'citizen',
        voterId: 'DL/09/043/112233',
        constituency: 'Karol Bagh',
        ward: 'Ward 53',
        civicScore: {
            treesAdopted: 1,
            drivesJoined: 2,
            issuesReported: 5,
            total: 1 * 5 + 2 * 3 + 5 * 2,   // 5+6+10 = 21
        },
    },
    {
        id: 'u4',
        name: 'Sunita Mehra',
        email: 'sunita.mehra@mcd.gov.in',
        role: 'authority',
        constituency: 'Karol Bagh',
        ward: 'Ward 52',
    },
    {
        id: 'u5',
        name: 'Rajesh Kumar Singh',
        email: 'rajesh.singh@mcd.gov.in',
        role: 'authority',
        constituency: 'Rajinder Nagar',
        ward: 'Ward 50',
    },
];
