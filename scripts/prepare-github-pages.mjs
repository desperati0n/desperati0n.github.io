import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve('dist/client');
const cleanRoutes = ['projects', 'zh', 'zh/projects'];

await Promise.all(
  cleanRoutes.map(async (route) => {
    const source = path.join(outputDirectory, `${route}.html`);
    const destinationDirectory = path.join(outputDirectory, route);
    await mkdir(destinationDirectory, { recursive: true });
    await copyFile(source, path.join(destinationDirectory, 'index.html'));
  }),
);
