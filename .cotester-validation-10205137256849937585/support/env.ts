import * as fs from 'fs';
import * as path from 'path';

/**
 * Standard environment configuration interface.
 * ALL generated Playwright tests MUST use only these 3 fields.
 * Do NOT add additional fields - keep it simple and universal.
 */
export interface EnvConfig {
  /** The base URL for login page navigation */
  baseLoginUrl: string;
  /** Login username/email */
  username: string;
  /** Login password */
  password: string;
}

const EXCLUDED_PROJECT_FOLDERS = new Set(['steps', 'pages', 'records']);

/** Per-scenario project key (set in hooks Before, cleared in After). */
let scenarioProjectKey: string | undefined;

/** Per-scenario credential profile slug override from @credential:slug tag. */
let scenarioCredentialProfile: string | undefined;

export function setScenarioProjectKey(projectKey: string | undefined): void {
  scenarioProjectKey = projectKey?.trim() || undefined;
}

export function getScenarioProjectKey(): string | undefined {
  return scenarioProjectKey;
}

export function setScenarioCredentialProfile(profileSlug: string | undefined): void {
  scenarioCredentialProfile = profileSlug?.trim() || undefined;
}

export function getScenarioCredentialProfile(): string | undefined {
  return scenarioCredentialProfile;
}

/**
 * Extract project key from a Cucumber feature URI/path.
 * Example: features/GCU/Create/foo.feature -> GCU
 */
export function extractProjectKeyFromFeatureUri(featureUri: string): string | undefined {
  if (!featureUri) {
    return undefined;
  }

  const normalized = featureUri.replace(/\\/g, '/');
  const match = normalized.match(/(?:^|\/)features\/([^/]+)\//i);
  if (!match) {
    return undefined;
  }

  const key = match[1].trim();
  if (!key || EXCLUDED_PROJECT_FOLDERS.has(key.toLowerCase())) {
    return undefined;
  }

  return key;
}

function resolveConfigFilePath(projectKey: string | undefined, tier: string, profileSlug?: string): string | null {
  const projectsDir = path.resolve(__dirname, '../config/projects');
  const slug =
    profileSlug ??
    getScenarioCredentialProfile() ??
    process.env.UI_CREDENTIAL_PROFILE ??
    undefined;

  if (projectKey && slug) {
    const slugPath = path.join(projectsDir, `${projectKey}.${tier}.${slug}.json`);
    if (fs.existsSync(slugPath)) {
      return slugPath;
    }
  }

  if (projectKey) {
    const tieredPath = path.join(projectsDir, `${projectKey}.${tier}.json`);
    if (fs.existsSync(tieredPath)) {
      return tieredPath;
    }

    const projectPath = path.join(projectsDir, `${projectKey}.json`);
    if (fs.existsSync(projectPath)) {
      return projectPath;
    }
  }

  const legacyPath = path.resolve(__dirname, `../config/${tier}.json`);
  if (fs.existsSync(legacyPath)) {
    return legacyPath;
  }

  return null;
}

/**
 * Load credentials for the current scenario.
 * Priority: @credential slug -> UI_CREDENTIAL_PROFILE -> tiered -> legacy paths
 */
export function getEnvConfig(projectKey?: string): EnvConfig {
  const tier = process.env.TEST_ENV || 'dev';
  const effectiveProjectKey = projectKey ?? getScenarioProjectKey();
  const filePath = resolveConfigFilePath(effectiveProjectKey, tier);

  if (!filePath) {
    const hint = effectiveProjectKey
      ? `config/projects/${effectiveProjectKey}.${tier}.json or config/projects/${effectiveProjectKey}.json`
      : `config/${tier}.json`;
    throw new Error(
      `Config file not found for TEST_ENV='${tier}'` +
        (effectiveProjectKey ? ` project='${effectiveProjectKey}'` : '') +
        `. Expected: ${hint}`,
    );
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
