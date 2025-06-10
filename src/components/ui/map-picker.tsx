import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MapPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (location: Location) => void;
  title: string;
}

export function MapPicker({ open, onClose, onSelect, title }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Simulation de points sur la carte
  const mockLocations: Location[] = [
    {
      name: 'Restaurant La Paix',
      address: 'Rue du Commerce, Plateau',
      coordinates: { lat: 5.3418, lng: -4.0305 },
    },
    {
      name: 'Pharmacie des II Plateaux',
      address: 'Boulevard des II Plateaux',
      coordinates: { lat: 5.3578, lng: -4.0147 },
    },
    {
      name: 'Pharmacie des II Plateaux',
      address: 'Boulevard des II Plateaux',
      coordinates: { lat: 5.3578, lng: -4.0147 },
    },
    {
      name: 'Restaurant La Paix',
      address: 'Rue du Commerce, Plateau',
      coordinates: { lat: 5.3418, lng: -4.0305 },
    },
    {
      name: 'Pharmacie des II Plateaux',
      address: 'Boulevard des II Plateaux',
      coordinates: { lat: 5.3578, lng: -4.0147 },
    },
  ];

  const filteredLocations = mockLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Rechercher un lieu...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
          <div className='grid grid-cols-2 gap-4 h-[400px]'>
            {/* Zone de carte (à implémenter avec une vraie carte) */}
            <div className='rounded-lg border bg-muted/30'>
              <div className='h-full flex items-center justify-center text-muted-foreground'>
                Carte à implémenter
              </div>
            </div>
            {/* Liste des résultats */}
            <div className='space-y-2 overflow-auto max-h-[400px]'>
              {filteredLocations.map((location) => (
                <div
                  key={location.name}
                  className='p-3 rounded-lg border hover:bg-muted/50 cursor-pointer'
                  onClick={() => {
                    onSelect(location);
                    onClose();
                  }}
                >
                  <h3 className='font-medium'>{location.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {location.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
