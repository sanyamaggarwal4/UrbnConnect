import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
    type ReactNode,
} from 'react';
import type { User, Issue, IssueStatus, Language, UserRole } from '../types';
import { MOCK_USERS, MOCK_ISSUES } from '../mockData';
import { supabase } from '../lib/supabase';
import type { IssueRow } from '../lib/supabase';

export type Theme = 'light' | 'dark';

// ── Env check ────────────────────────────────────────────────
const HAS_SUPABASE =
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co';

// ── DB ↔ Domain mappers ──────────────────────────────────────

function rowToIssue(row: IssueRow): Issue {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category as Issue['category'],
        severity: row.severity as Issue['severity'],
        status: row.status as Issue['status'],
        location: {
            area: row.area,
            ward: row.ward,
            municipalZone: row.municipal_zone,
            constituency: row.constituency,
        },
        reportedBy: row.reported_by ?? 'unknown',
        isAnonymous: row.is_anonymous,
        imageUrl: row.image_url,
        upvotes: row.upvotes,
        upvotedBy: row.upvoted_by ?? [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function issueToRow(
    issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'upvotedBy'>,
    id: string,
    now: string,
): IssueRow {
    return {
        id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        severity: issue.severity,
        status: issue.status,
        area: issue.location.area,
        ward: issue.location.ward,
        municipal_zone: issue.location.municipalZone,
        constituency: issue.location.constituency,
        reported_by: issue.reportedBy,
        is_anonymous: issue.isAnonymous,
        image_url: issue.imageUrl,
        upvotes: 0,
        upvoted_by: [],
        created_at: now,
        updated_at: now,
    };
}

// ── Context shape ────────────────────────────────────────────

interface AppState {
    // Auth
    currentUser: User | null;
    login: (email: string, role?: UserRole) => void;
    loginAsGuest: (role: UserRole) => void;
    logout: () => void;
    setRole: (role: UserRole) => void;

    // Issues
    issues: Issue[];
    issuesLoading: boolean;
    addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'upvotedBy'>) => Promise<void>;
    updateIssueStatus: (issueId: string, status: IssueStatus) => Promise<void>;
    upvoteIssue: (issueId: string) => Promise<void>;

    // Language & Theme
    language: Language;
    setLanguage: (lang: Language) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedGuestRole = localStorage.getItem('cv-guest') as UserRole | null;
        if (savedGuestRole) {
            return {
                id: 'guest',
                name: 'Guest User',
                email: 'guest@cityvaani.app',
                role: savedGuestRole,
            };
        }
        return null;
    });
    const currentUserRef = useRef<User | null>(currentUser);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [issuesLoading, setIssuesLoading] = useState(true);

    // Keep ref in sync — allows useCallback closures to read latest currentUser
    useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);
    const [language, setLanguage] = useState<Language>('en');

    // Theme state
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem('cv-theme') as Theme) || 'light'
    );

    useEffect(() => {
        localStorage.setItem('cv-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    /* ── Seed + fetch issues on mount ──────────────────────── */

    useEffect(() => {
        async function loadIssues() {
            try {
                if (!HAS_SUPABASE) {
                    setIssues([...MOCK_ISSUES]);
                    setIssuesLoading(false);
                    return;
                }

                setIssuesLoading(true);

                // 1. Try to fetch from Supabase
                const { data, error } = await supabase
                    .from('cv_issues')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('[UrbnConnect] Supabase fetch error:', error.message);
                    setIssues([...MOCK_ISSUES]);
                    setIssuesLoading(false);
                    return;
                }

                // 2. If DB is empty, seed with mock data
                if (!data || data.length === 0) {
                    // Only seed if NOT a guest, don't spam their DB on public visits
                    if (currentUserRef.current?.id && currentUserRef.current?.id !== 'guest') {
                        console.info('[UrbnConnect] Seeding Supabase with mock issues…');
                        const rows: IssueRow[] = MOCK_ISSUES.map((issue) => ({
                            id: issue.id,
                            title: issue.title,
                            description: issue.description,
                            category: issue.category,
                            severity: issue.severity,
                            status: issue.status,
                            area: issue.location.area,
                            ward: issue.location.ward,
                            municipal_zone: issue.location.municipalZone,
                            constituency: issue.location.constituency,
                            reported_by: issue.reportedBy,
                            is_anonymous: issue.isAnonymous,
                            image_url: issue.imageUrl,
                            upvotes: issue.upvotes,
                            upvoted_by: issue.upvotedBy,
                            created_at: issue.createdAt,
                            updated_at: issue.updatedAt,
                        }));

                        const { error: seedErr } = await supabase.from('cv_issues').insert(rows);
                        if (seedErr) {
                            console.error('[UrbnConnect] Seed error:', seedErr.message);
                        }
                    }
                    setIssues([...MOCK_ISSUES]);
                } else {
                    setIssues(data.map(rowToIssue));
                }

                setIssuesLoading(false);
            } catch (err: any) {
                console.error('[UrbnConnect] Critical load issues error:', err);
                alert('[UrbnConnect Debug] loadIssues Crashed: ' + err.message);
                setIssues([...MOCK_ISSUES]);
                setIssuesLoading(false);
            }
        }

        void loadIssues();
    }, []);

    /* ── Supabase Auth Listener ────────────────────────────── */
    useEffect(() => {
        if (!HAS_SUPABASE) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                // We have a user! Extract info.
                const email = session.user.email || '';
                const name = session.user.user_metadata?.full_name || email.split('@')[0];
                const avatar_url = session.user.user_metadata?.avatar_url;

                // Sync with cv_users database table to persist and load role
                let userRole: UserRole = (session.user.user_metadata?.role as UserRole) || 'citizen';
                const { data: existingUser } = await supabase.from('cv_users').select('*').eq('email', email).single();

                if (!existingUser) {
                    const newId = `user-${Date.now()}`;
                    await supabase.from('cv_users').insert({
                        id: newId,
                        name,
                        email,
                        role: userRole,
                        avatar_url
                    });
                    setCurrentUser({ id: newId, name, email, role: userRole, avatar_url } as User);
                } else {
                    userRole = existingUser.role as UserRole;
                    setCurrentUser({ id: existingUser.id, name: existingUser.name, email: existingUser.email, role: userRole, avatar_url } as User);
                }
            } else {
                // Signed out
                const savedGuestRole = localStorage.getItem('cv-guest') as UserRole | null;
                if (savedGuestRole) {
                    if (currentUserRef.current?.id !== 'guest') {
                        setCurrentUser({
                            id: 'guest',
                            name: 'Guest User',
                            email: 'guest@cityvaani.app',
                            role: savedGuestRole,
                        });
                    }
                } else {
                    if (currentUserRef.current?.id !== 'guest') {
                        setCurrentUser(null);
                    }
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    /* ── Auth helpers ──────────────────────────────────────── */

    const login = useCallback(async (email: string, role?: UserRole) => {
        localStorage.removeItem('cv-guest');
        // Find or create user
        const found = MOCK_USERS.find((u) => u.email === email);
        const user: User = found
            ? { ...found, role: role ?? found.role }
            : {
                id: `user-${Date.now()}`,
                name: email.split('@')[0],
                email,
                role: role ?? 'citizen',
            };

        setCurrentUser(user);

        // Persist to Supabase
        if (HAS_SUPABASE) {
            const { error } = await supabase.from('cv_users').upsert(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                { onConflict: 'email' },
            );
            if (error) console.error('[UrbnConnect] User upsert error:', error.message);
        }
    }, []);

    const loginAsGuest = useCallback((role: UserRole) => {
        localStorage.setItem('cv-guest', role);
        setCurrentUser({
            id: 'guest',
            name: 'Guest User',
            email: 'guest@cityvaani.app',
            role,
        });
    }, []);

    const logout = useCallback(async () => {
        localStorage.removeItem('cv-guest');
        setCurrentUser(null);
        if (HAS_SUPABASE) {
            try {
                await supabase.auth.signOut();
            } catch (e) {
                console.warn('[UrbnConnect] Silent Supabase logout failed:', e);
            }
        }
    }, []);

    const setRole = useCallback((role: UserRole) => {
        setCurrentUser((prev) => (prev ? { ...prev, role } : prev));
    }, []);

    /* ── Issue helpers ─────────────────────────────────────── */

    const addIssue = useCallback(
        async (draft: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'upvotedBy'>) => {
            const now = new Date().toISOString();
            const id = `i-${Date.now()}`;

            let geocodeLat = draft.location.lat;
            let geocodeLng = draft.location.lng;

            if (!geocodeLat || !geocodeLng) {
                try {
                    const query = encodeURIComponent(`${draft.location.area}, Delhi, India`);
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
                    const data = await res.json();
                    if (data && data.length > 0) {
                        geocodeLat = parseFloat(data[0].lat);
                        geocodeLng = parseFloat(data[0].lon);
                    }
                } catch (e) {
                    console.warn('[UrbnConnect] Geocoding failed:', e);
                }
            }

            const newIssue: Issue = {
                ...draft,
                location: {
                    ...draft.location,
                    lat: geocodeLat,
                    lng: geocodeLng
                },
                id,
                upvotes: 0,
                upvotedBy: [],
                createdAt: now,
                updatedAt: now,
            };

            // Optimistic update
            setIssues((prev) => [newIssue, ...prev]);

            if (HAS_SUPABASE) {
                const row = issueToRow(draft, id, now);
                const { error } = await supabase.from('cv_issues').insert(row);
                if (error) {
                    console.error('[UrbnConnect] addIssue error:', error.message);
                    alert('Supabase Error (addIssue): ' + error.message);
                    // Rollback
                    setIssues((prev) => prev.filter((i) => i.id !== id));
                }
            }
        },
        [],
    );

    const updateIssueStatus = useCallback(async (issueId: string, status: IssueStatus) => {
        const now = new Date().toISOString();

        // Optimistic update
        setIssues((prev) =>
            prev.map((issue) =>
                issue.id === issueId ? { ...issue, status, updatedAt: now } : issue,
            ),
        );

        if (HAS_SUPABASE) {
            const { error } = await supabase
                .from('cv_issues')
                .update({ status, updated_at: now })
                .eq('id', issueId);
            if (error) {
                console.error('[UrbnConnect] updateStatus error:', error.message);
                alert('Supabase Error (updateStatus): ' + error.message);
            }
        }
    }, []);

    const upvoteIssue = useCallback(async (issueId: string) => {
        // One vote per user per issue
        const voterId = currentUserRef.current?.id ?? 'guest';
        let newUpvotes = 0;
        let newUpvotedBy: string[] = [];
        let alreadyVoted = false;

        setIssues((prev) =>
            prev.map((issue) => {
                if (issue.id !== issueId) return issue;
                if (issue.upvotedBy.includes(voterId)) {
                    alreadyVoted = true;
                    return issue; // No change — already voted
                }
                newUpvotes = issue.upvotes + 1;
                newUpvotedBy = [...issue.upvotedBy, voterId];
                return { ...issue, upvotes: newUpvotes, upvotedBy: newUpvotedBy, updatedAt: new Date().toISOString() };
            }),
        );

        if (HAS_SUPABASE && !alreadyVoted) {
            const { error } = await supabase
                .from('cv_issues')
                .update({ upvotes: newUpvotes, upvoted_by: newUpvotedBy, updated_at: new Date().toISOString() })
                .eq('id', issueId);
            if (error) {
                console.error('[UrbnConnect] upvote error:', error.message);
                alert('Supabase Error (upvote): ' + error.message);
            }
        }
    }, []);

    /* ── Provide value ─────────────────────────────────────── */

    return (
        <AppContext.Provider
            value={{
                currentUser,
                login,
                loginAsGuest,
                logout,
                setRole,
                issues,
                issuesLoading,
                addIssue,
                updateIssueStatus,
                upvoteIssue,
                language,
                setLanguage,
                theme,
                setTheme,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

// ── Hook ─────────────────────────────────────────────────────

export function useAppContext(): AppState {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error('useAppContext must be used inside <AppProvider>');
    }
    return ctx;
}
