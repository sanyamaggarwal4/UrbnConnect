import type { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
    { id: 'sanitation-waste', label: 'Sanitation & Waste', color: '#D97706', icon: '🗑️' },
    { id: 'water-drainage', label: 'Water & Drainage', color: '#2563EB', icon: '💧' },
    { id: 'roads-infrastructure', label: 'Roads & Infrastructure', color: '#6B7280', icon: '🛣️' },
    { id: 'streetlights-electricity', label: 'Streetlights & Electricity', color: '#F59E0B', icon: '💡' },
    { id: 'environment-damage', label: 'Environment Damage', color: '#059669', icon: '🌳' },
    { id: 'low-greenery-deforestation', label: 'Low Greenery / Deforestation', color: '#16A34A', icon: '🌿' },
    { id: 'animal-human-conflict', label: 'Animal–Human Conflict', color: '#DC2626', icon: '🐕' },
    { id: 'citizen-safety', label: 'Citizen Safety', color: '#7C3AED', icon: '🛡️' },
    { id: 'public-health', label: 'Public Health', color: '#EC4899', icon: '🏥' },
    { id: 'illegal-encroachment', label: 'Illegal Encroachment', color: '#92400E', icon: '🚧' },
    { id: 'noise-nuisance', label: 'Noise / Public Nuisance', color: '#EF4444', icon: '📢' },
    { id: 'public-property-damage', label: 'Public Property Damage', color: '#4B5563', icon: '🏚️' },
    { id: 'other', label: 'Other', color: '#9CA3AF', icon: '📋' },
];

export const SEVERITY_OPTIONS = [
    { id: 'low', label: 'Low', color: '#10B981' },
    { id: 'medium', label: 'Medium', color: '#F59E0B' },
    { id: 'high', label: 'High', color: '#EF4444' },
    { id: 'critical', label: 'Critical', color: '#7C3AED' },
] as const;

export const STATUS_OPTIONS = [
    { id: 'reported', label: 'Reported', color: '#6B7280', step: 1 },
    { id: 'under-review', label: 'Under Review', color: '#3B82F6', step: 2 },
    { id: 'assigned', label: 'Assigned', color: '#8B5CF6', step: 3 },
    { id: 'in-progress', label: 'In Progress', color: '#F59E0B', step: 4 },
    { id: 'resolved', label: 'Resolved', color: '#10B981', step: 5 },
    { id: 'closed', label: 'Closed', color: '#1F2937', step: 6 },
    { id: 'rejected', label: 'Rejected / Duplicate', color: '#EF4444', step: 0 },
] as const;
