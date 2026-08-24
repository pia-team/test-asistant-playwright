import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

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

/** How the config file was chosen during resolution. */
export type EnvConfigSource =
  | 'project-tier'
  | 'project-default'
  | 'legacy-tier'
  | 'legacy-no-project-key';

export interface ResolvedEnvConfig {
  config: EnvConfig;
  tier: string;
  projectKey?: string;
  source: EnvConfigSource;
  /** Absolute path to the JSON file that was loaded */
  filePath: string;
  /** Display-friendly path (relative to playwright project root when possible) */
  displayPath: string;
  /** True when a project key was expected but only config/{tier}.json was used */
  isLegacyFallback: boolean;
  /** Paths that were checked but missing (for diagnostics) */
  attemptedPaths: string[];
}

const EXCLUDED_PROJECT_FOLDERS = new Set(['steps', 'pages', 'records']);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PROJECTS_CONFIG_DIR = path.join(PROJECT_ROOT, 'config', 'projects');
const LEGACY_CONFIG_DIR = path.join(PROJECT_ROOT, 'config');

/** Per-scenario project key (set in hooks Before, cleared in After). */
let scenarioProjectKey: string | undefined;

/** Per-scenario credential profile slug override from @credential:slug tag. */
let scenarioCredentialProfile: string | undefined;
/** Dedupe identical resolution logs within the same worker process. */
const loggedResolutionKeys = new Set<string>();

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

  const key = match[1]?.trim();
  if (!key || EXCLUDED_PROJECT_FOLDERS.has(key.toLowerCase())) {
    return undefined;
  }

  return key;
}

function normalizeTier(tier?: string): string {
  const normalized = (tier ?? 'dev').trim().toLowerCase();
  return normalized || 'dev';
}

function toDisplayPath(absolutePath: string): string {
  const relative = path.relative(PROJECT_ROOT, absolutePath);
  return relative && !relative.startsWith('..') ? relative.replace(/\\/g, '/') : absolutePath;
}

function isStrictProjectConfigEnabled(): boolean {
  const raw = (process.env.ENV_STRICT_PROJECT_CONFIG ?? '').trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

function maskSecret(value: string): string {
  if (!value) {
    return '(empty)';
  }
  if (value.length <= 2) {
    return '**';
  }
  return `${value.slice(0, 2)}***`;
}

function summarizeLoginUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

function parseAndValidateEnvConfig(raw: string, filePath: string): EnvConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in env config '${toDisplayPath(filePath)}': ${message}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`Env config '${toDisplayPath(filePath)}' must be a JSON object.`);
  }

  const record = parsed as Record<string, unknown>;
  const baseLoginUrl = typeof record.baseLoginUrl === 'string' ? record.baseLoginUrl.trim() : '';
  const username = typeof record.username === 'string' ? record.username.trim() : '';
  const password = typeof record.password === 'string' ? record.password : '';

  const missing: string[] = [];
  if (!baseLoginUrl) missing.push('baseLoginUrl');
  if (!username) missing.push('username');
  if (!password) missing.push('password');

  if (missing.length > 0) {
    throw new Error(
      `Env config '${toDisplayPath(filePath)}' is missing required field(s): ${missing.join(', ')}`,
    );
  }

  try {
    // eslint-disable-next-line no-new
    new URL(baseLoginUrl);
  } catch {
    throw new Error(
      `Env config '${toDisplayPath(filePath)}' has invalid baseLoginUrl: '${baseLoginUrl}'`,
    );
  }

  return { baseLoginUrl, username, password };
}

function buildCandidatePaths(projectKey: string | undefined, tier: string): {
  candidates: Array<{ filePath: string; source: EnvConfigSource }>;
  attemptedPaths: string[];
} {
  const candidates: Array<{ filePath: string; source: EnvConfigSource }> = [];
  const attemptedPaths: string[] = [];

  const slug =
    getScenarioCredentialProfile() ??
    process.env.UI_CREDENTIAL_PROFILE ??
    undefined;

  if (projectKey && slug) {
    const slugPath = path.join(PROJECTS_CONFIG_DIR, `${projectKey}.${tier}.${slug}.json`);
    attemptedPaths.push(slugPath);
    if (fs.existsSync(slugPath)) {
      candidates.push({ filePath: slugPath, source: 'project-tier' });
    }
  }

  if (projectKey) {
    const tieredPath = path.join(PROJECTS_CONFIG_DIR, `${projectKey}.${tier}.json`);
    attemptedPaths.push(tieredPath);
    if (fs.existsSync(tieredPath)) {
      candidates.push({ filePath: tieredPath, source: 'project-tier' });
    }

    const projectPath = path.join(PROJECTS_CONFIG_DIR, `${projectKey}.json`);
    attemptedPaths.push(projectPath);
    if (fs.existsSync(projectPath)) {
      candidates.push({ filePath: projectPath, source: 'project-default' });
    }
  }

  const legacyPath = path.join(LEGACY_CONFIG_DIR, `${tier}.json`);
  attemptedPaths.push(legacyPath);
  if (fs.existsSync(legacyPath)) {
    candidates.push({
      filePath: legacyPath,
      source: projectKey ? 'legacy-tier' : 'legacy-no-project-key',
    });
  }

  return { candidates, attemptedPaths };
}

