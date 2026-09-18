import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'NetFile ActBlue Assistant',
        namespace: 'https://github.com/castor',
        version: '1.0.0',
        author: 'Castor Fu',
        license: 'MIT',
        description: 'Assists with entering ActBlue contributions into NetFile Campaign Disclosure',
        match: ['https://netfile.com/Filer/LegacyFree/*'],
        grant: 'none',
        'run-at': 'document-idle',
        noframes: true,
      },
    }),
  ],
});
