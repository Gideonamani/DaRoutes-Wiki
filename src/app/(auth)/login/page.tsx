import type { Metadata } from "next";
import { LoginClient } from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign in · DaRoutes Wiki',
  description: 'Access the DaRoutes dashboard using a magic link or Google to manage Dar es Salaam transit data.',
  openGraph: {
    title: 'Sign in · DaRoutes Wiki',
    description: 'Access the DaRoutes dashboard using a magic link or Google to manage Dar es Salaam transit data.',
    url: '/login',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'DaRoutes login illustration'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign in · DaRoutes Wiki',
    description: 'Access the DaRoutes dashboard using a magic link or Google to manage Dar es Salaam transit data.',
    images: ['/opengraph-image']
  }
};

export default function LoginPage() {
  return <LoginClient />;
}
