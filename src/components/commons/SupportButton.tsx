import { HeadsetIcon, X } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '../ui/dialog';

function SupportButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant='outline' onClick={() => setOpen(true)}>
        <HeadsetIcon className='h-[1.2rem] w-[1.2rem]' />
        <span className='relative flex size-3'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75'></span>
          <span className='relative inline-flex size-3 rounded-full bg-sky-500'></span>
        </span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='bg-white'>
          <DialogTitle>Support</DialogTitle>
          <DialogDescription>
            A partir de ce modal, vous pouvez contacter le support de l'espace
            Appatam.
          </DialogDescription>
          <div className='w-full flex flex-col justify-between items-start gap-4'>
            <p>
              Si vous avez des questions, vous pouvez contacter le support de
              l'espace Appatam.
            </p>
            <div className='flex gap-2 w-full border border-gray-300 rounded-md p-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Email :
                </p>
                <a href='mailto:contact@appatam.com'>contact@appatam.com</a>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Téléphone{' '}
                </p>
                <a href='tel:+33682939001'>+33682939001</a>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              <X />
              <span>Fermer</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default React.memo(SupportButton);
