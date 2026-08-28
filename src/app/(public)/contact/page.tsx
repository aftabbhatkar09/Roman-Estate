import ContactClient from './ContactClient';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Contact Us | Roman Estate Mumbai',
  description: 'Get in touch with Roman Estate for luxury properties in Mumbai. We are here to help you find your dream home.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactClient />;
}
