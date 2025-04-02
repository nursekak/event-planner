import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'gentle-spies-drive.loca.lt',
      'social-fans-appear.loca.lt',
      'terrible-rattlesnake-11.loca.lt',
      'event-planner-front.loca.lt',
      'loca.lt'
    ]
  }
})
