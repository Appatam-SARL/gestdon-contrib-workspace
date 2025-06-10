// TODO: Define the actual IAudience interface based on your audience data structure
export interface IAudience {
  _id: string;
  name: string;
  email: string;
  // Add other audience properties here
}

// TODO: Define the actual IAudienceFilterForm interface based on your filtering needs
export interface IAudienceFilterForm {
  search?: string;
  period?: { from: string; to: string };
  // Add other filter properties here
  page?: number;
  limit?: number;
  contributorId?: string;
}
