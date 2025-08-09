import { cn } from "@/shared/lib";
import {
  cloneElement,
  ComponentPropsWithRef,
  forwardRef,
  ReactElement,
  ReactNode,
} from "react";

export interface IInputGroupProps<T extends ReactElement>
  extends ComponentPropsWithRef<"div"> {
  startElement?: ReactNode;
  endElement?: ReactNode;
  children: T;
}

export const InputGroup = forwardRef<
  HTMLDivElement,
  IInputGroupProps<ReactElement<any>>
>(({ startElement, endElement, className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative flex items-center", className)}
      {...props}
    >
      {startElement && (
        <div className="absolute left-3 z-10">{startElement}</div>
      )}
      <div className="flex w-full items-center">
        {cloneElement(children, {
          className: cn(
            "px-3",
            startElement ? "pl-9" : "",
            endElement ? "pr-9" : "",
            children.props.className
          ),
        })}
      </div>
      {endElement && <div className="absolute right-3 z-10">{endElement}</div>}
    </div>
  );
});
