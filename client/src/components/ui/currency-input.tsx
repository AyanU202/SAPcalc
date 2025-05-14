import React, { forwardRef } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<InputProps, "onChange" | "value"> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  currency?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currency = "₹", className, ...props }, ref) => {
    // Handle internal changes and convert to number
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      // Remove non-numeric characters except for decimal point
      const cleanValue = rawValue.replace(/[^0-9.]/g, "");
      
      // Convert to number or undefined if empty
      const numericValue = cleanValue ? parseFloat(cleanValue) : undefined;
      onChange(numericValue);
    };

    return (
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
          {currency}
        </span>
        <Input
          ref={ref}
          type="text"
          value={value?.toString() || ""}
          onChange={handleChange}
          className={cn("pl-8", className)}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
