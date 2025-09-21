import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import clsx from 'clsx';

type CardProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md',
        className
      )}
      {...props}
    />
  );
}
