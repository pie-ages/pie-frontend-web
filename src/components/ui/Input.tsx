import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, leftElement, rightElement, error, className = '', ...props }, ref) => {
    return (
      <div className={`${styles.formGroup} ${className}`}>
        {label && (
          <label className={styles.label}>
            {label} {required && <span className={styles.requiredAsterisk}>*</span>}
          </label>
        )}

        <div className={styles.inputContainer}>
          {leftElement && <div className={styles.leftElementWrapper}>{leftElement}</div>}
          <input
            ref={ref}
            required={required}
            aria-invalid={Boolean(error)}
            className={`${styles.input} ${leftElement ? styles.hasLeftElement : ''} ${rightElement ? styles.hasRightElement : ''} ${error ? styles.hasError : ''}`}
            {...props}
          />

          {rightElement && <div className={styles.rightElementWrapper}>{rightElement}</div>}
        </div>

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
