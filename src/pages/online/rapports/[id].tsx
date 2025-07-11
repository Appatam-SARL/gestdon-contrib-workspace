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
import { Badge } from '@/components/ui/badge';
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
  DialogTrigger,
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
import { useCreateConversation } from '@/hook/conversation.hook';
import {
  useArchiveReport,
  useDeleteReport,
  useRefuseReport,
  useReport,
  useUpdateReport,
  useValidateReport,
} from '@/hook/report.hook';
import {
  createConversationSchema,
  FormCreateConversationSchema,
} from '@/schema/conversation.schema';
import {
  createReportSchema,
  FormCreateReportSchema,
  FormRefusedReportSchema,
  refusedReportSchema,
} from '@/schema/report.schema';
import useUserStore from '@/store/user.store';
import { helperUserPermission } from '@/utils';
import { displayStatusReport } from '@/utils/display-of-variable';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Archive,
  CircleSlash,
  Edit,
  Loader2,
  MessageCircleMore,
  SquareCheckBigIcon,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';

export const ReportDetailsPage = withDashboard(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useUserStore((s) => s.user);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] =
    useState<boolean>(false);
  const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState<boolean>(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] =
    useState<boolean>(false);
  const [isOpenConversation, setIsOpenConversation] = useState<boolean>(false);

  const {
    data: reportResponse,
    isLoading,
    isError,
    error,
  } = useReport(id as string);

  const deleteMutation = useDeleteReport(() => navigate('/repport'));
  const updateMutation = useUpdateReport(id as string, setIsEditDialogOpen);
  const validateMutation = useValidateReport(
    id as string,
    setIsValidateDialogOpen
  );
  const refuseMutation = useRefuseReport(id as string, setIsRefuseDialogOpen);
  const archiveMutation = useArchiveReport(
    id as string,
    setIsArchiveDialogOpen
  );
  const mutationCreateConversation = useCreateConversation();

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

  const formRefuseReport = useForm<FormRefusedReportSchema>({
    resolver: zodResolver(refusedReportSchema),
    defaultValues: {
      motif: '',
    },
  });

  const formCreateConversation = useForm<FormCreateConversationSchema>({
    resolver: zodResolver(createConversationSchema),
    defaultValues: {
      subject: '',
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
  console.log(
    '🚀 ~ ReportDetailsPage ~ reportResponse:',
    helperUserPermission('Rapports', 'create')
  );

  const report = reportResponse?.data;

  if (!report) {
    return <div className='text-muted-foreground'>Rapport non trouvé.</div>;
  }

  const handleDelete = () => {
    deleteMutation.mutate(id as string);
  };

  const handleValidate = () => {
    const payload = {
      validateBy: user?._id as string,
    };
    validateMutation.mutate(payload);
  };

  const handleRefuse = (data: FormRefusedReportSchema) => {
    refuseMutation.mutate(data);
    formRefuseReport.reset();
  };

  const handleEdit = (data: FormCreateReportSchema) => {
    const payload = {
      ...data,
      commitments: [data.commitments],
      status: 'PENDING',
    };
    updateMutation.mutate(payload);
  };

  const handleArchive = () => {
    archiveMutation.mutate();
  };

  const handleCreateConversation = (data: FormCreateConversationSchema) => {
    mutationCreateConversation.mutate({
      subject: data.subject,
      participants: [
        {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
        },
        {
          firstName: report.createdBy?.firstName,
          lastName: report.createdBy?.lastName,
          email: report.createdBy?.email,
        },
      ],
      status: 'OPEN',
    });
    formCreateConversation.reset();
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='text-3xl font-bold'>Détails du rapport</h4>
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
              {user?.role === 'EDITOR' && (
                <Button
                  variant={'outline'}
                  onClick={() => setIsEditDialogOpen(true)}
                  className='hover:bg-grey-500'
                >
                  <Edit className='h-4 w-4' />
                  <span>Modifier</span>
                </Button>
              )}
              {(user?.role === 'MANAGER' &&
                report.status !== 'VALIDATED' &&
                report.status !== 'REFUSED' &&
                report.status !== 'ARCHIVED') ||
              (user?.role === 'COORDINATOR' &&
                report.status !== 'VALIDATED' &&
                report.status !== 'REFUSED' &&
                report.status !== 'ARCHIVED') ? (
                <AlertDialog
                  open={isValidateDialogOpen}
                  onOpenChange={setIsValidateDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant={'outline'} className='hover:bg-green-500'>
                      <SquareCheckBigIcon />
                      <span>Valider</span>
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
                      <AlertDialogCancel>
                        <X />
                        <span>Non, j'annule</span>
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleValidate}
                        disabled={validateMutation.isPending}
                      >
                        {validateMutation.isPending ? (
                          <>
                            <Loader2 color='white' />
                            <span>Validation en cours...</span>
                          </>
                        ) : (
                          <>
                            <SquareCheckBigIcon color='white' />
                            <span>Oui, je valide</span>
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}

              {/* Alert Dialog Archive un rapport */}
              {(user?.role === 'MANAGER' && report.status === 'VALIDATED') ||
              (user?.role === 'COORDINATOR' &&
                report.status === 'VALIDATED') ? (
                <AlertDialog
                  open={isArchiveDialogOpen}
                  onOpenChange={setIsArchiveDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant='outline'>
                      <Archive className='h-4 w-4' />
                      <span>Archiver</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Etes-vous absolument sûr ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela archivera
                        définitivement ce rapport de nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Non, j'annule</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleArchive}
                        disabled={archiveMutation.isPending}
                      >
                        {archiveMutation.isPending ? (
                          <>
                            <Loader2 color='white' />
                            <span>Archive en cours...</span>
                          </>
                        ) : (
                          <>
                            <Archive color='white' />
                            <span>Oui, j'archive</span>
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}

              {(user?.role === 'MANAGER' &&
                report.status !== 'REFUSED' &&
                report.status !== 'VALIDATED' &&
                report.status !== 'ARCHIVED') ||
              (user?.role === 'COORDINATOR' &&
                report.status !== 'REFUSED' &&
                report.status !== 'VALIDATED' &&
                report.status !== 'ARCHIVED') ? (
                <Dialog
                  open={isRefuseDialogOpen}
                  onOpenChange={setIsRefuseDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant='outline' className='hover:bg-red-500'>
                      <CircleSlash />
                      <span>Refuser</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                      <DialogDescription>
                        Cette action ne peut pas être annulée. Cela refusera
                        définitivement ce rapport.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...formRefuseReport}>
                      <form
                        onSubmit={formRefuseReport.handleSubmit(handleRefuse)}
                        className='space-y-4'
                      >
                        <FormField
                          control={formRefuseReport.control}
                          name='motif'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Motif</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={10}
                                  placeholder='Motif'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            variant={'outline'}
                            onClick={() => setIsRefuseDialogOpen(false)}
                          >
                            Non, j'annule
                          </Button>
                          <Button
                            type='submit'
                            disabled={refuseMutation.isPending}
                          >
                            {refuseMutation.isPending ? (
                              <>
                                <Loader2 color='white' />
                                <span>Refus en cours...</span>
                              </>
                            ) : (
                              <>
                                <CircleSlash color='white' />
                                <span>Oui, je refuse</span>
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              ) : null}
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogContent className='sm:max-w-[500px] h-[600px] overflow-auto'>
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
              {helperUserPermission('Rapports', 'delete') && (
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive'>
                      <Trash2 className='h-4 w-4' />
                      <span>Supprimer</span>
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
                      <AlertDialogCancel>
                        <X />
                        <span>Non, j'annule</span>
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <>
                            <Loader2 color='white' />
                            <span>Suppression...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 color='white' />
                            <span>Oui, je supprime</span>
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {/* <Button onClick={() => setIsOpenConversation(true)}>
                <MessageCircleMore />
                <span>Ouvrir une conversation avec le rapporteur</span>
              </Button> */}
              {/* Alert Dialog Open a conversation */}
              {(user?.role === 'MANAGER' && report.status === 'REFUSED') ||
              (user?.role === 'COORDINATOR' && report.status === 'REFUSED') ? (
                <Dialog
                  open={isOpenConversation}
                  onOpenChange={setIsOpenConversation}
                >
                  <DialogTrigger asChild>
                    <Button variant='outline' className='hover:bg-gray-300'>
                      <MessageCircleMore />
                      <span>Ouvrir une conversation</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ouverture d'une conversation</DialogTitle>
                      <DialogDescription>
                        Cette action ne peut pas être annulée. Cela ouvrira
                        définitivement une conversation avec le rapporteur.
                      </DialogDescription>
                    </DialogHeader>
                    {/* <DialogContent> */}
                    <Form {...formCreateConversation}>
                      <form
                        onSubmit={formCreateConversation.handleSubmit(
                          handleCreateConversation
                        )}
                        className='space-y-4'
                      >
                        <FormField
                          control={formCreateConversation.control}
                          name='subject'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Saississez le sujet de la conversation
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type='text'
                                  placeholder='Sujet'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            variant='outline'
                            onClick={() => setIsOpenConversation(false)}
                            disabled={mutationCreateConversation.isPending}
                          >
                            Non, j'annule
                          </Button>
                          <Button
                            type='submit'
                            disabled={mutationCreateConversation.isPending}
                          >
                            {mutationCreateConversation.isPending ? (
                              <>
                                <Loader2 className='animate-spin' />
                                <span>Ouverture de la conversation...</span>
                              </>
                            ) : (
                              <>
                                <MessageCircleMore color='white' />
                                <span>Oui, je ouvre une conversation</span>
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                    {/* </DialogContent> */}
                  </DialogContent>
                </Dialog>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{report.name}</CardTitle>
          <CardDescription>
            Type d'entité: <Badge variant='outline'>{report.entityType}</Badge>
            <div>
              <p className='text-sm font-medium'>Statut:</p>
              <Badge
                variant={
                  displayStatusReport(report?.status as string) === 'Validé'
                    ? 'success'
                    : displayStatusReport(report?.status as string) ===
                      'Archivé'
                    ? 'warning'
                    : displayStatusReport(report?.status as string) === 'Refusé'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                <span
                  className={
                    displayStatusReport(report?.status as string) === 'Validé'
                      ? 'text-success'
                      : displayStatusReport(report?.status as string) ===
                        'Archivé'
                      ? 'text-warning'
                      : displayStatusReport(report?.status as string) ===
                        'Refusé'
                      ? 'text-white'
                      : 'text-dark'
                  }
                >
                  {displayStatusReport(report?.status as string) === 'Validé'
                    ? '✅ Validé'
                    : displayStatusReport(report?.status as string) ===
                      'Archivé'
                    ? '📦 Archivé'
                    : displayStatusReport(report?.status as string) === 'Refusé'
                    ? '❌ Rejeté'
                    : '🕐 En attente'}
                </span>
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-sm font-medium'>Description:</p>
            <p className='text-sm text-justify'>{report.description}</p>
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
          {report.motif && (
            <div className='space-y-2 border-t pt-4 mt-4'>
              <h3 className='text-lg font-semibold'>Motif</h3>
              <div>
                <p className='text-sm font-medium'>Motif:</p>
                <p>{report.motif}</p>
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
});

export default ReportDetailsPage;
