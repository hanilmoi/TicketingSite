export interface Event {
  id: string;
  title: string;
  category: 'Music' | 'Sports' | 'Theater' | 'Comedy' | 'Festival' | 'Conference';
  date: string;
  time: string;
  venue: string;
  location: string;
  image: string;
  description: string;
  ticketTypes: TicketType[];
  featured?: boolean;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
  description?: string;
}

export interface CartItem {
  eventId: string;
  eventTitle: string;
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
  eventDate: string;
  eventTime: string;
  venue: string;
}
