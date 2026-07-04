interface ProgressCardProps {
  percent: number;
  completed: number;
  total: number;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressCard({ percent, completed, total }: ProgressCardProps) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-navy-400">Your Progress</p>
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#E7ECF5" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="#1061EC"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 400ms ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] font-extrabold leading-none text-navy-800">{percent}%</span>
            <span className="mt-1 text-[11px] font-medium text-navy-400">completed</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-navy-500">
          {completed} of {total} completed
        </p>
      </div>
    </div>
  );
}
