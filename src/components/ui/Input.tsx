import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, rightElement, className = '', ...props }, ref) => {
    return (
      <div className={`${styles.formGroup} ${className}`}>
        {label && (
          <label className={styles.label}>
            {label} {required && <span className={styles.requiredAsterisk}>*</span>}
          </label>
        )}

        <div className={styles.inputContainer}>
          <input
            ref={ref}
            required={required}
            className={`${styles.input} ${rightElement ? styles.hasRightElement : ''}`}
            {...props}
          />

          {rightElement && <div className={styles.rightElementWrapper}>{rightElement}</div>}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
