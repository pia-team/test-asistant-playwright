import * as fs from 'fs';
import * as path from 'path';

interface EnvConfig {
  baseLoginUrl: string;
  username: string;
  password: string;
  customerUi:string;
  productCatalogUI:string
}

export function getEnvConfig(): EnvConfig {
  const env = process.env.TEST_ENV || 'dev'; // default to dev
  const filePath = path.resolve(__dirname, `../config/${env}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file for environment '${env}' not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as EnvConfig;
}
