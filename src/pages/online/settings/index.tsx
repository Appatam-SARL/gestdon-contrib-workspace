import { getFileUrl, uploadFile } from '@/api/file.api';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  useDeleteContributor,
  useGetContributorById,
  useUpdateContributor,
} from '@/hook/contributors.hook';
import { IContributor } from '@/interface/contributor';
import useContributorStore from '@/store/contributor.store';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Dropzone from 'shadcn-dropzone';

const Settings = () => {
  const contributorId = useContributorStore((state) => state.contributor?._id);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const { isLoading, isRefetching, data } = useGetContributorById(
    contributorId as string
  );

  const mutationDelete = useDeleteContributor();
  const updateContributorMutation = useUpdateContributor();

  const contributorData: IContributor | undefined = data?.data as
    | IContributor
    | undefined;

  useEffect(() => {
    if (!contributorData?.logo) return;
    getFileUrl(contributorData?.logo.fileId as string).then(setLogoUrl);
  }, [contributorData]);

  const handleDropLogo = async (acceptedFiles: File[]) => {
    try {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      const res = await uploadFile(formData, 'logo');
      if (res.success && res.filesData.length > 0) {
        const { fileId, fileUrl } = res.filesData[0];
        // Mettre à jour le contributor avec le nouveau logo (si API dispo)
        if (contributorId) {
          updateContributorMutation.mutate({
            id: contributorId,
            contributor: {
              logo: { fileId, fileUrl },
            },
          });
        }
        // Mettre à jour l'aperçu local
        const previewUrl = await getFileUrl(fileId);
        setLogoUrl(previewUrl);
        setIsLogoModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
                <Label className='block text-sm font-semibold text-gray-700'>
                  Nom de l'organisation
                </Label>
                <p className='mt-1 text-gray-900'>
                  {contributorData?.name || 'N/A'}
                </p>
              </div>
              <div>
                <Label className='block text-sm font-semibold text-gray-700'>
                  Projet ID
                </Label>
                <p className='mt-1 text-gray-900 break-all'>
                  {contributorData?._id || 'N/A'}
                </p>
              </div>
              {contributorData?.email && (
                <div>
                  <Label className='block text-sm font-semibold text-gray-700'>
                    Adresse email
                  </Label>
                  <p className='mt-1 text-gray-900'>{contributorData.email}</p>
                </div>
              )}
              {contributorData?.phoneNumber && (
                <div>
                  <Label className='block text-sm font-semibold text-gray-700'>
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
                    <Label className='block text-sm font-semibold text-gray-700'>
                      Pays
                    </Label>
                    <p className='mt-1 text-gray-900'>
                      {contributorData.address.country || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className='block text-sm font-semibold text-gray-700'>
                      Rue
                    </Label>
                    <p className='mt-1 text-gray-900'>
                      {contributorData.address.street || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className='block text-sm font-semibold text-gray-700'>
                      Code Postal
                    </Label>
                    <p className='mt-1 text-gray-900'>
                      {contributorData.address.postalCode || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className='block text-sm font-semibold text-gray-700'>
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
                <Dialog open={isLogoModalOpen} onOpenChange={setIsLogoModalOpen}>
                  <DialogTrigger asChild>
                    <Button className='ml-2' variant='outline'>
                      Ajouter le logo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Uploader le logo</DialogTitle>
                    </DialogHeader>
                    <div>
                      <Dropzone onDrop={handleDropLogo} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
