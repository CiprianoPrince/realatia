"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentPropsWithRef } from "react";
import { useForm } from "react-hook-form";
import { LOGIN_FORM_DEFAULT_VALUES } from "./login-form-container.constant";
import { loginFormValuesSchema } from "./login-form-container.schema";
import { ILoginFormValues } from "./login-form-container.type";
import { LoginForm } from "./login-form/login-form.component";

export interface ILoginFormContainer extends ComponentPropsWithRef<"form"> {}

export const LoginFormContainer = ({ ...props }: ILoginFormContainer) => {
  const form = useForm<ILoginFormValues>({
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
    resolver: zodResolver(loginFormValuesSchema),
  });

  const handleSubmit = async (data: ILoginFormValues) => {
    console.log(data);
  };

  return <LoginForm form={form} onFormSubmit={handleSubmit} {...props} />;
};
