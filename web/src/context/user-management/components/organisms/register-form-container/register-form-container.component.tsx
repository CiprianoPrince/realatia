"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentPropsWithRef } from "react";
import { useForm } from "react-hook-form";
import { REGISTER_FORM_DEFAULT_VALUES } from "./register-form-container.constant";
import { registerFormValuesSchema } from "./register-form-container.schema";
import { IRegisterFormValues } from "./register-form-container.type";
import { RegisterForm } from "./register-form/register-form.component";

export interface IRegisterFormContainer extends ComponentPropsWithRef<"form"> {}

export const RegisterFormContainer = ({ ...props }: IRegisterFormContainer) => {
  const form = useForm<IRegisterFormValues>({
    defaultValues: REGISTER_FORM_DEFAULT_VALUES,
    resolver: zodResolver(registerFormValuesSchema),
  });

  const handleSubmit = async (data: IRegisterFormValues) => {
    console.log(data);
  };

  return <RegisterForm form={form} onFormSubmit={handleSubmit} {...props} />;
};
