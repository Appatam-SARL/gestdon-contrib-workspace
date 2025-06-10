import { cn } from '@/lib/utils';
import * as React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <label className='relative inline-flex cursor-pointer'>
      {checked !== undefined &&
        onCheckedChange && ( //TODO: ce que j'ai ajouter pour resoudre le problème qui souvenaire au composannt switch
          <input
            type='checkbox'
            className='sr-only'
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            ref={ref}
            {...props}
          />
        )}
      <div
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          'after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform',
          'peer-checked:after:translate-x-4',
          checked ? 'bg-primary' : 'bg-input',
          className
        )}
      />
    </label>
  )
);

Switch.displayName = 'Switch';

export { Switch };
