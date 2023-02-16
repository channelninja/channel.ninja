type NumberInputProps = {
  label: string;
  unit?: string;
  error?: string;
} & React.ComponentPropsWithoutRef<'input'>;

export const NumberInput = ({ unit, error, ...props }: NumberInputProps) => {
  return (
    <div>
      <label htmlFor={props.id || props.name}>{props.label}</label>

      <div
        role="group"
        className="relative flex justify-between bg-white p-4"
      >
        <input
          {...props}
          type="number"
          autoComplete="off"
          className="w-full text-black"
          min={props.min || 0}
        />
        <span className="ml-1 text-black">{unit}</span>

        {error && <div className="absolute -bottom-10 left-0 text-red-500">{error}</div>}
      </div>
    </div>
  );
};
