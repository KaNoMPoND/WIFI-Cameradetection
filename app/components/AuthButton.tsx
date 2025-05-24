import React from 'react';

interface AuthButtonProps {
  label: string;
  loadingLabel: string;
  loading: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function AuthButton({ 
  label, 
  loadingLabel, 
  loading, 
  onClick,
  type = 'submit'
}: AuthButtonProps) {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`w-full bg-blue-600 py-3 rounded-lg font-medium transition-colors ${
        loading ? 'bg-blue-800' : 'hover:bg-blue-700'
      }`}
    >
      {loading ? loadingLabel : label}
    </button>
  );
} 