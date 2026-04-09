interface StatCardProps {
    icon: string;
    value: string | number;
    label: string;
    color?: string;
}

export default function StatCard({ icon, value, label, color }: StatCardProps) {
    return (
        <div className="cv-stat-card cv-animate-fadeIn">
            <div className="cv-stat-card-icon">{icon}</div>
            <div className="cv-stat-card-value" style={color ? { color } : undefined}>
                {value}
            </div>
            <div className="cv-stat-card-label">{label}</div>
        </div>
    );
}
