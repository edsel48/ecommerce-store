import { cn } from '@/lib/utils';
import { MouseEventHandler } from 'react';

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hover:sacle-110 flex items-center justify-center rounded-full border bg-white p-2 shadow-md transition',
        className,
      )}
    >
      {icon}
    </button>
  );
};

export default IconButton;
