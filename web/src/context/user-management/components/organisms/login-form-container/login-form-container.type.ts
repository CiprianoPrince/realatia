import z from "zod";
import { loginFormValuesSchema } from "./login-form-container.schema";

export interface ILoginFormValues extends z.infer<typeof loginFormValuesSchema> {}
