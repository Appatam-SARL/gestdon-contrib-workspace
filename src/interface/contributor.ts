export interface IContributor {
  _id: string;
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  logo: {
    fileId: string;
    fileUrl: string;
  };
  address: {
    country: string;
    street: string;
    postalCode: string;
    city: string;
  };
  status: 'actif' | 'inactif' | 'suspendu'; // Assuming status is an enum with these specific values based on the previous task
}

export type tContributorForm = Partial<IContributor>;

export interface ContributorStore {
  contributor: IContributor | null;
  contributorForm: tContributorForm | null;

  setContributorStore: (
    key: keyof ContributorStore,
    value: ContributorStore[keyof ContributorStore]
  ) => void;
}
