import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IActivity, IActivityFilterForm } from '@/interface/activity';
import React, { useEffect, useState } from 'react';

interface FilterActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: IActivityFilterForm;
  onFilterChange: (key: keyof IActivityFilterForm, value: any) => void;
}

const FilterActivityModal: React.FC<FilterActivityModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}) => {
  const [tempFilters, setTempFilters] = useState<IActivityFilterForm>(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      [id]: value === '' ? undefined : value,
    }));
  };

  const handleSelectChange = (value: string, id: string) => {
    setTempFilters((prev) => {
      if (id === 'status') {
        return {
          ...prev,
          status: value === 'all' ? undefined : (value as IActivity['status']),
        };
      }
      return {
        ...prev,
        [id]: value === '' ? undefined : value,
      };
    });
  };

  const handleApplyFilters = () => {
    const parsedFilters: IActivityFilterForm = {
      ...tempFilters,
      entity_id: tempFilters.entity_id
        ? Number(tempFilters.entity_id)
        : undefined,
      created_by: tempFilters.created_by
        ? Number(tempFilters.created_by)
        : undefined,
      activity_type_id: tempFilters.activity_type_id
        ? Number(tempFilters.activity_type_id)
        : undefined,
      status: tempFilters.status,
    };

    for (const key in parsedFilters) {
      if (Object.prototype.hasOwnProperty.call(parsedFilters, key)) {
        onFilterChange(
          key as keyof IActivityFilterForm,
          (parsedFilters as any)[key]
        );
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Filter Activities</DialogTitle>
          <DialogDescription>
            Modifiez les filtres de recherche pour trouver les activités
            correspondantes.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='status' className='text-right'>
              Status
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, 'status')}
              value={
                tempFilters.status === undefined ? 'all' : tempFilters.status
              }
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Select a status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='Draft'>Draft</SelectItem>
                <SelectItem value='Approved'>Approved</SelectItem>
                <SelectItem value='Rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='entity_id' className='text-right'>
              Entity ID
            </Label>
            <Input
              id='entity_id'
              value={tempFilters.entity_id || ''}
              onChange={handleChange}
              className='col-span-3'
              type='number'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='created_by' className='text-right'>
              Created By
            </Label>
            <Input
              id='created_by'
              value={tempFilters.created_by || ''}
              onChange={handleChange}
              className='col-span-3'
              type='number'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='activity_type_id' className='text-right'>
              Activity Type ID
            </Label>
            <Input
              id='activity_type_id'
              value={tempFilters.activity_type_id || ''}
              onChange={handleChange}
              className='col-span-3'
              type='number'
            />
          </div>
        </div>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </DialogContent>
    </Dialog>
  );
};

export default FilterActivityModal;
