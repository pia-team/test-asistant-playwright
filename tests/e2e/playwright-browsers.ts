import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

function hasChromiumBrowser(browsersRoot: string): boolean {
  try {
    return fs
      .readdirSync(browsersRoot)
      .some((name) => name.startsWith('chromium_headless_shell-') || name.startsWith('chromium-'));
  } catch {
    return false;
  }
}

function resolveBrowsersRoot(): string | undefined {
  const configured = process.env.PLAYWRIGHT_BROWSERS_PATH?.trim();
  if (configured && hasChromiumBrowser(configured)) {
    return configured;
  }
  const macCache = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  if (hasChromiumBrowser(macCache)) {
    return macCache;
  }
  return configured || undefined;
}

const root = resolveBrowsersRoot();
if (root) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = root;
}
