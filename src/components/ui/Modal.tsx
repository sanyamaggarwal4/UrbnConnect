import type { ReactNode } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
    if (!open) return null;

    return (
        <div className="cv-overlay" onClick={onClose}>
            <div className="cv-modal cv-animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                <div className="cv-modal-header">
                    <h3>{title}</h3>
                    <button className="cv-btn cv-btn-ghost cv-btn-icon" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
