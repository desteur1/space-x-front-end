export interface Launch {
  name: string;
  date_utc: string;
  success: boolean | null;
  rocket: string;
  details?: string;
}
