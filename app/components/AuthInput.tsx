import React, { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export default function AuthInput({ 
  label, 
  id, 
  className = '', 
  ...props 
}: AuthInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <input
        id={id}
        className={`w-full bg-[#1c1e30] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
} 