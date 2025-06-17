import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IAudience, IAudienceFilterForm } from '@/interface/audience';
import { displayStatusAudience } from '@/utils/display-of-variable';
import { Edit, Eye, Trash2 } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

interface AudienceTableProps {
  audiences: IAudience[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  setFilters: (filters: IAudienceFilterForm) => void;
}

export const AudienceTable: React.FC<AudienceTableProps> = ({
  audiences,
  isLoading,
  isRefetching,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  setFilters,
}) => {
  console.log('🚀 ~ totalPages:', totalPages);
  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || isRefetching ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center py-8'>
                <Skeleton count={5} height={40} />
              </TableCell>
            </TableRow>
          ) : audiences && audiences.length > 0 ? (
            audiences.map((audience) => (
              <TableRow key={audience._id}>
                <TableCell className='font-medium'>{audience.title}</TableCell>
                <TableCell>
                  {audience.description.substring(0, 100) + '...'}
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>
                    {audience.type === 'normal' ? 'Normale' : 'Représentant'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      audience.status === 'REFUSED'
                        ? 'destructive'
                        : audience.status === 'VALIDATED'
                        ? 'success'
                        : audience.status === 'ARCHIVED'
                        ? 'warning'
                        : 'secondary'
                    }
                  >
                    {displayStatusAudience(audience.status || '')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(audience.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onView(audience._id)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(audience._id)}
                    >
                      <Edit className='h-4 w-4' color={'blue'} />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onDelete(audience._id)}
                    >
                      <Trash2 className='h-4 w-4' color='red' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className='text-center py-8'>
                Aucune audience trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className='p-4 border-t'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                className={
                  currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
                onClick={() => setFilters({ page: currentPage - 1 })}
                size='sm'
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <Button
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => setFilters({ page: i + 1 })}
                  size='sm'
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href='#'
                size='sm'
                onClick={() => setFilters({ page: currentPage + 1 })}
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
