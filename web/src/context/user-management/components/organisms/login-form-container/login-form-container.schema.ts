import z from "zod";

export const loginFormValuesSchema = z.object({
  email: z
    .email("This field is required.")
    .transform((val) => val.trim()),

  password: z
    .string()
    .min(8, "This field is required.")
    .transform((val) => val.trim()),

  shouldRemember: z.boolean(),
});
