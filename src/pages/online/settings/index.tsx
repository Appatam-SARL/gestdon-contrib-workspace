import { getFileUrl } from '@/api/file.api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  useDeleteContributor,
  useGetContributorById,
} from '@/hook/contributors.hook';
import { IContributor } from '@/interface/contributor';
import useContributorStore from '@/store/contributor.store';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const Settings = () => {
  const contributorId = useContributorStore((state) => state.contributor?._id);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const { isLoading, isRefetching, data } = useGetContributorById(
    contributorId as string
  );

  const mutationDelete = useDeleteContributor();

  const contributorData: IContributor | undefined = data?.data as
    | IContributor
    | undefined;

  useEffect(() => {
    if (!contributorData?.logo) return;
    getFileUrl(contributorData?.logo.fileId as string).then(setLogoUrl);
  }, [contributorData]);

  return (
    <>
      <h4 className='text-3xl font-bold mb-8'>Paramètres du compte</h4>

      {/* General Settings Section */}
      <div className='bg-white p-6 rounded-lg shadow mb-8'>
        <h4 className='text-xl font-semibold mb-4'>
          Information générale de votre compte
        </h4>
        {isLoading || isRefetching ? (
          <div>
            <Skeleton count={1} height={300} className='w-full' />
          </div>
        ) : (
          <div>
            {/* Contributor Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div>
                <Label className='block text-sm font-medium text-gray-700'>
                  Nom de l'organisation
                </Label>
                <p className='mt-1 text-gray-900'>
                  {contributorData?.name || 'N/A'}
                </p>
              </div>
              <div>
                <Label className='block text-sm font-medium text-gray-700'>
                  Projet ID
                </Label>
                <p className='mt-1 text-gray-900 break-all'>
                  {contributorData?._id || 'N/A'}
                </p>
              </div>
              {contributorData?.email && (
                <div>
                  <Label className='block text-sm font-medium text-gray-700'>
                    Adresse email
                  </Label>
                  <p className='mt-1 text-gray-900'>{contributorData.email}</p>
                </div>
              )}
              {contributorData?.phoneNumber && (
                <div>
                  <Label className='block text-sm font-medium text-gray-700'>
                    Téléphone
                  </Label>
                  <p className='mt-1 text-gray-900'>
                    {contributorData.phoneNumber}
                  </p>
                </div>
              )}

              {/* Address Information */}
              {contributorData?.address && (
                <div className='col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label className='block text-sm font-medium text-gray-700'>
                      Pays
                    </Label>
                    <p className='mt-1 text-gray-900'>
                      {contributorData.address.country || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className='block text-sm font-medium text-gray-700'>
                      Rue
                    </Label>
                    <p className='mt-1 text-gray-900'>
                      {contributorData.address.street || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className='block text-sm font-medium text-gray-700'>
                      Code Postal
                    </Label>
                    <p className='mt-1 text-gray-900'>
                      {contributorData.address.postalCode || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className='block text-sm font-medium text-gray-700'>
                      Ville
                    </Label>
                    <p className='mt-1 text-gray-900'>
                      {contributorData.address.city || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Logo Section */}
            <div className='border-t pt-6 mt-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Logo de l'organisation
              </h3>
              <div className='flex items-center space-x-4'>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`Organization Logo ${logoUrl}`}
                    className='h-32 w-32 object-cover rounded-md'
                    loading='lazy'
                  />
                ) : (
                  <div className='h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm'>
                    No Logo
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Restart Project Section */}
      <div className='bg-white p-6 rounded-lg shadow mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Suprimer votre compte</h2>
        <p className='text-gray-700 mb-4'>
          En supprimant votre compte, vous perdrez toutes les données associées
          à votre compte.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>Supprimer mon compte</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                En supprimant votre compte, vous perdrez toutes les données
                associées à votre compte.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                style={{
                  backgroundColor: 'oklch(0.577 0.245 27.325)',
                }}
                onClick={() => mutationDelete.mutate(contributorId as string)}
              >
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Settings;
