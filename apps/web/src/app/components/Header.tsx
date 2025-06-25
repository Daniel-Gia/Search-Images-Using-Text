import Link from "next/link";

interface HeaderProps {
  title: string;
  actionButton?: {
    href: string;
    text: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary';
  };
}

export default function Header({ title, actionButton }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-blue-900">{title}</h1>
          {actionButton && (
            <Link
              href={actionButton.href}
              className={`${
                actionButton.variant === 'secondary'
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center gap-2`}
            >
              {actionButton.icon}
              {actionButton.text}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
