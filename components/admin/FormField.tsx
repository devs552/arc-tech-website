'use client';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  type?: string;
  value: string | number | boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  options?: Option[];
  error?: string;
  disabled?: boolean;
  rows?: number;
  helperText?: string;
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  textarea = false,
  options,
  error,
  disabled = false,
  rows = 5,
  helperText,
}: FormFieldProps) {

  const isCheckbox = type === 'checkbox';
  const isSelect = type === 'select';

  const border = error
    ? 'border-red-500 focus:border-red-400'
    : 'border-white/10 focus:border-cyan-400';

  const baseInput =
    'w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="space-y-2 w-full">

      {/* Label */}
      {!isCheckbox && (
        <label className="block text-sm font-medium text-slate-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* TEXTAREA */}
      {textarea ? (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`${baseInput} border ${border} resize-none`}
        />
      ) : isSelect ? (
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={`${baseInput} border ${border}`}
        >
          <option value="">Select an option</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : isCheckbox ? (
        <label className="flex items-center gap-3 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={value === true || value === 'true'}
            onChange={(e) =>
              onChange(e.target.checked ? 'true' : 'false')
            }
            disabled={disabled}
            className="w-5 h-5 accent-cyan-500"
          />
          <span className="text-sm">{label}</span>
        </label>
      ) : (
        <input
          type={type}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${baseInput} border ${border}`}
        />
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Helper */}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}