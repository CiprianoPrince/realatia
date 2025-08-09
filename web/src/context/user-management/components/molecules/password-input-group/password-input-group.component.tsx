"use client";

import { Input, InputGroup } from "@/shared/components";
import { Eye, EyeClosed } from "lucide-react";
import { ComponentPropsWithRef, forwardRef, ReactNode, useState } from "react";

export interface IPasswordInputGroupProps
  extends ComponentPropsWithRef<"input"> {
  startElement?: ReactNode;
}

export const PasswordInputGroup = forwardRef<
  HTMLInputElement,
  IPasswordInputGroupProps
>(({ startElement, className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <InputGroup
      ref={ref}
      startElement={startElement}
      endElement={
        showPassword ? (
          <Eye className="size-4" onClick={handleToggle} />
        ) : (
          <EyeClosed className="size-4" onClick={handleToggle} />
        )
      }
      className={className}
    >
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        {...props}
      />
    </InputGroup>
  );
});
