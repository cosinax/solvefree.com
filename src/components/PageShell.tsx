interface PageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && <p className="text-muted text-lg">{description}</p>}
      </div>
      {children}
    </div>
  );
}
