export interface IActivity {
  id: number;
  Title: string;
  description: string;
  status: 'Draft' | 'Approved' | 'Rejected';
  entity_id: number;
  created_by: number;
  activity_type_id: number;
  CreatedDate: string;
  UpdatedDate: string;
}

export interface IActivityFilterForm {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'Draft' | 'Approved' | 'Rejected';
  entity_id?: number;
  created_by?: number;
  activity_type_id?: number;
}
