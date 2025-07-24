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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  useActivity,
  useArchiveActivity,
  useAssignActivity,
  useDeleteActivity,
  useDraftActivity,
  useRejectActivity,
  useReportActivity,
  useRepresentant,
  useValidateActivity,
} from '@/hook/activity.hook';
import { useGetStaffMembers } from '@/hook/admin.hook';
import { useCreateReport } from '@/hook/report.hook';
import { IActivity } from '@/interface/activity';
import { IReport } from '@/interface/report';
import {
  FormActivityAssignByMemberSchema,
  formActivityValidateSchema,
  formAssignRepresentative,
  FormAssignRepresentativeSchema,
  formAssignSchema,
  formRejectSchema,
  FormRejectSchema,
  FormValidateActivitySchema,
} from '@/schema/activity.schema';
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
import { IUser } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Archive,
  CalendarDays,
  Check,
  CircleSlash,
  Edit,
  Eye,
  Loader2,
  PencilLineIcon,
  Save,
  StickyNote,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

function ButtonGroupActionActivity({
  id,
  reports,
}: {
  id: string;
  reports?: {
    success?: boolean;
    data: IReport[];
    message?: string;
    metadata?: {
      total: Number;
      page: Number;
      limit: Number;
      totalPages: Number;
      hasNextPage: Boolean;
      hasPrevPage: Boolean;
    };
  };
}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const contributorId = useContributorStore((s) => s.contributor?._id);
  const user = useUserStore((s) => s.user);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] =
    useState<boolean>(false);
  const [isReporterDialogOpen, setIsReporterDialogOpen] =
    useState<boolean>(false);
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] =
    useState<boolean>(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] =
    useState<boolean>(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [isRepresentantDialogOpen, setIsRepresentantDialogOpen] =
    useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [activity, setActivity] = useState<IActivity>();
  const [files, setFiles] = useState<FileList>();

  const { data: activityResponse } = useActivity(id as string);
  const { data: members } = useGetStaffMembers({
    contributorId: contributorId,
  });

  // hook de mutation
  const reportMutation = useReportActivity(
    id as string,
    setIsReporterDialogOpen
  );
  const createReportMutation = useCreateReport(() => navigate('/activity'));
  const deleteMutation = useDeleteActivity(id as string, setIsDeleteDialogOpen);
  const validateMutation = useValidateActivity(
    id as string,
    setIsValidateDialogOpen
  );
  const archiveMutation = useArchiveActivity(
    id as string,
    setIsArchiveDialogOpen
  );
  const assignMutation = useAssignActivity(id as string, setIsAssignDialogOpen);
  const draftMutation = useDraftActivity(id as string, setIsDraftDialogOpen);
  const rejectMutation = useRejectActivity(id as string, setIsRejectDialogOpen);
  const representativeMutation = useRepresentant(
    id as string,
    setIsRepresentantDialogOpen
  );

  useLayoutEffect(() => {
    if (activityResponse?.data) {
      setActivity(activityResponse.data);
    }
  }, [activityResponse]);

  const formReport = useForm<FormReportAudienceSchema>({
    resolver: zodResolver(reportAudienceSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  });

  const formValidateActivity = useForm<FormValidateActivitySchema>({
    resolver: zodResolver(formActivityValidateSchema),
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

  const formAssign = useForm<FormActivityAssignByMemberSchema>({
    resolver: zodResolver(formAssignSchema),
    defaultValues: {
      assigneeId: '',
    },
  });

  const formReject = useForm<FormRejectSchema>({
    resolver: zodResolver(formRejectSchema),
    defaultValues: {
      motif: '',
    },
  });

  const formRepresentative = useForm<FormAssignRepresentativeSchema>({
    resolver: zodResolver(formAssignRepresentative),
    defaultValues: {
      representative: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
    },
  });

  const onSubmitReport = async (data: FormReportAudienceSchema) => {
    const payload = {
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    reportMutation.mutate(payload);
  };

  const onSubmitAddReport = async (data: FormCreateReportSchema) => {
    if (!files) return;
    if (files.length === 0) return;
    console.log('🚀 ~ onSubmitAddReport ~ files:', files);
    const payload = {
      ...data,
      entityType: 'ACTIVITY',
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
    createReportMutation.mutate({ report: payload, files });
  };
  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate();
    }
  };

  const handleArchive = () => {
    if (id) {
      archiveMutation.mutate();
    }
  };

  const handleSubmitValidate = (data: FormValidateActivitySchema) => {
    if (data.startDate > data.endDate) {
      toast({
        title: 'Erreur',
        description: 'La date de début doit être inférieure à la date de fin.',
        variant: 'destructive',
      });
    } else {
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };
      validateMutation.mutateAsync(payload);
      if (validateMutation.isSuccess) {
        formValidateActivity.reset();
      }
    }
  };

  const handleAssignActivityByMembre = async (
    data: FormActivityAssignByMemberSchema
  ) => {
    const payload = {
      assigneeId: data.assigneeId as string,
    };
    assignMutation.mutateAsync(payload);
    if (assignMutation.isSuccess) {
      assignMutation.reset();
    }
  };

  const handleDraft = () => {
    if (id) {
      draftMutation.mutate();
    }
  };

  const handleReject = (data: FormRejectSchema) => {
    if (id) {
      rejectMutation.mutate(data);
    }
  };

  const handleRepresentant = (data: FormAssignRepresentativeSchema) => {
    if (id) {
      representativeMutation.mutate(data);
    }
  };

  return (
    <ScrollArea className='w-full'>
      <div className='flex flex-wrap gap-3 items-center py-4 px-4 border border-dashed border-gray-300 rounded-lg bg-white'>
        {/* Groupe principal */}
        <div className='flex gap-2'>
          {user?.role === 'EDITOR' &&
          activity?.status !== 'Approved' &&
          activity?.status !== 'Archived' &&
          activity?.status !== 'Rejected' ? (
            <Button
              variant={'outline'}
              onClick={() => navigate(`/activity/${activity?._id}/edit`)}
            >
              <Edit className='h-4 w-4' />
              <span>Modifier l'activité</span>
            </Button>
          ) : null}
          {(user?.role === 'MANAGER' &&
            activity?.status !== 'Approved' &&
            activity?.status !== 'Archived') ||
          (user?.role === 'COORDINATOR' &&
            activity?.status !== 'Approved' &&
            activity?.status !== 'Archived') ? (
            <>
              <Button
                variant={'outline'}
                onClick={() => setIsValidateDialogOpen(true)}
              >
                <Check className='h-4 w-4' />
                <span>Valider</span>
              </Button>
              <Dialog
                open={isValidateDialogOpen}
                onOpenChange={setIsValidateDialogOpen}
              >
                <DialogContent className='bg-white'>
                  <DialogHeader>
                    <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                    <DialogDescription>
                      <span className='text-sm text-center'>
                        Cette action ne peut pas être annulée. Cela validera
                        définitivement cette audience de nos serveurs.
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formValidateActivity}>
                    <form
                      onSubmit={formValidateActivity.handleSubmit(
                        handleSubmitValidate
                      )}
                    >
                      <FormField
                        control={formValidateActivity.control}
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
                        control={formValidateActivity.control}
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
                          variant='outline'
                          onClick={() => setIsValidateDialogOpen(false)}
                        >
                          Non, j'annule
                        </Button>
                        <Button
                          type='submit'
                          disabled={validateMutation.isPending}
                          className='flex items-center justify-center bg-primary text-white px-4 rounded-md'
                        >
                          {validateMutation.isPending ? (
                            <>
                              <Loader2 className='animate-spin' />
                              <span>Validation en cours...</span>
                            </>
                          ) : (
                            <>
                              <Check className='h-4 w-4' />
                              <span>Oui, je valide</span>
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </>
          ) : null}
          {user?.role === 'MANAGER' && activity?.status === 'Approved' ? (
            <Button
              variant={'outline'}
              className='text-yellow-400'
              onClick={() => setIsReporterDialogOpen(true)}
            >
              <CalendarDays className='h-4 w-4' />
              <span>Reporter</span>
            </Button>
          ) : null}
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
                      <Button type='submit' disabled={reportMutation.isPending}>
                        {reportMutation.isPending ? (
                          <>
                            <Loader2 className='animate-spin' />
                            <span>En cours de création...</span>
                          </>
                        ) : (
                          'Reporter'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
          {(user?.role === 'MANAGER' &&
            activity?.status === 'Approved' &&
            !activity?.assigneeId &&
            !activity?.representative) ||
          (user?.role === 'COORDINATOR' &&
            activity?.status === 'Approved' &&
            !(activity?.assigneeId || activity?.representative)) ? (
            <Button
              variant={'outline'}
              onClick={() => setIsAssignDialogOpen(true)}
            >
              <UserPlus />
              <span>Assigner</span>
            </Button>
          ) : null}
          <Dialog
            open={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
          >
            <DialogContent className='sm:max-w-[500px] bg-white'>
              <DialogHeader>
                <DialogTitle>Assigner à un membre</DialogTitle>
                <DialogDescription>
                  Assigner cette activité à un membre.
                </DialogDescription>
              </DialogHeader>
              <div>
                <Form {...formAssign}>
                  <form
                    onSubmit={formAssign.handleSubmit(
                      handleAssignActivityByMembre
                    )}
                    className='grid gap-4 py-4'
                  >
                    <FormField
                      control={formAssign.control}
                      name='assigneeId'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Membre
                          </label>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Sélectionnez un membre' />
                              </SelectTrigger>
                              <SelectContent>
                                {members?.data?.map((member: IUser) => (
                                  <SelectItem
                                    key={member._id}
                                    value={member._id as string}
                                  >
                                    {member.fullName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className='mt-4'>
                      <Button type='submit' disabled={assignMutation.isPending}>
                        {assignMutation.isPending ? (
                          <>
                            <Loader2 className='animate-spin' />
                            <span>En cours d'assignation...</span>
                          </>
                        ) : (
                          <>
                            <UserPlus />
                            <span>Assigner à un membre</span>
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
          {/* Dialog Representant */}
          {(user?.role === 'MANAGER' &&
            activity?.status === 'Approved' &&
            !activity?.assigneeId &&
            !activity?.representative) ||
          (user?.role === 'COORDINATOR' &&
            activity?.status === 'Approved' &&
            !(activity?.assigneeId || activity?.representative)) ? (
            <Button
              variant={'outline'}
              onClick={() => setIsRepresentantDialogOpen(true)}
            >
              <UserPlus className='h-4 w-4' />
              <span>Assigner à un représentant</span>
            </Button>
          ) : null}
          <Dialog
            open={isRepresentantDialogOpen}
            onOpenChange={setIsRepresentantDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assigner un représentant</DialogTitle>
                <DialogDescription>
                  Assigner un représentant à cette audience.
                </DialogDescription>
              </DialogHeader>
              <div>
                <Form {...formRepresentative}>
                  <form
                    onSubmit={formRepresentative.handleSubmit(
                      handleRepresentant
                    )}
                    className='space-y-4'
                  >
                    <FormField
                      control={formRepresentative.control}
                      name='representative.firstName'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Nom
                          </label>
                          <FormControl>
                            <Input
                              id='representative.firstName'
                              type='text'
                              placeholder='Nom'
                              {...field}
                              disabled={representativeMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRepresentative.control}
                      name='representative.lastName'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Prénom
                          </label>
                          <FormControl>
                            <Input
                              id='representative.lastName'
                              type='text'
                              placeholder='Prénom'
                              {...field}
                              disabled={representativeMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRepresentative.control}
                      name='representative.email'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Email
                          </label>
                          <FormControl>
                            <Input
                              id='representative.email'
                              type='text'
                              placeholder='Email'
                              {...field}
                              disabled={representativeMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRepresentative.control}
                      name='representative.phone'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Téléphone
                          </label>
                          <FormControl>
                            <Input
                              id='representative.phone'
                              type='text'
                              placeholder='Téléphone'
                              {...field}
                              disabled={representativeMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        variant='outline'
                        onClick={() => setIsRepresentantDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type='submit'
                        disabled={representativeMutation.isPending}
                      >
                        {representativeMutation.isPending ? (
                          <>
                            <Loader2 className='animate-spin' />
                            <span>En cours de modification...</span>
                          </>
                        ) : (
                          <>
                            <Save />
                            <span>Enregistrer</span>
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
          {(user?.role === 'MANAGER' &&
            activity?.status === 'Approved' &&
            (reports?.data[0]?.status === 'VALIDATED' ||
              reports?.data[0]?.status === 'ARCHIVED')) ||
          (user?.role === 'COORDINATOR' &&
            activity?.status === 'Approved' &&
            (reports?.data[0]?.status === 'VALIDATED' ||
              reports?.data[0]?.status === 'ARCHIVED')) ? (
            <AlertDialog
              open={isArchiveDialogOpen}
              onOpenChange={setIsArchiveDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant='outline'>
                  <Archive />
                  <span>Archiver</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Êtes-vous absolument sûr ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela archivera
                    définitivement cette audience de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Non, j'annule</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleArchive}
                    disabled={archiveMutation.isPending}
                    className='flex items-center justify-center bg-destructive text-white px-4 rounded-md'
                  >
                    {archiveMutation.isPending ? (
                      'Archivage en cours...'
                    ) : (
                      <>
                        <Archive className='h-4 w-4' />
                        <span>Oui, j'archive</span>
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          {(user?.role === 'MANAGER' &&
            activity?.status !== 'Draft' &&
            activity?.status !== 'Archived' &&
            activity?.status !== 'Approved') ||
          (user?.role === 'COORDINATOR' &&
            activity?.status !== 'Draft' &&
            activity?.status !== 'Archived' &&
            activity?.status !== 'Approved') ? (
            <AlertDialog
              open={isDraftDialogOpen}
              onOpenChange={setIsDraftDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant={'outline'}>
                  <PencilLineIcon />
                  Brouillon
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Êtes-vous absolument sûr ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela enregistrera
                    définitivement cette audience de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Non, j'annule</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDraft}
                    disabled={draftMutation.isPending}
                    className='flex items-center justify-center bg-destructive text-white px-4 rounded-md'
                  >
                    {draftMutation.isPending ? (
                      'Enregistrement...'
                    ) : (
                      <>
                        <PencilLineIcon />
                        <span>Oui, je enregistre</span>
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          {Number(reports?.metadata?.total) === 0 ? (
            <Button
              variant={'outline'}
              onClick={() => setIsAddReportDialogOpen(true)}
            >
              <StickyNote />
              <span>Créer un rapport</span>
            </Button>
          ) : (
            <Button
              variant={'outline'}
              onClick={() => navigate(`/repport/${reports?.data?.[0]?._id}`)}
            >
              <Eye />
              <span>Voir le rapport</span>
            </Button>
          )}
          <Dialog
            open={isAddReportDialogOpen}
            onOpenChange={setIsAddReportDialogOpen}
          >
            <DialogContent className='sm:max-w-[1000px]'>
              <DialogHeader>
                <DialogTitle>Ecrivez le rapport de l'audience</DialogTitle>
                <DialogDescription>
                  Remplissez les étapes pour créer le rapport.
                </DialogDescription>
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
                          name='documents.file'
                          render={() => (
                            <FormItem>
                              <FormLabel htmlFor='upload-media'>
                                Uploader les images prises lors de l'activité
                                (type d'image accepté : png, jpg, jpeg)
                              </FormLabel>
                              <FormControl>
                                <div className='flex items-center gap-4'>
                                  <Input
                                    type='file'
                                    id='upload-media'
                                    multiple
                                    onChange={(e) =>
                                      setFiles(e.target.files as FileList)
                                    }
                                  />
                                  <Button
                                    variant='outline'
                                    id='upload-media'
                                    // onClick={() => setIsUploadDocumentModalOpen(true)}
                                  >
                                    <Upload className='h-4 w-4' />
                                    <span>Uploader un document</span>
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
                            onClick={() => setCurrentStep((prev) => prev - 1)}
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
                            onClick={() => setCurrentStep((prev) => prev + 1)}
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
        {/* Séparateur visuel */}
        <div className='w-px h-8 bg-gray-200 mx-2 hidden md:block' />
        {/* Actions dangereuses */}
        <div className='flex gap-2'>
          {((user?.role === 'MANAGER' && activity?.status !== 'Archived') ||
            (user?.role === 'COORDINATOR' &&
              activity?.status !== 'Archived')) && (
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
                    définitivement cette audience de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Non, j'annule</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className='flex items-center justify-center bg-destructive text-white px-4 rounded-md'
                  >
                    {deleteMutation.isPending ? (
                      'Suppression...'
                    ) : (
                      <>
                        <Trash2 className='h-4 w-4' />
                        <span>Oui, je supprime</span>
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {user?.role === 'MANAGER' && activity?.status === 'Waiting' && (
            <Button
              variant={'outline'}
              onClick={() => setIsRejectDialogOpen(true)}
            >
              <CircleSlash className='text-red h-4 w-4' />
              <span>Rejeter</span>
            </Button>
          )}
          <Dialog
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
          >
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                <DialogDescription>
                  Cette action ne peut pas être annulée. Cela rejettera
                  définitivement cette audience de nos serveurs.
                </DialogDescription>
              </DialogHeader>
              <Form {...formReject}>
                <form
                  onSubmit={formReject.handleSubmit(handleReject)}
                  className='grid gap-4 py-4'
                >
                  <FormField
                    control={formReject.control}
                    name='motif'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motif</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Motif de rejet' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button>Non, j'annule</Button>
                    <Button
                      type='submit'
                      disabled={rejectMutation.isPending}
                      className='flex items-center justify-center bg-destructive text-white px-4 rounded-md'
                    >
                      {rejectMutation.isPending ? (
                        'En cours de rejet...'
                      ) : (
                        <>
                          <Trash2 className='h-4 w-4' />
                          <span>Oui, je rejete</span>
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Ajout de la barre de scroll horizontale si besoin */}
      {/* @ts-ignore: ScrollBar peut ne pas être exporté selon la version, à adapter si besoin */}
      {typeof ScrollBar !== 'undefined' && (
        <ScrollBar orientation='horizontal' />
      )}
    </ScrollArea>
  );
}

export default ButtonGroupActionActivity;
