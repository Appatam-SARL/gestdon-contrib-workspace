import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useCreateReportOffline } from '@/hook/report.hook';
import {
  createReportSchema,
  FormCreateReportSchema,
} from '@/schema/report.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, StickyNote, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

function RapportActivityOrAudience() {
  const token = new URLSearchParams(window.location.search).get('token');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);

  const mutation = useCreateReportOffline(token as string);

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
  const onSubmitAddReport = async (data: FormCreateReportSchema) => {
    const payload = {
      ...data,
      commitments: [data.commitments],
      followUps: [
        {
          status: 'PENDING',
          nextReminder: data.commitments.dueDate,
        },
      ],
    };
    mutation.mutate(payload);
  };
  return (
    <div className='flex items-center justify-center min-h-screen w-full'>
      <div className='w-full max-w-2xl p-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='text-3xl font-bold'>Rapports</h4>
            <p className='text-muted-foreground'>
              Générez un rapport pour une audience ou une activité.
            </p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={() => navigate('/repport')} variant={'link'}>
              retour à la page de connexion
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center gap-2'>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step !== 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted-foreground/20'
                  }`}
                >
                  {step < currentStep ? <Check className='h-5 w-5' /> : step}
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
                            disabled={mutation.isPending}
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
                            disabled={mutation.isPending}
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
                                disabled={mutation.isPending}
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
                                disabled={mutation.isPending}
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
                                disabled={mutation.isPending}
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
                                disabled={mutation.isPending}
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
                        <FormLabel>Uploader le document en PDF</FormLabel>
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
                            <Button type='button' variant='outline' size='icon'>
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
              <div className='flex justify-between p-4 border-t'>
                {currentStep > 1 && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    disabled={mutation.isPending}
                  >
                    Précédent
                  </Button>
                )}
                {currentStep === 3 ? (
                  <Button
                    type='submit'
                    className='ml-auto'
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
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
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RapportActivityOrAudience;
