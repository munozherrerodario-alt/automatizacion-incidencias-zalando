
export type IncidentType = 'delivery_failed' | 'return_request' | 'resend_request' | 'info_request' | 'other';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'auto_resolved' | 'human_review' | 'error' | 'pending';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'shipped' | 'delivered' | 'returned' | 'processing';
  amount: number;
  isVIP: boolean;
  items: string[];
}

export interface IncidentExtraction {
  orderId: string | null;
  type: IncidentType;
  actionRequested: string;
  urgency: UrgencyLevel;
  summary: string;
  isAmbiguous: boolean;
}

export interface Ticket {
  id: string;
  orderId: string | null;
  customerEmail: string;
  originalMessage: string;
  extraction: IncidentExtraction;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  autoResponse: string | null;
  createdAt: string;
  reasonForReview?: string;
}
