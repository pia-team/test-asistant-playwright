import * as fs from 'fs/promises';
import * as path from 'path';
import type { Download } from '@playwright/test';

type ManifestResource = {
  resourceId?: string;
  versionId?: string;
  versionNumber?: number;
  type: string;
  bindingKey: string;
  localPath: string;
  mimeType?: string;
  readOnly?: boolean;
  ephemeral?: boolean;
  lifecycleScope?: string;
};

type ManifestConfig = {
  resourceId: string;
  versionId: string;
  versionNumber: number;
  type: string;
  entries: Record<string, string>;
};

type RunDataManifest = {
  runId: string;
  projectKey?: string;
  resources: Record<string, ManifestResource>;
  configs: Record<string, ManifestConfig>;
};

let cachedManifest: RunDataManifest | null | undefined;

function toSlug(input: string): string {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!normalized) {
    throw new Error(`Could not derive slug from: ${input}`);
  }
  return normalized;
}

async function loadManifest(): Promise<RunDataManifest | null> {
  if (cachedManifest !== undefined) {
    return cachedManifest;
  }
  const manifestPath = process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
  if (!manifestPath) {
    cachedManifest = null;
    return null;
  }
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    cachedManifest = JSON.parse(raw) as RunDataManifest;
    return cachedManifest;
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') {
      cachedManifest = null;
      return null;
    }
    throw e;
  }
}

async function readFlowContext(): Promise<Record<string, string>> {
  const contextPath = process.env.COTESTER_FLOW_CONTEXT_PATH;
  if (!contextPath) {
    return {};
  }
  try {
    const raw = await fs.readFile(contextPath, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return {};
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return {};
    }
    throw e;
  }
}

async function writeFlowContextKey(bindingKey: string, resourceRef: string): Promise<void> {
  const contextPath = process.env.COTESTER_FLOW_CONTEXT_PATH;
  if (!contextPath) {
    return;
  }
  const ctx = await readFlowContext();
  ctx[bindingKey] = resourceRef;
  const dir = path.dirname(contextPath);
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${contextPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(ctx, null, 2), 'utf8');
  await fs.rename(tmp, contextPath);
}

async function mergeManifestResource(
  manifestPath: string,
  bindingKey: string,
  entry: ManifestResource,
): Promise<void> {
  let manifest: RunDataManifest;
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    manifest = JSON.parse(raw) as RunDataManifest;
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') {
      manifest = { runId: '', resources: {}, configs: {} };
    } else {
      throw e;
    }
  }
  manifest.resources = manifest.resources || {};
  manifest.resources[bindingKey] = entry;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  cachedManifest = manifest;
}

function resolveLegacyPath(bindingKey: string): string | null {
  if (bindingKey === 'example-document' || bindingKey === 'customer-contract') {
    return path.resolve(process.cwd(), 'docs/example.pdf');
  }
  return null;
}

export const testData = {
  async getFile(bindingKey: string): Promise<string> {
    const manifest = await loadManifest();
    const slug = toSlug(bindingKey);
    const entry = manifest?.resources?.[slug] ?? manifest?.resources?.[bindingKey];
    if (entry?.localPath) {
      return entry.localPath;
    }
    const legacy = resolveLegacyPath(bindingKey);
    if (legacy) {
      console.warn(
        `[testData] Using legacy fallback path for binding "${bindingKey}". Bind this test to Data Center.`,
      );
      return legacy;
    }
    throw new Error(
      `Data Center file binding "${bindingKey}" is not available. Ensure the resource is bound and the test run manifest was prepared.`,
    );
  },

  async getJson(bindingKey: string): Promise<unknown> {
    const filePath = await this.getFile(bindingKey);
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  },

  async getConfig(bindingKey: string): Promise<Record<string, string>> {
    const manifest = await loadManifest();
    const entry = manifest?.configs?.[bindingKey];
    if (entry?.entries) {
      return entry.entries;
    }
    throw new Error(`Data Center config binding "${bindingKey}" is not available.`);
  },

  async getDataset(bindingKey: string): Promise<{ rows: Record<string, unknown>[] }> {
    const json = await this.getJson(bindingKey);
    if (Array.isArray(json)) {
      return { rows: json as Record<string, unknown>[] };
    }
    if (json && typeof json === 'object') {
      return { rows: [json as Record<string, unknown>] };
    }
    throw new Error(`Data Center dataset binding "${bindingKey}" is not valid JSON.`);
  },

  async saveDownload(bindingKey: string, download: Download): Promise<{ resourceRef: string }> {
    const manifestPath = process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
    if (!manifestPath) {
      throw new Error('saveDownload requires a CoTester test run with Data Center manifest support.');
    }
    const slug = toSlug(bindingKey);
    const workDir = path.dirname(manifestPath);
    const generatedDir = path.join(workDir, 'generated');
    await fs.mkdir(generatedDir, { recursive: true });
    const suggested = download.suggestedFilename() || `${slug}.bin`;
    const target = path.join(generatedDir, `${slug}-${suggested}`);
    await download.saveAs(target);
    const resourceRef = `run:${slug}:${path.basename(target)}`;

    await mergeManifestResource(manifestPath, slug, {
      type: 'FILE',
      bindingKey: slug,
      localPath: target.replace(/\\/g, '/'),
      readOnly: false,
      ephemeral: true,
      lifecycleScope: 'RUN',
    });
    await writeFlowContextKey(slug, resourceRef);

    const pendingPath = path.join(workDir, 'pending-uploads.jsonl');
    await fs.appendFile(
      pendingPath,
      JSON.stringify({ bindingKey: slug, localPath: target.replace(/\\/g, '/'), resourceRef }) + '\n',
      'utf8',
    );
    return { resourceRef };
  },
};

export function resetTestDataCache(): void {
  cachedManifest = undefined;
}
