import z from "zod";
import { registerFormValuesSchema } from "./register-form-container.schema";

export interface IRegisterFormValues extends z.infer<typeof registerFormValuesSchema> {}
