import * as fs from 'fs';
import * as path from 'path';

/**
 * Standard environment configuration interface.
 * ALL generated Playwright tests MUST use only these 3 fields.
 * Do NOT add additional fields - keep it simple and universal.
 */
interface EnvConfig {
  /** The base URL for login page navigation */
  baseLoginUrl: string;
  /** Login username/email */
  username: string;
  /** Login password */
  password: string;
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

/**
 * Helper to extract base domain from baseLoginUrl for URL assertions.
 * Example: "https://demoqa.com/login" -> "demoqa.com"
 */
export function getBaseDomain(): string {
  const config = getEnvConfig();
  try {
    const url = new URL(config.baseLoginUrl);
    return url.hostname;
  } catch {
    return config.baseLoginUrl;
  }
}
