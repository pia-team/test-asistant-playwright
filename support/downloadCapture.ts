import { autoSaveDownload } from './testData';

/** Saves the downloads collected since the last flush to Data Center (RUN-scoped). */
export async function flushPendingDownloads(world: {
  pendingDownloads?: Array<{ download: import('playwright').Download; stepText?: string }>;
}): Promise<void> {
  const pending = world.pendingDownloads?.splice(0) ?? [];
  for (const { download, stepText } of pending) {
    try {
      const saved = await autoSaveDownload(download, stepText);
      if (saved) {
        console.log(`📥 Download saved to Data Center as "${saved.bindingKey}" (${download.suggestedFilename()})`);
      }
    } catch (e) {
      console.warn(`⚠️ Download could not be saved to Data Center: ${e}`);
    }
  }
}
