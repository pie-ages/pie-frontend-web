export interface NewPasswordValues {
  password: string;
  confirmPassword: string;
}

export type NewPasswordErrors = Partial<Record<keyof NewPasswordValues, string>>;
