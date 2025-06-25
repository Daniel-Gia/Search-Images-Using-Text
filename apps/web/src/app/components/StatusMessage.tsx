interface StatusMessageProps {
  status: 'success' | 'error' | 'idle';
  message?: string;
}

export default function StatusMessage({ status, message }: StatusMessageProps) {
  if (status === 'idle') return null;

  const isSuccess = status === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const defaultMessage = isSuccess 
    ? 'Upload successful! Redirecting to gallery...' 
    : 'An error occurred';

  return (
    <div className={`${bgColor} border-t ${borderColor} p-6`}>
      <div className={`flex items-center justify-center gap-3 ${textColor}`}>
        {isSuccess ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span className="font-semibold">
          {isSuccess ? defaultMessage : `Error: ${message || defaultMessage}`}
        </span>
      </div>
    </div>
  );
}
