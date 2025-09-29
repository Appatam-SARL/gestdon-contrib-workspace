import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import imgArrayEmpty from '@/assets/img/activityempty.png';
import { ICustomFieldOption } from '@/interface/custom-field';
import { PencilIcon, TrashIcon } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

interface CustomFieldTableProps {
  customFields: ICustomFieldOption[];
  isLoading: boolean;
  isRefetchingCustomFields: boolean;
  onEdit: (field: ICustomFieldOption) => void;
  onRemove: (fieldId: string | undefined) => void;
}

export const CustomFieldTable = ({
  customFields,
  isLoading,
  isRefetchingCustomFields,
  onEdit,
  onRemove,
}: CustomFieldTableProps) => {
  if (isLoading || isRefetchingCustomFields) {
    return (
      <div className='p-4'>
        <Skeleton
          count={1}
          style={{
            height: '300px',
            width: '100%',
          }}
        />
      </div>
    );
  }

  const hasOptions = customFields.some(
    (field) => field.options && field.options.length > 0
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Libellé</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Requis</TableHead>
          {hasOptions && <TableHead>Options</TableHead>}
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customFields.length > 0 ? (
          customFields.map((field) => (
            <TableRow key={field._id || field.name}>
              <TableCell className='font-medium'>{field.name}</TableCell>
              <TableCell>{field.label}</TableCell>
              <TableCell>{field.type}</TableCell>
              <TableCell>{field.required ? 'Oui' : 'Non'}</TableCell>
              {hasOptions && (
                <TableCell>
                  {field.options ? field.options.join(', ') : '-'}
                </TableCell>
              )}
              <TableCell className='text-right'>
                {/* <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onEdit(field)}
                  className='mr-2'
                  aria-label={`Modifier le champ ${field.name}`}
                >
                  <PencilIcon />
                </Button> */}
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => onRemove(field._id)}
                  aria-label={`Supprimer le champ ${field.name}`}
                >
                  <TrashIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={hasOptions ? 6 : 5} className='text-center'>
              <div className='flex flex-col items-center justify-center'>
                <img src={imgArrayEmpty} alt='empty' className='w-1/4 h-1/2' />
                <p className='text-gray-500'>Aucun champ personnalisé n'a encore été ajouté.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
