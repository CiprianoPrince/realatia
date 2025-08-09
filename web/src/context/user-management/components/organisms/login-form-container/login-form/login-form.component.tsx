import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from "@/shared/components";
import { cn } from "@/shared/lib";
import Link from "next/link";
import { ComponentPropsWithRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { PasswordInputGroup } from "../../../molecules/molecules";
import { ILoginFormValues } from "../login-form-container.type";

export interface ILoginFormProps extends ComponentPropsWithRef<"form"> {
  form: UseFormReturn<ILoginFormValues>;
  onFormSubmit: (data: ILoginFormValues) => Promise<void>;
}

export const LoginForm = ({
  className,
  form,
  onFormSubmit,
  ...props
}: ILoginFormProps) => {
  return (
    <Form {...form}>
      <form
        className={cn("", className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
        {...props}
      >
        <div className="flex flex-col gap-y-8">
          <div>
            <h1 className="text-4xl font-medium">Log in to your account</h1>
          </div>

          <div className="flex flex-col gap-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Email account</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email account" {...field} />
                  </FormControl>
                  <FormMessage className="absolute -bottom-6" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInputGroup
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="absolute -bottom-6" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shouldRemember"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-row items-center justify-start gap-x-2">
                  <Checkbox
                    className="size-5 shadow-2xl shadow-black"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel className="!mt-0 font-normal">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="h-12">
              <Button
                className="w-full h-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Log in
              </Button>
            </div>

            <div>
              <div className="flex flex-row gap-x-4 items-center justify-between">
                <span className="grow">
                  <Separator />
                </span>
                <span className="font-semibold text-gray-600">
                  Or continue with
                </span>
                <span className="grow">
                  <Separator />
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center">
                <span>Don't have an account?</span>&nbsp;
                <Link href="/register" className="text-blue-700 font-semibold">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
