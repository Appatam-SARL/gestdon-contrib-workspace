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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { withDashboard } from '@/hoc/withDashboard';
import {
  useArchiveAudience,
  useAudience,
  useDeleteAudience,
  useReportAudience,
  // useReportAudience,
  useValidateAudience,
} from '@/hook/audience.hook';
import { useCreateReport } from '@/hook/report.hook';
import {
  FormReportAudienceSchema,
  reportAudienceSchema,
} from '@/schema/audience.schema';
import {
  createReportSchema,
  FormCreateReportSchema,
} from '@/schema/report.schema';
import useContributorStore from '@/store/contributor.store';
import useUserStore from '@/store/user.store';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarDays,
  Check,
  Edit,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';

export const AudienceDetailsPage = withDashboard(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // hook de récupération de l'audience
  const {
    data: audienceResponse,
    isLoading,
    isError,
    error,
  } = useAudience(id as string);
  // state zustand store
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const user = useUserStore((s) => s.user);

  // hook de mutation
  const deleteMutation = useDeleteAudience(() => navigate('/audiences'));
  const validateMutation = useValidateAudience(() => navigate('/audiences'));
  const archiveMutation = useArchiveAudience(() => navigate('/audiences'));
  const reportMutation = useReportAudience(() => navigate('/audiences'));
  const createReportMutation = useCreateReport(() => navigate('/audiences')); // hook de création d'un rapport pour l'audience

  const [files, setFiles] = useState<File[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
  const [isReporterDialogOpen, setIsReporterDialogOpen] = useState(false);
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const formReport = useForm<FormReportAudienceSchema>({
    resolver: zodResolver(reportAudienceSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  });

  const formAddReport = useForm<FormCreateReportSchema>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      name: '',
      description: '',
      commitments: {
        action: '',
        responsible: {
          firstName: '',
          lastName: '',
        },
        dueDate: '',
      },
      documents: [],
    },
  });

  const onSubmitReport = async (data: FormReportAudienceSchema) => {
    console.log('Audience:', data);
    const payload = {
      ...data,
      contributorId: contributorId as string,
    };
    reportMutation.mutate(payload);
  };

  const onSubmitAddReport = async (data: FormCreateReportSchema) => {
    const payload = {
      ...data,
      entityType: 'AUDIENCE',
      entityId: id as string,
      commitments: [data.commitments],
      contributorId: contributorId as string,
      followUps: [
        {
          status: 'PENDING',
          nextReminder: data.commitments.dueDate,
        },
      ],
      createdBy: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        phone: user?.phone,
        email: user?.email,
      },
    };
    createReportMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton height={50} width='100%' />
        <Card>
          <CardHeader>
            <Skeleton height={30} width='60%' />
            <Skeleton height={20} width='80%' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton height={20} width='100%' count={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-red-500'>
        Erreur:{' '}
        {error?.message || `Impossible de charger les détails de l\'audience.`}
      </div>
    );
  }

  const audience = audienceResponse?.data;

  if (!audience) {
    return <div className='text-muted-foreground'>Audience non trouvée.</div>;
  }

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  const handleValidate = () => {
    if (id) {
      validateMutation.mutate(id);
    }
  };

  const handleArchive = () => {
    if (id) {
      archiveMutation.mutate(id);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Détails de l'audience</h1>
          <p className='text-muted-foreground'>
            Informations détaillées de l'audience
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => navigate(`/audiences`)} variant={'link'}>
            retour
          </Button>
        </div>
      </div>

      <Card className='space-y-4'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <Button
                onClick={() => navigate(`/audiences/${audience._id}/edit`)}
              >
                <Edit className='h-4 w-4' />
                {/* <span>l'audience</span> */}
              </Button>
              <AlertDialog
                open={isValidateDialogOpen}
                onOpenChange={setIsValidateDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button style={{ backgroundColor: '#00B87C' }}>
                    <Check className='h-4 w-4' />
                    {/* <span>l'audience</span> */}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous absolument sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela validera
                      définitivement cette audience de nos serveurs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Fermer</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleValidate}
                      disabled={validateMutation.isPending}
                    >
                      {validateMutation.isPending
                        ? 'validation en cours...'
                        : 'Valider'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                variant={'outline'}
                size={'icon'}
                className='text-yellow-400'
                onClick={() => setIsReporterDialogOpen(true)}
              >
                <CalendarDays className='h-4 w-4' />
              </Button>
              {/* Dialog reporter */}
              <Dialog
                open={isReporterDialogOpen}
                onOpenChange={setIsReporterDialogOpen}
              >
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>Reporter à une date ultérieure</DialogTitle>
                    <DialogDescription>Reporter une audience</DialogDescription>
                  </DialogHeader>
                  <div>
                    <Form {...formReport}>
                      <form onSubmit={formReport.handleSubmit(onSubmitReport)}>
                        <FormField
                          control={formReport.control}
                          name='startDate'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de début</FormLabel>
                              <FormControl>
                                <Input
                                  type='datetime-local'
                                  placeholder='Date de début'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formReport.control}
                          name='endDate'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de fin</FormLabel>
                              <FormControl>
                                <Input
                                  type='datetime-local'
                                  placeholder='Date de fin'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter className='mt-4'>
                          <Button
                            type='submit'
                            disabled={reportMutation.isPending}
                          >
                            {reportMutation.isPending ? (
                              <>
                                <Loader2 className='animate-spin' />
                                <span>En cours de création...</span>
                              </>
                            ) : (
                              'Reporter'
                            )}
                          </Button>
                          {/* TODO: Implémenter la redirection vers la page de création */}
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant='destructive'>
                    <Trash2 className='h-4 w-4' />
                    {/* <span>l'audience</span> */}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous absolument sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela supprimera
                      définitivement cette audience de nos serveurs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending
                        ? 'Suppression...'
                        : 'Supprimer'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className='flex gap-2'>
              <Button
                variant={'outline'}
                onClick={() => setIsAddReportDialogOpen(true)}
              >
                Rapport d'audience
              </Button>
              {/* Dialog reporter */}
              <Dialog
                open={isAddReportDialogOpen}
                onOpenChange={setIsAddReportDialogOpen}
              >
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>Ecrivez le rapport de l'audience</DialogTitle>
                    <DialogDescription>
                      <div className='flex justify-between items-center mb-2'>
                        <div className='flex items-center gap-2'>
                          {[1, 2, 3].map((step) => (
                            <div
                              key={step}
                              className={`flex items-center ${
                                step !== 3 ? 'flex-1' : ''
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  step <= currentStep
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted-foreground/20'
                                }`}
                              >
                                {step < currentStep ? (
                                  <Check className='h-5 w-5' />
                                ) : (
                                  step
                                )}
                              </div>
                              {step !== 3 && (
                                <div
                                  className={`h-0.5 w-16 mx-2 ${
                                    step < currentStep
                                      ? 'bg-primary'
                                      : 'bg-muted-foreground/20'
                                  }`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Étape {currentStep} sur 3
                        </p>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Form {...formAddReport}>
                      <form
                        onSubmit={formAddReport.handleSubmit(onSubmitAddReport)}
                      >
                        {currentStep === 1 && (
                          <>
                            <FormField
                              control={formAddReport.control}
                              name='name'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nom du rapport</FormLabel>
                                  <FormControl>
                                    <Input
                                      type='text'
                                      placeholder='Nom du rapport'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={formAddReport.control}
                              name='description'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      rows={15}
                                      placeholder='Description'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        {currentStep === 2 && (
                          <>
                            <Card className='mt-4'>
                              <CardHeader>
                                <CardTitle>Engagements</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <FormField
                                  control={formAddReport.control}
                                  name='commitments.action'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Action</FormLabel>
                                      <FormControl>
                                        <Input
                                          type='text'
                                          placeholder='Action'
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={formAddReport.control}
                                  name='commitments.responsible.firstName'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nom du responsable</FormLabel>
                                      <FormControl>
                                        <Input
                                          type='text'
                                          placeholder='Nom'
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={formAddReport.control}
                                  name='commitments.responsible.lastName'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Prenom du responsable
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type='text'
                                          placeholder='Prénom'
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={formAddReport.control}
                                  name='commitments.dueDate'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Date d'échéance</FormLabel>
                                      <FormControl>
                                        <Input
                                          type='date'
                                          placeholder='Date'
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </CardContent>
                            </Card>
                          </>
                        )}

                        {currentStep === 3 && (
                          <>
                            <FormField
                              // control={form.control}
                              name='documents.file'
                              render={() => (
                                <FormItem>
                                  <FormLabel>
                                    Uploader le document en PDF
                                  </FormLabel>
                                  <FormControl>
                                    <div className='flex items-center gap-4'>
                                      <Input
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            // TODO: Upload file and set URL
                                            setFiles((prev) => [...prev, file]);
                                          }
                                        }}
                                        // value={document.file ? document.file : ''}
                                      />
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='icon'
                                      >
                                        <Upload className='h-4 w-4' />
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        <DialogFooter className='mt-4'>
                          <div className='flex justify-between p-4 border-t'>
                            {currentStep > 1 && (
                              <Button
                                type='button'
                                variant='outline'
                                onClick={() =>
                                  setCurrentStep((prev) => prev - 1)
                                }
                              >
                                Précédent
                              </Button>
                            )}
                            {currentStep === 3 ? (
                              <Button
                                type='submit'
                                className='ml-auto'
                                disabled={createReportMutation.isPending}
                              >
                                {createReportMutation.isPending
                                  ? 'En cours...'
                                  : 'Créer le rapport'}
                              </Button>
                            ) : (
                              <Button
                                type='button'
                                className='ml-auto'
                                onClick={() =>
                                  setCurrentStep((prev) => prev + 1)
                                }
                              >
                                Suivant
                              </Button>
                            )}
                          </div>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{audience.title}</CardTitle>
          <CardDescription>Type: {audience.type}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-sm font-medium'>Description:</p>
            <p className='text-sm text-justify'>{audience.description}</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Date de début:</p>
            <p>
              {audience.startDate
                ? new Date(audience.startDate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className='text-sm font-medium'>Date de fin:</p>
            <p>
              {audience.endDate
                ? new Date(audience.endDate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          {audience.type === 'representative' && audience.representative && (
            <div className='space-y-2 border-t pt-4 mt-4'>
              <h3 className='text-lg font-semibold'>
                Informations du représentant
              </h3>
              <div>
                <p className='text-sm font-medium'>Prénom:</p>
                <p>{audience.representative.firstName}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Nom:</p>
                <p>{audience.representative.lastName}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Email du représentant:</p>
                <p>{audience.representative.email}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>
                  Téléphone du représentant:
                </p>
                <p>{audience.representative.phone}</p>
              </div>
            </div>
          )}
          <div>
            <p className='text-sm font-medium'>Créé le:</p>
            <p>{new Date(audience.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Mis à jour le:</p>
            <p>{new Date(audience.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default AudienceDetailsPage;
