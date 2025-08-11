export interface IActivityType {
  _id: string;
  label: string;
  addToMenu: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IActivityTypeForm {
  label: string;
  addToMenu: boolean;
}
