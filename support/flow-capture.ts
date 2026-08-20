import * as fs from 'fs/promises';
import * as path from 'path';
import type { Page, Response } from '@playwright/test';

const SENSITIVE_KEYS = new Set([
  'authorization',
  'cookie',
  'password',
  'passwd',
  'secret',
  'token',
  'accesstoken',
  'refreshtoken',
  'apikey',
  'clientsecret',
  'set-cookie',
]);

function isSensitiveKey(key: string): boolean {
  const n = key.trim().toLowerCase().replace(/[_-]/g, '');
  if (SENSITIVE_KEYS.has(n)) return true;
  return n.includes('password') || n.includes('secret') || n.endsWith('token') || n.includes('apikey');
}

function maskValue(key: string, value: unknown): unknown {
  if (isSensitiveKey(key)) return '***';
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = maskValue(k, v);
    }
    return out;
  }
  if (Array.isArray(value)) {
    return value.map((v) => maskValue(key, v));
  }
  return value;
}

type BindingRule = {
  variableKey: string;
  businessLabel?: string;
  sourceType?: string;
  sourceDefinition?: {
    method?: string;
    urlPattern?: string;
    jsonPath?: string;
    status?: number;
  };
  producerFeaturePath?: string;
};

type CapturedResponse = {
  method: string;
  url: string;
  status: number;
  body: unknown;
};

function urlMatches(pattern: string | undefined, url: string): boolean {
  if (!pattern) return true;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp('^' + escaped + '$', 'i').test(url) || url.includes(pattern.replace(/\*/g, ''));
}

function extractJsonPath(body: unknown, jsonPath: string | undefined): string | undefined {
  if (body == null) return undefined;
  if (!jsonPath || jsonPath === '$') {
    return firstIdValue(body);
  }
  if (typeof body !== 'object') return undefined;
  const pathParts = jsonPath.replace(/^\$\.?/, '').split('.').filter(Boolean);
  let cur: any = body;
  for (const p of pathParts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  if (cur == null || typeof cur === 'object') {
    return firstIdValue(cur ?? body);
  }
  return String(cur);
}

function firstIdValue(body: unknown): string | undefined {
  const guessed: Array<{ key: string; label: string; value: string; jsonPath: string }> = [];
  guessIdFields(body, guessed, '$');
  return guessed[0]?.value;
}

function guessIdFields(
  body: unknown,
  out: Array<{ key: string; label: string; value: string; jsonPath: string }>,
  prefix = '$',
) {
  if (!body || typeof body !== 'object') return;
  if (Array.isArray(body)) {
    body.slice(0, 5).forEach((item, i) => guessIdFields(item, out, `${prefix}[${i}]`));
    return;
  }
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (isSensitiveKey(k)) continue;
    const path = prefix === '$' ? `$.${k}` : `${prefix}.${k}`;
    if (typeof v === 'string' || typeof v === 'number') {
      const lower = k.toLowerCase();
      if (
        lower === 'id' ||
        lower.endsWith('id') ||
        lower.includes('uuid') ||
        lower.includes('number') ||
        lower === 'code' ||
        lower === 'key'
      ) {
        out.push({
          key: lower === 'id' ? 'resourceId' : k,
          label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
          value: String(v),
          jsonPath: path,
        });
      }
    } else if (v && typeof v === 'object') {
      guessIdFields(v, out, path);
    }
  }
}

export class FlowCaptureSession {
  private responses: CapturedResponse[] = [];
  private listener?: (res: Response) => void;

  attach(page: Page) {
    this.listener = async (res: Response) => {
      try {
        const req = res.request();
        const method = req.method();
        if (!['GET', 'POST', 'PUT', 'PATCH'].includes(method)) return;
        const status = res.status();
        if (status < 200 || status >= 400) return;
        const ct = res.headers()['content-type'] || '';
        if (!ct.includes('json') && !ct.includes('text')) return;
        let body: unknown = null;
        try {
          body = await res.json();
        } catch {
          return;
        }
        this.responses.push({
          method,
          url: res.url(),
          status,
          body: maskValue('body', body),
        });
        if (this.responses.length > 80) this.responses.shift();
      } catch {
        // ignore capture errors
      }
    };
    page.on('response', this.listener);
  }

