interface BadgeProps {
  children: React.ReactNode;
  colorClassName?: string;
}

export function Badge({ children, colorClassName = 'bg-brand-soft text-brand-dark' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClassName}`}>
      {children}
    </span>
  );
}
