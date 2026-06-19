import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui/input";

export interface MaskedInputProps extends Omit<InputProps, "onChange"> {
  mask: (rawValue: string) => string;
  onValueChange: (maskedValue: string) => void;
}

/** Input com mascaramento progressivo (CPF, CNPJ, CEP, telefone, etc.) aplicado a cada digitação. */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onValueChange, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        onChange={(e) => onValueChange(mask(e.target.value))}
        {...props}
      />
    );
  },
);

MaskedInput.displayName = "MaskedInput";
