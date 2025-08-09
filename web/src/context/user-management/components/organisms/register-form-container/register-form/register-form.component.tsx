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
} from "@/shared/components";
import { cn } from "@/shared/lib";
import Link from "next/link";
import { ComponentPropsWithRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { PasswordInputGroup } from "../../../molecules/molecules";
import { IRegisterFormValues } from "../register-form-container.type";

export interface IRegisterFormProps extends ComponentPropsWithRef<"form"> {
  form: UseFormReturn<IRegisterFormValues>;
  onFormSubmit: (data: IRegisterFormValues) => Promise<void>;
}

export const RegisterForm = ({
  className,
  form,
  onFormSubmit,
  ...props
}: IRegisterFormProps) => {
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
              name="fullName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email account" {...field} />
                  </FormControl>
                  <FormMessage className="absolute -bottom-6" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email account"
                      {...field}
                    />
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
                  <FormLabel>Email account</FormLabel>
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInputGroup
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="absolute -bottom-6" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-row items-center justify-start gap-x-2">
                  <Checkbox
                    className="size-5 shadow-2xl shadow-black"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel className="!mt-0 font-normal">
                    I accept the
                    <Link
                      href="/terms_and_conditions"
                      className="text-blue-700 font-semibold"
                    >
                      Terms of Service
                    </Link>
                    and
                    <Link
                      href="/terms_and_conditions"
                      className="text-blue-700 font-semibold"
                    >
                      Privacy Policy
                    </Link>
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
                Sign up
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-center">
                <span>Already have an account?</span>&nbsp;
                <Link href="/login" className="text-blue-700 font-semibold">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
