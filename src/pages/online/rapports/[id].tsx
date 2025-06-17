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
  useDeleteReport,
  useRefuseReport,
  useReport,
  useUpdateReport,
  useValidateReport,
} from '@/hook/report.hook';
import {
  createReportSchema,
  FormCreateReportSchema,
} from '@/schema/report.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';

export const ReportDetailsPage = withDashboard(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: reportResponse,
    isLoading,
    isError,
    error,
  } = useReport(id as string);

  const deleteMutation = useDeleteReport(() => navigate('/repport'));
  const updateMutation = useUpdateReport(id as string, () =>
    setIsEditDialogOpen(false)
  );
  const validateMutation = useValidateReport(id as string, () =>
    setIsValidateDialogOpen(false)
  );
  const refuseMutation = useRefuseReport(id as string, () =>
    setIsRefuseDialogOpen(false)
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
  const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);

  const formEditReport = useForm<FormCreateReportSchema>({
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

  useEffect(() => {
    if (reportResponse?.data) {
      const report = reportResponse.data;
      formEditReport.reset({
        name: report.name || '',
        description: report.description || '',
        commitments: {
          action: report.commitments?.[0]?.action || '',
          responsible: {
            firstName: report.commitments?.[0]?.responsible?.firstName || '',
            lastName: report.commitments?.[0]?.responsible?.lastName || '',
          },
          dueDate: report.commitments?.[0]?.dueDate
            ? new Date(report.commitments[0].dueDate)
                .toISOString()
                .split('T')[0]
            : '',
        },
      });
    }
  }, [reportResponse, formEditReport]);

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
        {error?.message || `Impossible de charger les détails du rapport.`}
      </div>
    );
  }

  const report = reportResponse?.data;

  if (!report) {
    return <div className='text-muted-foreground'>Rapport non trouvé.</div>;
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

  const handleRefuse = () => {
    if (id) {
      refuseMutation.mutate(id);
    }
  };

  const handleEdit = (data: FormCreateReportSchema) => {
    if (id) {
      const payload = {
        ...data,
        commitments: [data.commitments],
      };
      updateMutation.mutate(payload);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Détails du rapport</h1>
          <p className='text-muted-foreground'>
            Informations détaillées du rapport
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => navigate(`/repport`)} variant={'link'}>
            retour
          </Button>
        </div>
      </div>

      <Card className='space-y-4'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <Button onClick={() => setIsEditDialogOpen(true)}>
                <Edit className='h-4 w-4' />
              </Button>
              <AlertDialog
                open={isValidateDialogOpen}
                onOpenChange={setIsValidateDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button style={{ backgroundColor: '#00B87C' }}>
                    Valider
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous absolument sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela validera
                      définitivement ce rapport.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Fermer</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleValidate}
                      disabled={validateMutation.isPending}
                    >
                      {validateMutation.isPending
                        ? 'Validation en cours...'
                        : 'Valider'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog
                open={isRefuseDialogOpen}
                onOpenChange={setIsRefuseDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant='secondary' className='bg-red-500 text-white'>
                    Refuser
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous absolument sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela refusera
                      définitivement ce rapport.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Fermer</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRefuse}
                      disabled={refuseMutation.isPending}
                    >
                      {refuseMutation.isPending
                        ? 'Refus en cours...'
                        : 'Refuser'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>Modifier le rapport</DialogTitle>
                    <DialogDescription>
                      Mettez à jour les informations du rapport.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Form {...formEditReport}>
                      <form onSubmit={formEditReport.handleSubmit(handleEdit)}>
                        <FormField
                          control={formEditReport.control}
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
                          control={formEditReport.control}
                          name='description'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={10}
                                  placeholder='Description'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Card className='mt-4'>
                          <CardHeader>
                            <CardTitle>Engagements</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <FormField
                              control={formEditReport.control}
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
                              control={formEditReport.control}
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
                              control={formEditReport.control}
                              name='commitments.responsible.lastName'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Prenom du responsable</FormLabel>
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
                              control={formEditReport.control}
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
                        <DialogFooter className='mt-4'>
                          <Button
                            type='submit'
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? (
                              <>
                                <Loader2 className='animate-spin' />
                                <span>Mise à jour...</span>
                              </>
                            ) : (
                              'Sauvegarder les modifications'
                            )}
                          </Button>
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
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous absolument sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela supprimera
                      définitivement ce rapport de nos serveurs.
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{report.name}</CardTitle>
          <CardDescription>Type d'entité: {report.entityType}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-sm font-medium'>Description:</p>
            <p className='text-sm text-justify'>{report.description}</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Statut:</p>
            <p>{report.status}</p>
          </div>
          {report.createdBy && (
            <div className='space-y-2 border-t pt-4 mt-4'>
              <h3 className='text-lg font-semibold'>Rédigé par</h3>
              <div>
                <p className='text-sm font-medium'>Prénom:</p>
                <p>{report.createdBy.firstName}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Nom:</p>
                <p>{report.createdBy.lastName}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Email:</p>
                <p>{report.createdBy.email}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Téléphone:</p>
                <p>{report.createdBy.phone}</p>
              </div>
            </div>
          )}
          {report.commitments && report.commitments.length > 0 && (
            <div className='space-y-2 border-t pt-4 mt-4'>
              <h3 className='text-lg font-semibold'>Engagements</h3>
              {report.commitments.map((commitment, index) => (
                <div key={index} className='space-y-1'>
                  <div>
                    <p className='text-sm font-medium'>Action:</p>
                    <p>{commitment.action}</p>
                  </div>
                  {commitment.responsible && (
                    <div>
                      <p className='text-sm font-medium'>Responsable:</p>
                      <p>
                        {commitment.responsible.firstName}{' '}
                        {commitment.responsible.lastName}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className='text-sm font-medium'>Date d'échéance:</p>
                    <p>
                      {commitment.dueDate
                        ? new Date(commitment.dueDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {report.followUps && report.followUps.length > 0 && (
            <div className='space-y-2 border-t pt-4 mt-4'>
              <h3 className='text-lg font-semibold'>Suivis</h3>
              {report.followUps.map((followUp, index) => (
                <div key={index} className='space-y-1'>
                  <div>
                    <p className='text-sm font-medium'>Statut:</p>
                    <p>{followUp.status}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Prochain rappel:</p>
                    <p>
                      {followUp.nextReminder
                        ? new Date(followUp.nextReminder).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {report.documents && report.documents.length > 0 && (
            <div className='space-y-2 border-t pt-4 mt-4'>
              <h3 className='text-lg font-semibold'>Documents</h3>
              {report.documents.map((document, index) => (
                <div key={index} className='space-y-1'>
                  <div>
                    <p className='text-sm font-medium'>Type:</p>
                    <p>{document.type}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>URL:</p>
                    <a
                      href={document.fileUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 underline'
                    >
                      {document.fileUrl}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div>
            <p className='text-sm font-medium'>Créé le:</p>
            <p>{new Date(report.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Mis à jour le:</p>
            <p>{new Date(report.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default ReportDetailsPage;
