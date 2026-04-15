import { useState, useEffect } from 'react';
import { useT } from '../i18n/translations';
import { MOCK_DRIVES, MOCK_LEADERBOARD, TREE_TYPES, MOCK_CITIZEN_DRIVES } from '../mockData';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import DriveCard from '../components/ui/DriveCard';
import TopContributorBadge from '../components/ui/TopContributorBadge';
import type { TreeType, CommunityDrive } from '../types';

type Tab = 'feed' | 'citizen-drives' | 'adopt' | 'leaderboard';

interface AdoptedTree {
    id: string;
    typeId: TreeType;
    nickname: string;
    location: string;
    occasion: string;
    date: string;
}

const RANK_MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function CommunityHubPage() {
    const t = useT();
    const { currentUser } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('feed');
    const [joinedDrives, setJoinedDrives] = useState<Set<string>>(new Set());

    const [selectedTree, setSelectedTree] = useState<TreeType | null>(null);
    const [adoptionSuccess, setAdoptionSuccess] = useState(false);
    const [adoptedTrees, setAdoptedTrees] = useState<AdoptedTree[]>([]);
    const [treeForm, setTreeForm] = useState({ nickname: '', location: '', occasion: '' });

    const [drives, setDrives] = useState<CommunityDrive[]>([]);

    useEffect(() => {
        const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co';
        if (!hasSupabase) {
            setDrives(MOCK_DRIVES);
            return;
        }

        async function fetchData() {
            try {
                const { data: driveData, error: driveErr } = await supabase.from('cv_community_drives').select('*').order('created_at', { ascending: false });
                if (driveErr) console.error('[CommunityHub] fetch drives error:', driveErr);
                if (driveData && driveData.length > 0) {
                    setDrives(driveData.map((d: any) => ({
                        id: d.id, title: d.title, description: d.description,
                        type: d.drive_type as any, date: d.drive_date, location: d.location,
                        authorityName: d.authority_name, participantsCount: d.participants_count || 0, imageUrl: d.image_url
                    })));
                } else {
                    setDrives(MOCK_DRIVES);
                }
                if (currentUser?.id && currentUser.id !== 'guest') {
                    const { data: treeData, error: treeErr } = await supabase.from('cv_adopted_trees').select('*').eq('adopted_by', currentUser.id).order('created_at', { ascending: false });
                    if (treeErr) console.error('[CommunityHub] fetch trees error:', treeErr);
                    if (treeData) {
                        setAdoptedTrees(treeData.map((t: any) => ({
                            id: t.id, typeId: t.type_id as any, nickname: t.nickname,
                            location: t.location, occasion: t.occasion,
                            date: new Date(t.created_at).toLocaleDateString()
                        })));
                    }
                }
            } catch (err) {
                console.error('[CommunityHub] Critical query error:', err);
                setDrives(MOCK_DRIVES);
            }
        }
        fetchData();
    }, [currentUser]);

    const handleJoinDrive = (driveId: string) => {
        setJoinedDrives(prev => { const next = new Set(prev); next.add(driveId); return next; });
    };

    const handleAdoptTree = async () => {
        if (!selectedTree) return;
        const newTree: AdoptedTree = {
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
            typeId: selectedTree, nickname: treeForm.nickname, location: treeForm.location,
            occasion: treeForm.occasion, date: new Date().toLocaleDateString()
        };
        setAdoptedTrees(prev => [newTree, ...prev]);
        const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co';
        if (hasSupabase && currentUser?.id && currentUser.id !== 'guest') {
            const { error } = await supabase.from('cv_adopted_trees').insert({
                id: newTree.id, type_id: newTree.typeId, nickname: newTree.nickname,
                location: newTree.location, occasion: newTree.occasion, adopted_by: currentUser.id
            });
            if (error) {
                console.error("Adopt tree error:", error);
                alert("Failed to adopt tree: " + error.message);
                setAdoptedTrees(prev => prev.filter(t => t.id !== newTree.id));
                return;
            }
        }
        setAdoptionSuccess(true);
        setTimeout(() => { setAdoptionSuccess(false); setSelectedTree(null); setTreeForm({ nickname: '', location: '', occasion: '' }); }, 3000);
    };

    const TABS = [
        { id: 'feed' as Tab, label: '🏛️ Authority Drives' },
        { id: 'citizen-drives' as Tab, label: '🌿 Citizen Drives' },
        { id: 'adopt' as Tab, label: t.adoptATree },
        { id: 'leaderboard' as Tab, label: t.leaderboard },
    ];

    return (
        <div className="cv-animate-fadeIn cv-eco-page cv-eco-bg-pattern" style={{ maxWidth: 860, margin: '0 auto', paddingBottom: '2rem' }}>
            {/* Page header with eco styling */}
            <div style={{
                background: 'var(--cv-eco-gradient)',
                borderRadius: 'var(--cv-radius-lg)',
                padding: '1.75rem 2rem',
                marginBottom: '1.75rem',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '8rem', opacity: 0.06, userSelect: 'none' }}>🌿</div>
                <h1 style={{ margin: '0 0 .35rem', color: '#fff', fontSize: '1.65rem' }}>
                    {t.communityHubTitle}
                </h1>
                <p style={{ margin: 0, opacity: 0.85, fontSize: '.95rem' }}>{t.communityHubDesc}</p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--cv-border)',
                marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '.5rem',
            }}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: activeTab === tab.id ? 'var(--cv-eco-green-muted)' : 'none',
                            border: activeTab === tab.id ? '1px solid rgba(22,163,74,0.3)' : '1px solid transparent',
                            padding: '.45rem .9rem',
                            fontSize: '.88rem',
                            fontWeight: activeTab === tab.id ? 700 : 400,
                            color: activeTab === tab.id ? 'var(--cv-eco-green)' : 'var(--cv-text-secondary)',
                            borderRadius: 'var(--cv-radius)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all .2s',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── AUTHORITY DRIVES FEED ── */}
            {activeTab === 'feed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {drives.length === 0 ? (
                        <div className="cv-leaf-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'cv-leafSway 4s infinite' }}>🍃</div>
                            <h3 style={{ color: 'var(--cv-eco-green)' }}>No active drives yet</h3>
                            <p style={{ color: 'var(--cv-text-muted)' }}>Check back later or ask an Authority to start a new drive!</p>
                        </div>
                    ) : (
                        drives.map((drive: CommunityDrive) => (
                            <div key={drive.id} className="cv-eco-feed-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 .3rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                            <span className="cv-eco-pulse" /> {drive.title}
                                        </h3>
                                        <span style={{ fontSize: '.8rem', color: 'var(--cv-text-muted)', display: 'block', marginBottom: '.8rem' }}>
                                            By {drive.authorityName} • {drive.date}
                                        </span>
                                    </div>
                                    <span className="cv-chip" style={{ background: 'var(--cv-bg-mute)', fontSize: '.75rem' }}>
                                        {t[drive.type as keyof typeof t] || drive.type}
                                    </span>
                                </div>
                                <p style={{ fontSize: '.9rem', color: 'var(--cv-text-secondary)', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                                    {drive.description}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--cv-border)' }}>
                                    <div style={{ fontSize: '.85rem', color: 'var(--cv-text-secondary)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                        <span>📍 {drive.location}</span>
                                        <span>•</span>
                                        <span>👥 {drive.participantsCount + (joinedDrives.has(drive.id) ? 1 : 0)} joined</span>
                                    </div>
                                    <button
                                        className={`cv-btn ${joinedDrives.has(drive.id) ? 'cv-btn-secondary' : 'cv-btn-primary'}`}
                                        onClick={() => handleJoinDrive(drive.id)}
                                        disabled={joinedDrives.has(drive.id)}
                                    >
                                        {joinedDrives.has(drive.id) ? `✅ ${t.joinedDrive}` : t.joinDrive}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── CITIZEN DRIVES TAB ── */}
            {activeTab === 'citizen-drives' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Header with info */}
                    <div style={{
                        padding: '.9rem 1.25rem',
                        background: 'var(--cv-eco-green-muted)',
                        border: '1px solid rgba(22,163,74,0.2)',
                        borderRadius: 'var(--cv-radius)',
                        fontSize: '.875rem',
                        color: 'var(--cv-eco-green)',
                        display: 'flex', alignItems: 'center', gap: '.75rem',
                    }}>
                        <span style={{ fontSize: '1.3rem' }}>🌿</span>
                        <span>
                            Citizen-initiated drives are community-led actions started directly from reported issues.
                            They become <strong>Active</strong> once their participant target is reached.
                        </span>
                    </div>

                    {/* Status filter row */}
                    {(['all', 'active', 'gathering', 'proposed', 'completed', 'expired'] as const).map(status => {
                        const count = status === 'all'
                            ? MOCK_CITIZEN_DRIVES.length
                            : MOCK_CITIZEN_DRIVES.filter(d => d.status === status).length;
                        return count > 0 ? null : null; // only here to satisfy lint — rendered below
                    })}

                    {MOCK_CITIZEN_DRIVES.map(drive => (
                        <DriveCard
                            key={drive.id}
                            drive={drive}
                            onJoin={handleJoinDrive}
                            isJoined={joinedDrives.has(drive.id)}
                        />
                    ))}
                </div>
            )}

            {/* ── ADOPT A TREE TAB ── */}
            {activeTab === 'adopt' && (
                <div className="cv-leaf-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'cv-leafSway 3s ease-in-out infinite' }}>🌳</div>
                    <h2 style={{ marginBottom: '.5rem', color: 'var(--cv-eco-green)' }}>{t.adoptATree}</h2>
                    <p style={{ color: 'var(--cv-text-secondary)', marginBottom: '2rem' }}>{t.adoptTreeDesc}</p>

                    {adoptionSuccess ? (
                        <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '8px', fontWeight: 600 }}>
                            {t.treeAdoptionSuccess}
                        </div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); handleAdoptTree(); }} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="cv-input-group">
                                <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: 500 }}>{t.treeType} <span style={{ color: 'red' }}>*</span></label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem' }}>
                                    {TREE_TYPES.map(tree => (
                                        <div
                                            key={tree.id}
                                            onClick={() => setSelectedTree(tree.id)}
                                            style={{
                                                padding: '.5rem 1rem', borderRadius: '8px',
                                                border: `2px solid ${selectedTree === tree.id ? 'var(--cv-eco-green)' : 'var(--cv-border)'}`,
                                                background: selectedTree === tree.id ? 'var(--cv-eco-green-muted)' : 'var(--cv-bg)',
                                                color: selectedTree === tree.id ? 'var(--cv-eco-green)' : 'var(--cv-text)',
                                                cursor: 'pointer', fontWeight: 500, fontSize: '.85rem', transition: 'all 0.2s'
                                            }}
                                        >
                                            {tree.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="cv-grid cv-grid-2">
                                <div className="cv-input-group">
                                    <label>{t.treeNickname}</label>
                                    <input type="text" className="cv-input" placeholder="e.g. Green Guardian" value={treeForm.nickname} onChange={e => setTreeForm({ ...treeForm, nickname: e.target.value })} />
                                </div>
                                <div className="cv-input-group">
                                    <label>{t.plantationLocation} <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" className="cv-input" required placeholder="e.g. Rohini Sector 11 Park" value={treeForm.location} onChange={e => setTreeForm({ ...treeForm, location: e.target.value })} />
                                </div>
                            </div>

                            <div className="cv-input-group">
                                <label>{t.treeOccasion || 'Occasion'}</label>
                                <input type="text" className="cv-input" placeholder={t.treeOccasionPlaceholder || "e.g. My son's 5th birthday"} value={treeForm.occasion} onChange={e => setTreeForm({ ...treeForm, occasion: e.target.value })} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                <input type="checkbox" id="pledge" required style={{ width: '1.2rem', height: '1.2rem' }} />
                                <label htmlFor="pledge" style={{ margin: 0, color: 'var(--cv-text)' }}>{t.carePledge}</label>
                            </div>

                            <button type="submit" className="cv-btn cv-btn-lg" disabled={!selectedTree}
                                style={{ width: '100%', marginTop: '1rem', background: 'var(--cv-eco-green)', color: '#fff', border: 'none' }}>
                                {t.confirmAdoption}
                            </button>
                        </form>
                    )}

                    {adoptedTrees.length > 0 && (
                        <div style={{ marginTop: '3rem', textAlign: 'left', animation: 'fadeIn 0.5s ease-out' }}>
                            <h3 className="cv-eco-section-title">
                                🌳 {t.myForest || 'My Forest (Adopted Trees)'}
                            </h3>
                            <div className="cv-grid cv-grid-2">
                                {adoptedTrees.map(tree => {
                                    const treeName = TREE_TYPES.find(opt => opt.id === tree.typeId)?.name;
                                    return (
                                        <div key={tree.id} className="cv-eco-feed-item" style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '.3rem' }}>{tree.nickname || treeName}</div>
                                            <div style={{ fontSize: '.85rem', color: 'var(--cv-text-muted)' }}>{treeName} • {t.plantedOn || 'Planted on'} {tree.date}</div>
                                            <div style={{ fontSize: '.9rem', margin: '.5rem 0 0 0' }}>📍 {tree.location}</div>
                                            {tree.occasion && (
                                                <div style={{ fontSize: '.85rem', color: '#10B981', marginTop: '.7rem', fontStyle: 'italic', background: 'rgba(16, 185, 129, 0.1)', padding: '.4rem .8rem', borderRadius: '4px', display: 'inline-block' }}>
                                                    🎉 {tree.occasion}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── LEADERBOARD TAB ── */}
            {activeTab === 'leaderboard' && (
                <div>
                    {/* Top 3 podium */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem', marginBottom: '1.5rem',
                    }}>
                        {MOCK_LEADERBOARD.slice(0, 3).map((entry, idx) => (
                            <div key={entry.userId} style={{
                                background: idx === 0
                                    ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
                                    : idx === 1
                                        ? 'linear-gradient(135deg, #F1F5F9, #E2E8F0)'
                                        : 'linear-gradient(135deg, #FEF0E7, #FDDCBC)',
                                border: `2px solid ${idx === 0 ? '#F59E0B' : idx === 1 ? '#94A3B8' : '#D97706'}`,
                                borderRadius: 'var(--cv-radius-lg)',
                                padding: '1.25rem',
                                textAlign: 'center',
                                order: idx === 0 ? 0 : idx === 1 ? -1 : 1,
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '.35rem' }}>{RANK_MEDALS[entry.rank]}</div>
                                <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.2rem' }}>{entry.userName}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: idx === 0 ? '#D97706' : idx === 1 ? '#64748B' : '#B45309' }}>
                                    {entry.civicScore}
                                </div>
                                <div style={{ fontSize: '.7rem', color: 'var(--cv-text-muted)', marginTop: '.2rem' }}>civic pts</div>
                                {isTopContributor(entry.civicScore) && (
                                    <div style={{ marginTop: '.6rem' }}>
                                        <TopContributorBadge size="sm" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Full table */}
                    <div className="cv-leaf-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--cv-eco-green-muted)', borderBottom: '1px solid rgba(22,163,74,0.2)' }}>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--cv-eco-green)' }}>Rank</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--cv-eco-green)' }}>Citizen</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--cv-eco-green)' }}>Score</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--cv-eco-green)' }}>🌳</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--cv-eco-green)' }}>🤝</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--cv-eco-green)' }}>📋</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_LEADERBOARD.map((entry, idx) => (
                                    <tr key={entry.userId} style={{
                                        borderBottom: '1px solid var(--cv-border)',
                                        background: currentUser?.id === entry.userId ? 'rgba(22,163,74,0.05)' : 'none',
                                    }}>
                                        <td style={{ padding: '0.9rem 1rem', fontWeight: 'bold', color: idx < 3 ? '#D97706' : 'var(--cv-text)' }}>
                                            {RANK_MEDALS[entry.rank] || `#${entry.rank}`}
                                        </td>
                                        <td style={{ padding: '0.9rem 1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                                                <div style={{
                                                    width: 34, height: 34, borderRadius: '50%',
                                                    background: 'var(--cv-eco-gradient)', color: '#fff',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '.85rem', fontWeight: 800, flexShrink: 0,
                                                }}>
                                                    {entry.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '.9rem' }}>
                                                        {entry.userName}
                                                        {currentUser?.id === entry.userId && (
                                                            <span className="cv-chip" style={{ fontSize: '.65rem', padding: '.1rem .4rem', marginLeft: '.35rem', background: 'var(--cv-eco-green-muted)', color: 'var(--cv-eco-green)' }}>You</span>
                                                        )}
                                                    </div>
                                                    {isTopContributor(entry.civicScore) && (
                                                        <TopContributorBadge size="sm" />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--cv-eco-green)' }}>
                                            ⭐ {entry.civicScore}
                                        </td>
                                        <td style={{ padding: '0.9rem 1rem', color: 'var(--cv-text-secondary)', fontSize: '.9rem' }}>{entry.treesAdopted}</td>
                                        <td style={{ padding: '0.9rem 1rem', color: 'var(--cv-text-secondary)', fontSize: '.9rem' }}>{entry.drivesJoined}</td>
                                        <td style={{ padding: '0.9rem 1rem', color: 'var(--cv-text-secondary)', fontSize: '.9rem' }}>{entry.issuesReported}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ padding: '.75rem 1rem', background: 'var(--cv-surface-alt)', fontSize: '.75rem', color: 'var(--cv-text-muted)' }}>
                            ⭐ Scoring: 🌳 Tree = 5pts • 🤝 Drive = 3pts • 📋 Report = 2pts
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function isTopContributor(score: number) { return score >= 300; }
