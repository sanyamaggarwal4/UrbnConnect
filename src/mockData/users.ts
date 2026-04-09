import type { User } from '../types';

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Sanyam Aggarwal',
        email: 'sanyam.aggarwal@gmail.com',
        role: 'citizen',
        voterId: 'DL/09/042/987654',
        constituency: 'Karol Bagh',
        ward: 'Ward 52',
    },
    {
        id: 'u2',
        name: 'Priya Verma',
        email: 'priya.verma@gmail.com',
        role: 'citizen',
        voterId: 'DL/09/042/654321',
        constituency: 'Rajinder Nagar',
        ward: 'Ward 50',
    },
    {
        id: 'u3',
        name: 'Rohan Gupta',
        email: 'rohan.gupta@gmail.com',
        role: 'citizen',
        voterId: 'DL/09/043/112233',
        constituency: 'Karol Bagh',
        ward: 'Ward 53',
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
