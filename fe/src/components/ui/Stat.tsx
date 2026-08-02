import type { ReactNode } from 'react';

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
}

export function Stat({ label, value }: StatProps) {
  return (
    <dl className="stat">
      <div className="stat__group">
        <dt className="stat__label">{label}</dt>
        <dd className="stat__value">{value}</dd>
      </div>
    </dl>
  );
}