function logEnvResolution(resolved: ResolvedEnvConfig): void {
  const logKey = [
    resolved.tier,
    resolved.projectKey ?? '(none)',
    resolved.filePath,
    resolved.source,
  ].join('|');

  if (loggedResolutionKeys.has(logKey)) {
    return;
  }
  loggedResolutionKeys.add(logKey);

  const sourceLabel =
    resolved.source === 'project-tier'
      ? 'project+tier'
      : resolved.source === 'project-default'
        ? 'project default'
        : resolved.source === 'legacy-tier'
          ? 'LEGACY FALLBACK'
          : 'legacy (no project key)';

  const header = chalk.cyan(
    `[ENV] Resolved TEST_ENV=${resolved.tier}` +
      (resolved.projectKey ? ` project=${resolved.projectKey}` : ' project=(none)'),
  );
  const fileLine = chalk.cyan(`[ENV]   file: ${resolved.displayPath} (${sourceLabel})`);
  const urlLine = chalk.cyan(
    `[ENV]   baseLoginUrl: ${summarizeLoginUrl(resolved.config.baseLoginUrl)}`,
  );
  const userLine = chalk.cyan(
    `[ENV]   username: ${resolved.config.username} | password: ${maskSecret(resolved.config.password)}`,
  );

  console.log(header);
  console.log(fileLine);
  console.log(urlLine);
  console.log(userLine);

  if (resolved.isLegacyFallback) {
    const expectedTiered = resolved.projectKey
      ? `config/projects/${resolved.projectKey}.${resolved.tier}.json`
      : 'config/projects/{project}.{tier}.json';
    console.warn(
      chalk.yellow(
        `[ENV] WARNING: Project-specific config not found for '${resolved.projectKey}'. ` +
          `Using shared ${resolved.displayPath}. ` +
          `Cross-project runs may hit the wrong module. Expected: ${expectedTiered}`,
      ),
    );
  }

  if (!resolved.projectKey) {
    console.warn(
      chalk.yellow(
        '[ENV] WARNING: No project key in scenario context. ' +
          'Ensure hooks.ts sets project key from features/{PROJECT}/ path.',
      ),
    );
  }
}

/**
 * Load credentials for the current scenario.
 * Priority: @credential slug -> UI_CREDENTIAL_PROFILE -> tiered -> legacy paths
 * Resolves environment config with full metadata (source file, fallback flags, etc.).
 * Priority: config/projects/{project}.{tier}.json -> config/projects/{project}.json -> config/{tier}.json
 */
export function resolveEnvConfig(projectKey?: string): ResolvedEnvConfig {
  const tier = normalizeTier(process.env.TEST_ENV);
  const effectiveProjectKey = (projectKey ?? getScenarioProjectKey())?.trim() || undefined;
  const { candidates, attemptedPaths } = buildCandidatePaths(effectiveProjectKey, tier);

  if (candidates.length === 0) {
    const attemptedDisplay = attemptedPaths.map(toDisplayPath).join(', ');
    throw new Error(
      `Config file not found for TEST_ENV='${tier}'` +
        (effectiveProjectKey ? ` project='${effectiveProjectKey}'` : '') +
        `. Checked: ${attemptedDisplay}`,
    );
  }

  const selected = candidates[0];
  const isLegacyFallback =
    !!effectiveProjectKey &&
    (selected.source === 'legacy-tier' || selected.source === 'legacy-no-project-key');

  if (isLegacyFallback && isStrictProjectConfigEnabled()) {
    throw new Error(
      `ENV_STRICT_PROJECT_CONFIG is enabled and project '${effectiveProjectKey}' has no file under ` +
        `config/projects/. Refusing legacy fallback '${toDisplayPath(selected.filePath)}'.`,
    );
  }

  const raw = fs.readFileSync(selected.filePath, 'utf-8');
  const config = parseAndValidateEnvConfig(raw, selected.filePath);

  const resolved: ResolvedEnvConfig = {
    config,
    tier,
    projectKey: effectiveProjectKey,
    source: selected.source,
    filePath: selected.filePath,
    displayPath: toDisplayPath(selected.filePath),
    isLegacyFallback,
    attemptedPaths: attemptedPaths.map(toDisplayPath),
  };

  logEnvResolution(resolved);
  return resolved;
}

/**
 * Load credentials for the current scenario.
 * @param projectKey Optional override; defaults to scenario project key from hooks.
 */
export function getEnvConfig(projectKey?: string): EnvConfig {
  return resolveEnvConfig(projectKey).config;
}

/**
 * Helper to extract base domain from baseLoginUrl for URL assertions.
 * Example: "https://demoqa.com/login" -> "demoqa.com"
 */
export function getBaseDomain(projectKey?: string): string {
  const config = getEnvConfig(projectKey);
  try {
    const url = new URL(config.baseLoginUrl);
    return url.hostname;
  } catch {
    return config.baseLoginUrl;
  }
}

/** Clears in-process env resolution log dedupe (useful between test runs in same worker). */
export function resetEnvConfigLogCache(): void {
  loggedResolutionKeys.clear();
}
