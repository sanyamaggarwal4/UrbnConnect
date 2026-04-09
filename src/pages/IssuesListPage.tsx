import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import ProblemCard from '../components/issue/ProblemCard';
import FilterPanel from '../components/issue/FilterPanel';
import type { FilterState } from '../components/issue/FilterPanel';
import type { Issue } from '../types';

export default function IssuesListPage() {
    const { issues, upvoteIssue } = useAppContext();
    const t = useT();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<FilterState>({
        category: 'all',
        status: 'all',
        severity: 'all',
    });
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'upvotes'>('recent');

    /* ── Apply filters ────────────────────────────────────── */
    let filtered = [...issues];

    if (filters.category !== 'all') {
        filtered = filtered.filter((i) => i.category === filters.category);
    }
    if (filters.status !== 'all') {
        filtered = filtered.filter((i) => i.status === filters.status);
    }
    if (filters.severity !== 'all') {
        filtered = filtered.filter((i) => i.severity === filters.severity);
    }
    if (search.trim()) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
            (i) =>
                i.title.toLowerCase().includes(query) ||
                i.description.toLowerCase().includes(query) ||
                i.location.area.toLowerCase().includes(query),
        );
    }

    /* ── Sort ──────────────────────────────────────────────── */
    if (sortBy === 'recent') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
        filtered.sort((a, b) => b.upvotes - a.upvotes);
    }

    const handleCardClick = (issue: Issue) => {
        navigate(`/issues/${issue.id}`);
    };

    return (
        <div className="cv-animate-fadeIn">
            <div className="cv-page-header">
                <h1>📋 {t.localityProblemsTitle}</h1>
                <p>{t.localityProblemsSubtitle}</p>
            </div>

            {/* Search + Sort bar */}
            <div className="cv-flex cv-items-center cv-gap" style={{ marginBottom: '.75rem', flexWrap: 'wrap' }}>
                <input
                    className="cv-input"
                    type="text"
                    placeholder={`🔍 ${t.searchPlaceholder}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: 420 }}
                />
                <div className="cv-flex cv-gap-sm">
                    <button
                        className={`cv-filter-chip ${sortBy === 'recent' ? 'selected' : ''}`}
                        onClick={() => setSortBy('recent')}
                    >
                        🕐 {t.recent}
                    </button>
                    <button
                        className={`cv-filter-chip ${sortBy === 'upvotes' ? 'selected' : ''}`}
                        onClick={() => setSortBy('upvotes')}
                    >
                        👍 {t.mostUpvoted}
                    </button>
                </div>
                <span className="cv-text-sm cv-text-muted" style={{ marginLeft: 'auto' }}>
                    {filtered.length} {filtered.length !== 1 ? t.issuesFound : t.issueFound}
                </span>
            </div>

            {/* Filters */}
            <FilterPanel filters={filters} onChange={setFilters} />

            {/* Results */}
            {filtered.length === 0 ? (
                <div className="cv-card cv-text-center" style={{ padding: '3rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🔍</div>
                    <h3 style={{ marginBottom: '.35rem' }}>{t.noIssuesFound}</h3>
                    <p className="cv-text-sm cv-text-secondary">
                        {t.noIssuesFoundDesc}
                    </p>
                </div>
            ) : (
                <div className="cv-grid cv-grid-2">
                    {filtered.map((issue) => (
                        <ProblemCard
                            key={issue.id}
                            issue={issue}
                            onUpvote={upvoteIssue}
                            onClick={handleCardClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