  detach(page: Page) {
    if (this.listener) {
      page.off('response', this.listener);
      this.listener = undefined;
    }
  }

  async flushToContextAndArtifact() {
    const contextPath = process.env.COTESTER_FLOW_CONTEXT_PATH;
    const artifactPath = process.env.COTESTER_FLOW_CAPTURE_ARTIFACT;
    const bindingsPath = process.env.COTESTER_FLOW_BINDINGS;
    // Discovery may only set artifact path; still flush candidates without bindings.
    if (!contextPath && !artifactPath) return;

    let bindings: BindingRule[] = [];
    if (bindingsPath) {
      try {
        const raw = await fs.readFile(bindingsPath, 'utf8');
        bindings = JSON.parse(raw);
      } catch {
        bindings = [];
      }
    }

    let ctx: Record<string, string> = {};
    if (contextPath) {
      try {
        const raw = await fs.readFile(contextPath, 'utf8');
        ctx = JSON.parse(raw || '{}');
      } catch {
        ctx = {};
      }
    }

    const candidates: Array<Record<string, unknown>> = [];

    for (const rule of bindings) {
      if ((rule.sourceType || 'NETWORK_RESPONSE') !== 'NETWORK_RESPONSE') continue;
      const def = rule.sourceDefinition || {};
      const matches = [...this.responses].reverse().filter((r) => {
        if (def.method && r.method.toUpperCase() !== String(def.method).toUpperCase()) return false;
        if (def.status && r.status !== def.status) return false;
        return urlMatches(def.urlPattern, r.url);
      });
      const hit = matches[0];
      if (!hit) continue;
      const value =
        extractJsonPath(hit.body, def.jsonPath) ??
        extractJsonPath(hit.body, '$.id') ??
        firstIdValue(hit.body);
      if (value) {
        ctx[rule.variableKey] = value;
      }
    }

    // Also collect generic candidates for Detect artifacts (no confirmed bindings required)
    for (const r of this.responses) {
      const guessed: Array<{ key: string; label: string; value: string; jsonPath: string }> = [];
      guessIdFields(r.body, guessed, '$');
      const mutating = ['POST', 'PUT', 'PATCH'].includes(r.method);
      for (const g of guessed) {
        candidates.push({
          businessLabel: g.label === 'Id' ? 'Resource ID' : g.label,
          variableKey: g.key,
          sourceType: 'NETWORK_RESPONSE',
          method: r.method,
          urlPattern: r.url,
          jsonPath: g.jsonPath,
          status: r.status,
          sample: g.value,
          sampleValueMasked: g.value,
          sampleMasked: g.value,
          confidence: mutating ? 'HIGH' : 'MEDIUM',
          technicalKey: g.key,
        });
      }
    }

    if (contextPath) {
      const dir = path.dirname(contextPath);
      await fs.mkdir(dir, { recursive: true });
      const tmp = contextPath + '.tmp';
      await fs.writeFile(tmp, JSON.stringify(ctx, null, 2), 'utf8');
      await fs.rename(tmp, contextPath);
    }

    if (artifactPath) {
      await fs.mkdir(path.dirname(artifactPath), { recursive: true });
      const meta = {
        flowId: process.env.COTESTER_FLOW_ID || null,
        flowStepId: process.env.COTESTER_FLOW_DISCOVERY_STEP_ID || null,
        featurePath: process.env.COTESTER_FLOW_DISCOVERY_FEATURE_PATH || null,
        capturedAt: new Date().toISOString(),
        capturedResponseCount: this.responses.length,
        candidateCount: candidates.length,
        discovery: process.env.COTESTER_FLOW_DISCOVERY === '1',
        candidates,
      };
      await fs.writeFile(artifactPath, JSON.stringify(meta, null, 2), 'utf8');
    }
  }
}
