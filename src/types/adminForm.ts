export interface AdminFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type AdminFormErrors = Partial<Record<keyof AdminFormValues, string>>;

export const EMPTY_ADMIN_FORM_VALUES: AdminFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};
