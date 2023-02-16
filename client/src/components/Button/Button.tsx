import classNames from 'classnames';
import { useRef } from 'react';
import { AriaButtonProps, useButton } from 'react-aria';

interface ButtonProps extends AriaButtonProps<'button'> {
  children: string;
  className?: string;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={classNames(
        className,
        'min-w-[100px] cursor-pointer border-dashed border-white bg-neutral-900 p-4 text-center text-white',
      )}
    >
      {children}
    </button>
  );
};

export default Button;
