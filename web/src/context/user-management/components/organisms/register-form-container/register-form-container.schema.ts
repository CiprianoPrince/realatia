import z from "zod";

export const registerFormValuesSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "This field is required.")
      .max(50, "First name should be only max 50 characters long.")
      .refine((name) => /^[a-zA-Z\s]+$/.test(name), "Invalid Characters."),

    email: z
      .email("Please enter a valid email address.")
      .trim()
      .min(1, "Email is required."),

    password: z
      .string()
      .trim()
      .min(8, "Password should be at least 8 characters long.")
      .refine(
        (password) => /[A-Z]/.test(password),
        "Password should contain at least one uppercase letter."
      )
      .refine(
        (password) => /[a-z]/.test(password),
        "Password should contain at least one lowercase letter."
      )
      .refine(
        (password) => /[0-9]/.test(password),
        "Password should contain at least one number."
      ),

    confirmPassword: z
      .string()
      .trim()
      .min(8, "Password should be at least 8 characters long.")
      .refine(
        (password) => /[A-Z]/.test(password),
        "Password should contain at least one uppercase letter."
      )
      .refine(
        (password) => /[a-z]/.test(password),
        "Password should contain at least one lowercase letter."
      )
      .refine(
        (password) => /[0-9]/.test(password),
        "Password should contain at least one number."
      ),

    termsAccepted: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.termsAccepted, {
    message: "You must accept the terms and conditions.",
    path: ["termsAccepted"],
  });
