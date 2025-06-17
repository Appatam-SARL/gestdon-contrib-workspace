export interface AgendaEvent {
  title: string;
  start: Date;
  end: Date;
  ownerId: string;
}

export interface IAgencdaFilterForm {
  contributorId: string;
}
