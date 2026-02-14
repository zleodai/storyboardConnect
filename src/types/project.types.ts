export interface Project {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  logline: string;
  school: string;
  format: 'MV' | 'Commercial' | 'Short Film' | 'Feature';
  length?: string;
  timeline: string;
  productionType: 'Commercial' | 'Student' | 'Indie' | 'Others';
  shotlistReady: boolean;
  locationSecured: boolean;
  isPaid: boolean;
  visualDeckUrl?: string;
  contactInfo: {
    twitter?: string;
    instagram?: string;
    email?: string;
  };
}
