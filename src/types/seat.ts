export interface Seat {
  row: number;
  number: number;
  section: 'left' | 'right';
  status: 'available' | 'selected' | 'taken';
  id: string;
}

export interface QueueUser {
  position: number;
  userId: string;
  name: string;
  isActive: boolean;
}
