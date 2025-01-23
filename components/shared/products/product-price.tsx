import { cn } from "@/lib/utils";

type ProductPriceProps = {
  value: number;
  className?: string;
};

export default function ProductPrice({ value, className }: ProductPriceProps) {
  // set the value to two decimal places
  const stringValue = value.toFixed(2);

  // seperate the integer and float for styling purposes
  const [integerValue, floatValue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className='text-xs align-super'>£</span>
      {integerValue}
      <span className='text-xs align-super'>.{floatValue}</span>
    </p>
  );
}
