import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export function HelpButton() {
  const handleHelpClick = () => {
    // Implement help functionality here (e.g., open a help dialog, navigate to help page)
    console.log('Help button clicked');
    alert('Help functionality not yet implemented.');
  };

  return (
    <Button variant='outline' onClick={handleHelpClick}>
      <HelpCircle className='h-[1.2rem] w-[1.2rem]' />
    </Button>
  );
}
