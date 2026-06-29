'use client';

interface SaveStatusProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
}

export function SaveStatus({ status }: SaveStatusProps) {
  if (status === 'idle') {
    return null;
  }

  const config = {
    saving: { bg: 'bg-blue-50', text: 'text-blue-900', message: 'Saving...' },
    saved: { bg: 'bg-green-50', text: 'text-green-900', message: 'Saved successfully' },
    error: { bg: 'bg-red-50', text: 'text-red-900', message: 'Save failed' },
  };

  const current = config[status];

  return (
    <div className={`${current.bg} ${current.text} px-6 py-3 border-t`}>
      <p className="font-medium">{current.message}</p>
    </div>
  );
}
