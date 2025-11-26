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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useGetStaffMembers } from '@/hook/admin.hook';
import {
  useArchiveAudience,
  useAssignAudience,
  useAudience,
  useBrouillonAudience,
  useDeleteAudience,
  useRejectedAudience,
  useReportAudience,
  useRepresentant,
  // useReportAudience,
  useValidateAudience,
} from '@/hook/audience.hook';
import { useCreateReport } from '@/hook/report.hook';
import { IReport } from '@/interface/report';
import {
  formAssignAudienceSchema,
  FormAssignAudienceSchema,
  formRejectedAudienceSchema,
  FormRejectedAudienceSchema,
  FormReportAudienceSchema,
  FormRepresentantAudienceSchema,
  FormValidateAudienceSchema,
  formValidateAudienceSchema,
  reportAudienceSchema,
  representativeSchema,
} from '@/schema/audience.schema';
import {
  createReportSchema,
  FormCreateReportSchema,
} from '@/schema/report.schema';
import useContributorStore from '@/store/contributor.store';
import useUserStore from '@/store/user.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import {
  Archive,
  CalendarDays,
  Check,
  CircleSlash,
  Edit,
  Eye,
  Loader2,
  PencilLine,
  Save,
  StickyNote,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function MenuButtonAction({
  id,
  reports,
}: {
  id: string;
  reports: {
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
  const [files, setFiles] = useState<FileList>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] =
    useState<boolean>(false);
  const [isReporterDialogOpen, setIsReporterDialogOpen] =
    useState<boolean>(false);
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] =
    useState<boolean>(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] =
    useState<boolean>(false);
  const [isBrouillonDialogOpen, setIsBrouillonDialogOpen] =
    useState<boolean>(false);
  const [isOpenDialogRejeted, setIsOpenDialogRejeted] =
    useState<boolean>(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [isRepresentantDialogOpen, setIsRepresentantDialogOpen] =
    useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // hook de récupération de l'audience
  const { data: audienceResponse } = useAudience(id as string);
  const { data: staffs } = useGetStaffMembers({
    limit: 100,
    page: 1,
    contributorId: contributorId as string,
  });

  // hook de mutation
  const deleteMutation = useDeleteAudience(() => navigate('/audiences'));
  const validateMutation = useValidateAudience(
    id as string,
    setIsValidateDialogOpen
  );
  const assignMutation = useAssignAudience(id as string, setIsAssignDialogOpen);
  const representativeMutation = useRepresentant(
    id as string,
    setIsRepresentantDialogOpen
  );
  const rejectedMutation = useRejectedAudience(
    id as string,
    setIsOpenDialogRejeted
  );
  const archiveMutation = useArchiveAudience(
    id as string,
    setIsArchiveDialogOpen
  );
  const brouillonMutation = useBrouillonAudience(
    id as string,
    setIsBrouillonDialogOpen
  );
  const reportMutation = useReportAudience(id, setIsReporterDialogOpen);
  const createReportMutation = useCreateReport(() => {
    setIsAddReportDialogOpen(false);
    setCurrentStep(1);
    setFiles(undefined);
    formAddReport.reset();
  }); // hook de création d'un rapport pour l'audience

  const formValidate = useForm<FormValidateAudienceSchema>({
    resolver: zodResolver(formValidateAudienceSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  });

  const formRejected = useForm<FormRejectedAudienceSchema>({
    resolver: zodResolver(formRejectedAudienceSchema),
    defaultValues: {
      motif: '',
    },
  });

  const formAssign = useForm<FormAssignAudienceSchema>({
    resolver: zodResolver(formAssignAudienceSchema),
    defaultValues: {
      assigneeId: '',
    },
  });

  const formRepresentant = useForm<FormRepresentantAudienceSchema>({
    resolver: zodResolver(representativeSchema),
    defaultValues: {
      representative: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
    },
  });

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
    formReport.reset();
  };

  const onSubmitAddReport = async (data: FormCreateReportSchema) => {
    if (!files || files.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner au moins un fichier',
        variant: 'destructive',
      });
      return;
    }
    
    // Exclure documents du payload car il sera géré séparément par le hook
    const { documents, ...reportData } = data;
    
    const payload = {
      ...reportData,
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
    createReportMutation.mutate({ report: payload, files });
  };

  const audience = audienceResponse?.data;

  if (!audience) {
    return <div className='text-muted-foreground'>Audience non trouvée.</div>;
  }

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  const handleValidate = (data: FormValidateAudienceSchema) => {
    validateMutation.mutate(data);
  };

  const handleArchive = () => {
    archiveMutation.mutate();
  };

  const handleBrouillon = () => {
    brouillonMutation.mutate();
  };

  const handleRejected = (data: FormRejectedAudienceSchema) => {
    if (id) {
      rejectedMutation.mutate(data);
    }
  };

  const handleAssign = (data: FormAssignAudienceSchema) => {
    if (!data.assigneeId) {
      return toast({ title: 'Erreur', description: "L'assignee est requis." });
    }
    assignMutation.mutate(data);
  };

  const handleRepresentant = (data: FormRepresentantAudienceSchema) => {
    if (id) {
      representativeMutation.mutate(data);
      formRepresentant.reset({
        representative: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        },
      });
    }
  };

  console.log('reports', reports?.data?.length);

  return (
    <div className='flex flex-wrap gap-3 items-center py-4 px-4 border border-dashed border-gray-300 rounded-lg bg-white'>
      <div className='flex gap-2'>
        {user?.role === 'EDITOR' &&
        audience.status !== 'PENDING' &&
        audience.status !== 'ARCHIVED' ? (
          <Button
            variant={'outline'}
            onClick={() => navigate(`/audiences/${audience._id}/edit`)}
          >
            <Edit className='h-4 w-4' />
            <span>Modifier</span>
          </Button>
        ) : null}
        {(user?.role === 'MANAGER' &&
          audience.status !== 'VALIDATED' &&
          audience.status !== 'ARCHIVED') ||
        (user?.role === 'COORDINATOR' &&
          audience.status !== 'VALIDATED' &&
          audience.status !== 'ARCHIVED') ? (
          <Dialog
            open={isValidateDialogOpen}
            onOpenChange={setIsValidateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant={'outline'}>
                <Check className='h-4 w-4' />
                <span>Valider</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                <DialogDescription>
                  Cette action ne peut pas être annulée. Cela validera
                  définitivement cette audience de nos serveurs.
                </DialogDescription>
              </DialogHeader>
              <Form {...formValidate}>
                <form
                  onSubmit={formValidate.handleSubmit(handleValidate)}
                  className='space-y-4'
                >
                  <FormField
                    control={formValidate.control}
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
                    control={formValidate.control}
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
                  <DialogFooter>
                    <Button
                      variant={'outline'}
                      onClick={() => setIsValidateDialogOpen(false)}
                    >
                      Non, j'annule
                    </Button>
                    <Button type='submit' disabled={validateMutation.isPending}>
                      {validateMutation.isPending ? (
                        'validation en cours...'
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
        ) : null}
        {/* Dialog assign  */}
        {(user?.role === 'MANAGER' &&
          audience.status === 'VALIDATED' &&
          !audience.assigneeId &&
          !audience.representative &&
          audience.beneficiaryId) ||
        (user?.role === 'COORDINATOR' &&
          audience.status === 'VALIDATED' &&
          !(audience.assigneeId || audience.representative) &&
          audience.beneficiaryId) ? (
          <Button onClick={() => setIsAssignDialogOpen(true)} variant='outline'>
            <UserPlus />
            <span>Assigner</span>
          </Button>
        ) : null}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className='sm:max-w-[500px] sm:max-h-[700px] overflow-auto'>
            <DialogHeader>
              <DialogTitle>Assigner une audience</DialogTitle>
              <DialogDescription>
                Assigner une audience à un membre du staff.
              </DialogDescription>
            </DialogHeader>
            <div>
              <Form {...formAssign}>
                <form
                  onSubmit={formAssign.handleSubmit(handleAssign)}
                  className='space-y-4'
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
                              <SelectValue placeholder='Sélectionnez un Membre du staff' />
                            </SelectTrigger>
                            <SelectContent>
                              {staffs?.data?.map((beneficiaire) => (
                                <SelectItem
                                  key={beneficiaire._id}
                                  value={beneficiaire._id as string}
                                >
                                  {beneficiaire.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setIsAssignDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type='submit' disabled={assignMutation.isPending}>
                      {assignMutation.isPending ? (
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
        {/* Dialog Representant */}
        {(user?.role === 'MANAGER' &&
          audience.status === 'VALIDATED' &&
          !audience.assigneeId &&
          !audience.representative &&
          audience.beneficiaryId) ||
        (user?.role === 'COORDINATOR' &&
          audience.status === 'VALIDATED' &&
          !audience.assigneeId &&
          !audience.representative &&
          audience.beneficiaryId) ? (
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
              <Form {...formRepresentant}>
                <form
                  onSubmit={formRepresentant.handleSubmit(handleRepresentant)}
                  className='space-y-4'
                >
                  <FormField
                    control={formRepresentant.control}
                    name='representative.firstName'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>Nom</label>
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
                    control={formRepresentant.control}
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
                    control={formRepresentant.control}
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
                    control={formRepresentant.control}
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
          audience.status === 'VALIDATED' &&
          audience.assigneeId &&
          audience.beneficiaryId) ||
        (user?.role === 'COORDINATOR' &&
          audience.status === 'VALIDATED' &&
          audience.assigneeId &&
          audience.beneficiaryId) ? (
          <Button
            variant={'outline'}
            className='text-yellow-400'
            onClick={() => setIsReporterDialogOpen(true)}
          >
            <CalendarDays className='h-4 w-4' />
            <span>Reporter</span>
          </Button>
        ) : null}
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
                            disabled={reportMutation.isPending}
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
                            disabled={reportMutation.isPending}
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
                    {/* TODO: Implémenter la redirection vers la page de création */}
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
        {/* AlertDialog Arhciver */}
        {(user?.role === 'MANAGER' &&
          audience.status === 'VALIDATED' &&
          (reports?.data[0]?.status === 'VALIDATED' ||
            reports?.data[0]?.status === 'ARCHIVED')) ||
        (user?.role === 'COORDINATOR' &&
          audience.status === 'VALIDATED' &&
          (reports?.data[0]?.status === 'VALIDATED' ||
            reports?.data[0]?.status === 'ARCHIVED')) ? (
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
                <AlertDialogTitle>Etes-vous absolument sûr ?</AlertDialogTitle>
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
                >
                  {archiveMutation.isPending ? (
                    <>
                      <Loader2 className='animate-spin' />
                      <span>En cours de modification...</span>
                    </>
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

        {/* AlertDialog Brouillon ou Draft */}
        {(user?.role === 'MANAGER' &&
          audience.status !== 'DRAFT' &&
          audience.status !== 'ARCHIVED' &&
          audience.status !== 'VALIDATED') ||
        (user?.role === 'COORDINATOR' &&
          audience.status !== 'DRAFT' &&
          audience.status !== 'ARCHIVED' &&
          audience.status !== 'VALIDATED') ? (
          <AlertDialog
            open={isBrouillonDialogOpen}
            onOpenChange={setIsBrouillonDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant='outline'>
                <PencilLine className='h-4 w-4' />
                <span>Brouillon</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Etes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela archivera
                  définitivement cette audience de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Non, j'annule</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBrouillon}
                  disabled={archiveMutation.isPending}
                >
                  {archiveMutation.isPending ? (
                    <>
                      <Loader2 className='animate-spin' />
                      <span>En cours de modification...</span>
                    </>
                  ) : (
                    <>
                      <PencilLine className='h-4 w-4' />
                      <span>Bouillon</span>
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
        {/* Dialog reporter */}
        <Dialog
          open={isAddReportDialogOpen}
          onOpenChange={(open) => {
            setIsAddReportDialogOpen(open);
            if (!open) {
              setCurrentStep(1);
              setFiles(undefined);
              formAddReport.reset();
            }
          }}
        >
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Ecrivez le rapport de l'audience</DialogTitle>
              <DialogDescription>
                <p className='text-sm text-muted-foreground'>
                  Étape {currentStep} sur 3
                </p>
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
                <form onSubmit={formAddReport.handleSubmit(onSubmitAddReport)}>
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
                        // control={form.control}
                        name='documents.file'
                        render={() => (
                          <FormItem>
                            <FormLabel>
                              Uploader les images prises lors de l'activité
                              (type d'image accepté : png, jpg, jpeg)
                            </FormLabel>
                            <FormControl>
                              <div className='flex items-center gap-4'>
                                <Input
                                  type='file'
                                  accept='image/*'
                                  multiple
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      setFiles(e.target.files);
                                    }
                                  }}
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
                          {createReportMutation.isPending ? (
                            <>
                              <Loader2 className='animate-spin' />
                              <span>En cours...</span>
                            </>
                          ) : (
                            <>
                              <StickyNote />
                              <span>Créer le rapport</span>
                            </>
                          )}
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

        {(user?.role === 'MANAGER' &&
          audience.status !== 'VALIDATED' &&
          audience.status !== 'ARCHIVED') ||
        (user?.role === 'COORDINATOR' &&
          audience.status !== 'VALIDATED' &&
          audience.status !== 'ARCHIVED') ? (
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
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
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
        ) : null}
      </div>
      <div className='gap-2'>
        {/* Dialog rejeté  */}
        {user?.role === 'MANAGER' &&
          audience.status !== 'ARCHIVED' &&
          audience.status !== 'VALIDATED' && (
            <Button
              onClick={() => setIsOpenDialogRejeted(true)}
              variant='outline'
            >
              <CircleSlash />
              <span>Rejeté</span>
            </Button>
          )}
        <Dialog
          open={isOpenDialogRejeted}
          onOpenChange={setIsOpenDialogRejeted}
        >
          <DialogContent className='sm:max-w-[500px] sm:max-h-[700px] overflow-auto'>
            <DialogHeader>
              <DialogTitle>Rejeté</DialogTitle>
              <DialogDescription>
                Cette audience sera rejetée.
              </DialogDescription>
            </DialogHeader>
            <Form {...formRejected}>
              <form
                onSubmit={formRejected.handleSubmit(handleRejected)}
                className='space-y-4'
              >
                <FormField
                  control={formRejected.control}
                  name='motif'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>Motif</label>
                      <FormControl>
                        <Textarea rows={10} placeholder='Motif' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsOpenDialogRejeted(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type='submit'
                    variant='outline'
                    onClick={() => setIsOpenDialogRejeted(false)}
                  >
                    <CircleSlash />
                    Oui, je rejete
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default MenuButtonAction;
