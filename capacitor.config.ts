
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.diary',
  appName: 'wellbeing-diary-nexus',
  webDir: 'dist',
  server: {
    url: 'https://7b11e691-3726-4f65-b1d0-b27795193d39.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
