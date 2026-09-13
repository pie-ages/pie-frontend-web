import { TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, required, error, className = '', ...props }, ref) => {
    return (
      <div className={`${styles.formGroup} ${className}`}>
        {label && (
          <label className={styles.label}>
            {label} {required && <span className={styles.requiredAsterisk}>*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          required={required}
          aria-invalid={Boolean(error)}
          className={`${styles.textarea} ${error ? styles.hasError : ''}`}
          {...props}
        />

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
