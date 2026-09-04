export interface BookingOccupation {
  id: string;
  labels: Record<string, string>;
}

export interface BookingCategory {
  id: string;
  labels: Record<string, string>;
  occupations: BookingOccupation[];
}

export interface BookingData {
  categories: BookingCategory[];
}
