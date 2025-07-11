import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetActivityType } from '@/hook/activity-type.hook';
import { IActivity, IActivityFilterForm } from '@/interface/activity';
import { IActivityType } from '@/interface/activity-type';
import useContributorStore from '@/store/contributor.store';
import { addDays } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';

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
  const contributorId = useContributorStore((s) => s.contributor?._id);

  const { isLoading: isLoadingActivityType, data: activityType } =
    useGetActivityType({ contributorId: contributorId as string });

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

  const handleDateChange = ({ from, to }: { from: string; to: string }) => {
    setTempFilters((prev) => ({
      ...prev,
      period: {
        from,
        to,
      },
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
      activityTypeId: tempFilters.activityTypeId
        ? tempFilters.activityTypeId
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
      <DialogContent className='sm:max-w-[630px]'>
        <DialogHeader>
          <DialogTitle>Filter Activities</DialogTitle>
          <DialogDescription>
            Modifiez les filtres de recherche pour trouver les activités
            correspondantes.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div>
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
                <SelectValue placeholder='Selectionner un statut' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tous</SelectItem>
                <SelectItem value='Draft'>Brouillon</SelectItem>
                <SelectItem value='Approved'>Validé</SelectItem>
                <SelectItem value='Rejected'>Rejeté</SelectItem>
                <SelectItem value='Archived'>Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='activityTypeId' className='text-right'>
              Type d'activité
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange(value, 'activityTypeId')
              }
              value={tempFilters.activityTypeId}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder="Selectionner un type d\'activité" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingActivityType ? (
                  <SelectItem value='all'>Loading...</SelectItem>
                ) : (
                  activityType?.data?.map((activityType: IActivityType) => (
                    <SelectItem key={activityType._id} value={activityType._id}>
                      {activityType.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <DateRangePicker
              locale={fr}
              ranges={[
                {
                  startDate: tempFilters.period?.from
                    ? new Date(tempFilters.period.from)
                    : new Date(),
                  endDate: tempFilters.period?.to
                    ? new Date(tempFilters.period.to)
                    : addDays(new Date(), 7),
                  key: 'selection',
                },
              ]}
              onChange={(item) => {
                handleDateChange({
                  from: item.selection.startDate?.toISOString() || '',
                  to: item.selection.endDate?.toISOString() || '',
                });
              }}
            />
          </div>
        </div>
        <Button onClick={handleApplyFilters}>
          <Filter />
          <span>Filtre</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FilterActivityModal;
