import { useRef } from 'react';
import { AriaDialogProps, useDialog } from 'react-aria';

type DialogProps = {
  children: React.ReactElement;
  title: string;
  onCloseClick: () => void;
} & AriaDialogProps;

const Dialog = ({ children, title, onCloseClick, ...props }: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const { dialogProps, titleProps } = useDialog(props, dialogRef);

  return (
    <div
      className="relative flex max-h-full flex-col overflow-auto border-dashed border-white bg-neutral-900 p-8 text-white"
      {...dialogProps}
      ref={dialogRef}
    >
      <button
        type="button"
        className="absolute top-0 right-0 cursor-pointer p-4 text-white"
        onClick={onCloseClick}
      >
        close
      </button>

      <h2
        {...titleProps}
        className="mb-8 text-3xl"
      >
        {title}
      </h2>

      <div>{children}</div>
    </div>
  );
};

export default Dialog;
