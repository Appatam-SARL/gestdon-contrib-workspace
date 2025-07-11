import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { withDashboard } from '@/hoc/withDashboard';
import { useGetActivityType } from '@/hook/activity-type.hook';
import { useActivity, useUpdateActivity } from '@/hook/activity.hook';
import { useGetCustomFieldsByActivityType } from '@/hook/custom-field.hook';
import { ICustomFieldFilterForm } from '@/interface/custom-field';
import {
  formActivitySchema,
  FormActivitySchema,
} from '@/schema/activity.schema';
import useContributorStore from '@/store/contributor.store';
import useUserStore from '@/store/user.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SaveIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';

export interface IFilterActivityType {
  activityTypeId?: string;
  contributorId?: string;
}

const EditActivity = withDashboard(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const user = useUserStore((s) => s.user);

  const [filterActivityType, setFilterActivityType] =
    useState<IFilterActivityType>({ activityTypeId: '', contributorId: '' });
  const [filterCustomFields, setFilterCustomFields] =
    useState<ICustomFieldFilterForm>({
      ownerId: '',
      form: '',
      entityId: '',
      entityType: '',
    });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Récupérer l'activité à éditer
  const { data: activityResponse, isLoading: isLoadingActivity } = useActivity(
    id as string
  );
  const activity = activityResponse?.data;

  // Récupérer les types d'activité et les custom fields
  useLayoutEffect(() => {
    if (filterActivityType.contributorId === '' && contributorId) {
      setFilterActivityType((prev) => ({
        ...prev,
        contributorId: contributorId as string,
      }));
    }
  }, [filterActivityType, contributorId]);

  useLayoutEffect(() => {
    if (filterCustomFields.ownerId === '' && contributorId) {
      setFilterCustomFields((prev) => ({
        ...prev,
        ownerId: contributorId as string,
        form: 'activity',
        entityType: 'ACTIVITY',
      }));
    }
  }, [filterCustomFields, contributorId]);

  // Mettre à jour le filtre des custom fields quand le type d'activité change
  useEffect(() => {
    if (activity && activity.activityTypeId) {
      setFilterActivityType((prev) => ({
        ...prev,
        activityTypeId:
          typeof activity.activityTypeId === 'string'
            ? activity.activityTypeId
            : activity.activityTypeId._id,
      }));
      setFilterCustomFields((prev) => ({
        ...prev,
        entityId:
          typeof activity.activityTypeId === 'string'
            ? activity.activityTypeId
            : activity.activityTypeId._id,
      }));
    }
  }, [activity]);

  const { data: activityType, isLoading: isLoadingActivityType } =
    useGetActivityType(filterActivityType);
  const { data: customFields, isLoading: isLoadingCustomFields } =
    useGetCustomFieldsByActivityType(filterCustomFields);

  // Initialiser le formulaire avec les valeurs de l'activité existante
  const formEditActivity = useForm<FormActivitySchema>({
    resolver: zodResolver(formActivitySchema),
    defaultValues: {
      title: activity?.title || '',
      locationOfActivity: activity?.locationOfActivity || '',
      description: activity?.description || '',
      activityTypeId:
        typeof activity?.activityTypeId === 'string'
          ? activity?.activityTypeId
          : activity?.activityTypeId?._id || '',
      customFields: activity?.customFields
        ? Object.entries(activity.customFields).map(([label, value]) => ({
            label,
            value,
          }))
        : [],
    },
    values: activity ? undefined : undefined, // Pour forcer le rechargement si besoin
  });
  // Mettre à jour les custom fields dans le formulaire à chaque changement de customFields (après chargement)
  useEffect(() => {
    if (customFields?.data && activity) {
      formEditActivity.setValue(
        'customFields',
        customFields.data.map((field) => ({
          label: field.label,
          value: activity?.customFields?.get
            ? activity.customFields.get(field.label) || ''
            : '',
        }))
      );
    }
  }, [customFields, activity, formEditActivity]);

  // Handler pour le changement de type d'activité
  const handleActivityTypeChange = (value: string) => {
    formEditActivity.setValue('activityTypeId', value);
    setFilterActivityType((prev) => ({
      ...prev,
      activityTypeId: value,
    }));
    setFilterCustomFields((prev) => ({
      ...prev,
      entityId: value,
    }));
    // Réinitialiser les custom fields dans le formulaire
    formEditActivity.setValue('customFields', []);
  };

  // Hook de mutation pour la mise à jour
  const mutationUpdateActivity = useUpdateActivity(
    id as string,
    setIsEditDialogOpen
  );

  // Handler de soumission du formulaire
  const onSubmit = (data: FormActivitySchema) => {
    // Transformation du payload pour l'API backend
    const customFieldsMap: Record<string, any> = {};
    data.customFields.forEach((field) => {
      customFieldsMap[field.label] = field.value;
    });
    const payload = {
      title: data.title,
      description: data.description,
      contributorId,
      activityTypeId: data.activityTypeId,
      customFields: customFieldsMap,
      locationOfActivity: data.locationOfActivity,
    };
    mutationUpdateActivity.mutateAsync(payload, {
      onSuccess: () => navigate('/activity'),
    });
  };

  if (isLoadingActivity) {
    return <Skeleton count={8} className='h-10 w-full' />;
  }

  return (
    <div>
      {/* En-tête */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Modifier une activité</h1>
          <p className='text-muted-foreground'>
            Modifiez les informations de l'activité sélectionnée.
          </p>
        </div>
      </div>
      <Card className='space-y-4 mt-4'>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>
            Modifier l'activité
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Modifiez les informations pour cette activité.
          </CardDescription>
          <CardAction>
            <Link to='/activity'>
              <Button variant={'link'}>Retour</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...formEditActivity}>
            <form
              onSubmit={formEditActivity.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={formEditActivity.control}
                name='title'
                disabled={mutationUpdateActivity.isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de l'activité</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Titre de l'activité" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-x-4 gap-y-8'>
                <FormField
                  control={formEditActivity.control}
                  name='locationOfActivity'
                  disabled={mutationUpdateActivity.isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu de l'activité</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Lieu de l'activité (facultatif)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLoadingActivityType ? (
                  <Skeleton className='h-10 w-full' />
                ) : (
                  <FormField
                    control={formEditActivity.control}
                    name='activityTypeId'
                    disabled={mutationUpdateActivity.isPending}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'activité</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            defaultValue={field.value}
                            onValueChange={handleActivityTypeChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type d'activité" />
                            </SelectTrigger>
                            <SelectContent>
                              {activityType?.data?.map((activityType) => (
                                <SelectItem
                                  key={activityType._id}
                                  value={activityType._id}
                                >
                                  {activityType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormField
                control={formEditActivity.control}
                name='description'
                disabled={mutationUpdateActivity.isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={10}
                        placeholder="Écrivez une description concernant l'activité"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Affichage dynamique des custom fields */}
              {isLoadingCustomFields ? (
                <Skeleton count={3} className='h-10 w-full' />
              ) : (
                filterActivityType.activityTypeId &&
                Number(customFields?.data?.length) > 0 &&
                customFields?.data?.map((customField, index) => (
                  <FormField
                    key={customField._id || customField.label + index}
                    control={formEditActivity.control}
                    name={`customFields.${index}.value`}
                    disabled={mutationUpdateActivity.isPending}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{customField.label}</FormLabel>
                        <FormControl>
                          {(() => {
                            switch (customField.type) {
                              case 'text':
                                return (
                                  <Input
                                    type='text'
                                    placeholder={customField.label}
                                    {...field}
                                  />
                                );
                              case 'number':
                                return (
                                  <Input
                                    type='number'
                                    placeholder={customField.label}
                                    {...field}
                                  />
                                );
                              case 'textarea':
                                return (
                                  <Textarea
                                    placeholder={customField.label}
                                    {...field}
                                  />
                                );
                              case 'date':
                                return (
                                  <Input
                                    type='date'
                                    placeholder={customField.label}
                                    {...field}
                                  />
                                );
                              case 'select':
                                return (
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={customField.label}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {customField.options?.map(
                                        (option, idx) => (
                                          <SelectItem key={idx} value={option}>
                                            {option}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                );
                              case 'radio':
                                return (
                                  <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className='flex flex-col space-y-1'
                                  >
                                    {customField.options?.map((option, idx) => (
                                      <FormItem
                                        key={idx}
                                        className='flex items-center space-x-2'
                                      >
                                        <FormControl>
                                          <RadioGroupItem value={option} />
                                        </FormControl>
                                        <FormLabel className='font-normal'>
                                          {option}
                                        </FormLabel>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                );
                              case 'checkbox':
                                return (
                                  <div className='flex flex-col gap-2'>
                                    {customField.options?.map((option, idx) => (
                                      <label
                                        key={idx}
                                        className='flex items-center space-x-2'
                                      >
                                        <Checkbox
                                          checked={
                                            Array.isArray(field.value)
                                              ? field.value.includes(option)
                                              : false
                                          }
                                          onCheckedChange={(checked) => {
                                            let newValue = Array.isArray(
                                              field.value
                                            )
                                              ? [...field.value]
                                              : [];
                                            if (checked) {
                                              newValue.push(option);
                                            } else {
                                              newValue = newValue.filter(
                                                (v) => v !== option
                                              );
                                            }
                                            field.onChange(newValue);
                                          }}
                                        />
                                        <span>{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                );
                              default:
                                return null;
                            }
                          })()}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              )}
              <CardFooter className='flex justify-end mt-4'>
                <Button
                  type='submit'
                  disabled={mutationUpdateActivity.isPending}
                >
                  {mutationUpdateActivity.isPending ? (
                    <>
                      <Loader2 className='animate-spin' />
                      <span>Enregistrement ...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon />
                      <span>Enregistrer les modifications</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
});

export default EditActivity;
