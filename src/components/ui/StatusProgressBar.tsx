import { STATUS_OPTIONS } from '../../mockData';
import type { IssueStatus } from '../../types';

interface Props {
    status: IssueStatus;
    showLabel?: boolean;
}

/** Maps each status to which step indices should be "completed" or "active" */
function getStepState(statusId: IssueStatus) {
    const info = STATUS_OPTIONS.find((s) => s.id === statusId);
    if (!info) return { step: 0, color: '#6B7280' };
    return { step: info.step, color: info.color };
}

const TOTAL_STEPS = 6; // reported → closed = 6 steps

export default function StatusProgressBar({ status, showLabel = true }: Props) {
    const { step, color } = getStepState(status);
    const label = STATUS_OPTIONS.find((s) => s.id === status)?.label ?? status;

    return (
        <div>
            {showLabel && (
                <div
                    className="cv-text-xs cv-font-semibold"
                    style={{ color, marginBottom: 4 }}
                >
                    {label}
                </div>
            )}
            <div className="cv-status-steps">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                    const idx = i + 1;
                    let cls = 'cv-status-step';
                    if (idx < step) cls += ' completed';
                    else if (idx === step) cls += ' active';
                    return (
                        <div
                            key={i}
                            className={cls}
                            style={idx === step ? { background: color } : undefined}
                        />
                    );
                })}
            </div>
        </div>
    );
}
