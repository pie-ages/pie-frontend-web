import { SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, required, options, placeholder = 'Selecione', error, className = '', ...props },
    ref,
  ) => {
    return (
      <div className={`${styles.formGroup} ${className}`}>
        {label && (
          <label className={styles.label}>
            {label} {required && <span className={styles.requiredAsterisk}>*</span>}
          </label>
        )}

        <select
          ref={ref}
          required={required}
          aria-invalid={Boolean(error)}
          className={`${styles.select} ${error ? styles.hasError : ''}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
