import { useState, useEffect } from 'react';
import { useT } from '../i18n/translations';
import { MOCK_DRIVES, MOCK_LEADERBOARD, TREE_TYPES } from '../mockData';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import type { TreeType, CommunityDrive } from '../types';

type Tab = 'feed' | 'adopt' | 'leaderboard';

interface AdoptedTree {
    id: string;
    typeId: TreeType;
    nickname: string;
    location: string;
    occasion: string;
    date: string;
}

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
            // Fetch drives
            const { data: driveData } = await supabase.from('cv_community_drives').select('*').order('created_at', { ascending: false });
            if (driveData && driveData.length > 0) {
                setDrives(driveData.map((d: any) => ({
                    id: d.id,
                    title: d.title,
                    description: d.description,
                    type: d.drive_type as any,
                    date: d.drive_date,
                    location: d.location,
                    authorityName: d.authority_name,
                    participantsCount: d.participants_count,
                    imageUrl: d.image_url
                })));
            } else {
                setDrives(MOCK_DRIVES);
            }

            // Fetch my trees
            if (currentUser?.id && currentUser.id !== 'guest') {
                const { data: treeData } = await supabase.from('cv_adopted_trees').select('*').eq('adopted_by', currentUser.id).order('created_at', { ascending: false });
                if (treeData) {
                    setAdoptedTrees(treeData.map((t: any) => ({
                        id: t.id,
                        typeId: t.type_id as any,
                        nickname: t.nickname,
                        location: t.location,
                        occasion: t.occasion,
                        date: new Date(t.created_at).toLocaleDateString()
                    })));
                }
            }
        }
        fetchData();
    }, [currentUser]);

    const handleJoinDrive = (driveId: string) => {
        setJoinedDrives(prev => {
            const next = new Set(prev);
            next.add(driveId);
            return next;
        });
    };

    const handleAdoptTree = async () => {
        if (!selectedTree) return;
        
        const newTree: AdoptedTree = {
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
            typeId: selectedTree,
            nickname: treeForm.nickname,
            location: treeForm.location,
            occasion: treeForm.occasion,
            date: new Date().toLocaleDateString()
        };

        // Optimistic
        setAdoptedTrees(prev => [newTree, ...prev]);

        const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co';
        if (hasSupabase && currentUser?.id && currentUser.id !== 'guest') {
            const { error } = await supabase.from('cv_adopted_trees').insert({
                id: newTree.id,
                type_id: newTree.typeId,
                nickname: newTree.nickname,
                location: newTree.location,
                occasion: newTree.occasion,
                adopted_by: currentUser.id
            });
            if (error) {
                console.error("Adopt tree error:", error);
                alert("Failed to adopt tree: " + error.message);
                setAdoptedTrees(prev => prev.filter(t => t.id !== newTree.id));
                return;
            }
        }

        setAdoptionSuccess(true);
        setTimeout(() => {
            setAdoptionSuccess(false);
            setSelectedTree(null);
            setTreeForm({ nickname: '', location: '', occasion: '' });
        }, 3000);
    };

    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: '2rem' }}>
            <div className="cv-page-header" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    {t.communityHubTitle}
                </h1>
                <p>{t.communityHubDesc}</p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                borderBottom: '1px solid var(--cv-border)',
                marginBottom: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '.5rem'
            }}>
                {[
                    { id: 'feed', label: t.communityHub },
                    { id: 'adopt', label: t.adoptATree },
                    { id: 'leaderboard', label: t.leaderboard }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '.5rem .8rem',
                            fontSize: '1rem',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            color: activeTab === tab.id ? 'var(--cv-primary)' : 'var(--cv-text-secondary)',
                            borderBottom: activeTab === tab.id ? '2px solid var(--cv-primary)' : '2px solid transparent',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* --- FEED TAB --- */}
            {activeTab === 'feed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {drives.map((drive: CommunityDrive) => (
                        <div key={drive.id} className="cv-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 .3rem 0', fontSize: '1.15rem' }}>{drive.title}</h3>
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
                    ))}
                </div>
            )}

            {/* --- ADOPT A TREE TAB --- */}
            {activeTab === 'adopt' && (
                <div className="cv-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌳</div>
                    <h2 style={{ marginBottom: '.5rem' }}>{t.adoptATree}</h2>
                    <p style={{ color: 'var(--cv-text-secondary)', marginBottom: '2rem' }}>
                        {t.adoptTreeDesc}
                    </p>

                    {adoptionSuccess ? (
                        <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '8px', fontWeight: 600 }}>
                            {t.treeAdoptionSuccess}
                        </div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); handleAdoptTree(); }} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="cv-input-group">
                                <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: 500 }}>{t.treeType} <span style={{color: 'red'}}>*</span></label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem' }}>
                                    {TREE_TYPES.map(tree => (
                                        <div
                                            key={tree.id}
                                            onClick={() => setSelectedTree(tree.id)}
                                            style={{
                                                padding: '.5rem 1rem',
                                                borderRadius: '8px',
                                                border: `2px solid ${selectedTree === tree.id ? 'var(--cv-primary)' : 'var(--cv-border)'}`,
                                                background: selectedTree === tree.id ? 'var(--cv-bg-mute)' : 'var(--cv-bg)',
                                                color: 'var(--cv-text)',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                fontSize: '.85rem',
                                                transition: 'all 0.2s'
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
                                    <input type="text" className="cv-input" placeholder="e.g. Green Guardian" value={treeForm.nickname} onChange={e => setTreeForm({...treeForm, nickname: e.target.value})} />
                                </div>
                                <div className="cv-input-group">
                                    <label>{t.plantationLocation} <span style={{color: 'red'}}>*</span></label>
                                    <input type="text" className="cv-input" required placeholder="e.g. Rohini Sector 11 Park" value={treeForm.location} onChange={e => setTreeForm({...treeForm, location: e.target.value})} />
                                </div>
                            </div>

                            <div className="cv-input-group">
                                <label>{t.treeOccasion || 'Occasion'}</label>
                                <input type="text" className="cv-input" placeholder={t.treeOccasionPlaceholder || "e.g. My son's 5th birthday"} value={treeForm.occasion} onChange={e => setTreeForm({...treeForm, occasion: e.target.value})} />
                            </div>

                            <div className="cv-input-group">
                                <label>{t.uploadTreePhoto}</label>
                                <div style={{ 
                                    padding: '2rem', 
                                    border: '2px dashed var(--cv-border)', 
                                    borderRadius: '8px', 
                                    textAlign: 'center',
                                    color: 'var(--cv-text-secondary)',
                                    cursor: 'pointer' 
                                }}>
                                    📷 Click to upload photo
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                <input type="checkbox" id="pledge" required style={{ width: '1.2rem', height: '1.2rem' }} />
                                <label htmlFor="pledge" style={{ margin: 0, color: 'var(--cv-text)' }}>{t.carePledge}</label>
                            </div>

                            <button 
                                type="submit"
                                className="cv-btn cv-btn-primary cv-btn-lg" 
                                disabled={!selectedTree}
                                style={{ width: '100%', marginTop: '1rem' }}
                            >
                                {t.confirmAdoption}
                            </button>
                        </form>
                    )}

                    {/* --- MY FOREST --- */}
                    {adoptedTrees.length > 0 && (
                        <div style={{ marginTop: '3rem', textAlign: 'left', animation: 'fadeIn 0.5s ease-out' }}>
                            <h3 style={{ borderBottom: '1px solid var(--cv-border)', paddingBottom: '.5rem', marginBottom: '1.5rem' }}>
                                🌳 {t.myForest || 'My Forest (Adopted Trees)'}
                            </h3>
                            <div className="cv-grid cv-grid-2">
                                {adoptedTrees.map(tree => {
                                    const treeName = TREE_TYPES.find(opt => opt.id === tree.typeId)?.name;
                                    return (
                                        <div key={tree.id} className="cv-card" style={{ padding: '1rem', borderLeft: '4px solid var(--cv-primary)' }}>
                                            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '.3rem' }}>
                                                {tree.nickname || treeName}
                                            </div>
                                            <div style={{ fontSize: '.85rem', color: 'var(--cv-text-muted)' }}>
                                                {treeName} • {t.plantedOn || 'Planted on'} {tree.date}
                                            </div>
                                            <div style={{ fontSize: '.9rem', margin: '.5rem 0 0 0' }}>
                                                📍 {tree.location}
                                            </div>
                                            {tree.occasion && (
                                                <div style={{ fontSize: '.85rem', color: '#10B981', marginTop: '.7rem', fontStyle: 'italic', background: 'rgba(16, 185, 129, 0.1)', padding: '.4rem .8rem', borderRadius: '4px', display: 'inline-block' }}>
                                                    🎉 {tree.occasion}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- LEADERBOARD TAB --- */}
            {activeTab === 'leaderboard' && (
                <div className="cv-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--cv-bg-mute)', borderBottom: '1px solid var(--cv-border)' }}>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Rank</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Citizen</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>{t.civicScore}</th>
                                <th style={{ padding: '1rem', fontWeight: 600, display: 'none' }} className="cv-md-table-cell">{t.treesAdopted}</th>
                                <th style={{ padding: '1rem', fontWeight: 600, display: 'none' }} className="cv-md-table-cell">{t.drivesJoined}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_LEADERBOARD.map((entry, idx) => (
                                <tr key={entry.userId} style={{ borderBottom: '1px solid var(--cv-border)', background: currentUser?.id === entry.userId ? 'rgba(59, 130, 246, 0.05)' : 'none' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: idx < 3 ? 'var(--cv-primary)' : 'var(--cv-text)' }}>
                                        #{entry.rank}
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--cv-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 'bold' }}>
                                            {entry.userName.charAt(0)}
                                        </div>
                                        {entry.userName}
                                        {currentUser?.id === entry.userId && <span className="cv-chip" style={{ fontSize: '.7rem', padding: '.1rem .4rem' }}>You</span>}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--cv-primary)' }}>
                                        ⭐ {entry.civicScore}
                                    </td>
                                    <td style={{ padding: '1rem', display: 'none' }} className="cv-md-table-cell">
                                        🌳 {entry.treesAdopted}
                                    </td>
                                    <td style={{ padding: '1rem', display: 'none' }} className="cv-md-table-cell">
                                        🤝 {entry.drivesJoined}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
