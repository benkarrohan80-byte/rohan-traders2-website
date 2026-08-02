import { ScrapCategory } from '../types';
import cardboardImg from '../assets/images/cardboard_bundles_1785662600982.jpg';
import plasticImg from '../assets/images/plain_transparent_plastic_scrap_1785663322017.jpg';
import paperImg from '../assets/images/raddi_newspapers_books_1785663590530.jpg';
import otherImg from '../assets/images/other_scrap_bottles_1785663782816.jpg';

export const SCRAP_CATEGORIES: ScrapCategory[] = [
  { 
    id: 'cardboard', 
    name: 'Cardboard (पुट्ठा)', 
    iconName: 'Boxes', 
    estimatedRate: '₹9 - ₹12 / kg',
    imageUrl: cardboardImg 
  },
  { 
    id: 'plastic', 
    name: 'Plastic (प्लास्टिक)', 
    iconName: 'Package', 
    estimatedRate: '₹27 - ₹35 / kg',
    imageUrl: plasticImg
  },
  { 
    id: 'paper', 
    name: 'Raddi (रद्दी)', 
    iconName: 'FileText', 
    estimatedRate: '₹9 - ₹15 / kg',
    imageUrl: paperImg
  },
  { 
    id: 'other', 
    name: 'Other', 
    iconName: 'HelpCircle', 
    estimatedRate: 'On Inspection',
    imageUrl: otherImg
  },
];

export const COMPANY_DETAILS = {
  name: "ROHAN TRADERS",
  subtitle: "Scrap Buyers",
  phone: "+91 83172 46684",
  rawPhone: "918317246684",
  address: "Plot No. 1, Shivnagar, Kalyan Road, Ahilyanagar 414001",
  email: "rohantraders8421@gmail.com",
  workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM",
  badge: "India's Trusted Scrap Buyer"
};


