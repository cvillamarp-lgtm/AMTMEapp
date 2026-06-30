'use client';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function UrlInput({ value, onChange, placeholder = 'Enter URL...' }: UrlInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isValid = value === '' || value.startsWith('http');

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded font-mono text-sm ${
        !isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}
    />
  );
}
