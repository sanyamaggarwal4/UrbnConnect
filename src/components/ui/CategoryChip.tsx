import { CATEGORIES } from '../../mockData';
import type { IssueCategory } from '../../types';

interface Props {
    category: IssueCategory;
    size?: 'sm' | 'md';
}

export default function CategoryChip({ category, size = 'sm' }: Props) {
    const info = CATEGORIES.find((c) => c.id === category);
    if (!info) return null;

    const fontSize = size === 'sm' ? '.72rem' : '.82rem';

    return (
        <span
            className="cv-chip"
            style={{
                background: `${info.color}14`,
                color: info.color,
                fontSize,
            }}
        >
            <span>{info.icon}</span>
            {info.label}
        </span>
    );
}
