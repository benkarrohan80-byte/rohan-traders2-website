export interface ScrapCategory {
  id: string;
  name: string;
  iconName: string;
  description?: string;
  estimatedRate?: string;
  imageUrl?: string;
}

export interface ScrapRequest {
  id: string;
  name: string;
  phone: string;
  address: string;
  scrapTypes: string[];
  estimatedWeight: string;
  preferredDate?: string;
  notes?: string;
  createdAt: string;
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Rejected';
  cancelledBy?: 'user' | 'admin';
  imageUrl?: string;
  rejectionReason?: string;
}
