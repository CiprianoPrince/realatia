import { IRegisterFormValues } from "./register-form-container.type";

export const REGISTER_FORM_DEFAULT_VALUES = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
} satisfies IRegisterFormValues;
