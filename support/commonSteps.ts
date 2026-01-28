import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from './world';
import { PageFactory, IBasePage } from './pageFactory';

/**
 * COMMON INFRASTRUCTURE - Universal logic for Page Objects.
 * 
 * NOTE: As per the "Unique Feature-Scoped Step Definitions" approach,
 * generic step patterns (like "I click {string}") have been removed from here
 * to prevent conflicts with feature-specific unique steps.
 * 
 * Each feature now defines its own unique steps (e.g., "for {feature-name}").
 */

/**
 * Gets or creates the Page Object for the current feature.
 * Uses the feature name from the world context to determine which Page Object to load.
 * CRITICAL: Stores page instance in world.pageInstance to avoid race conditions.
 */
async function getPageForCurrentFeature(world: ICustomWorld): Promise<IBasePage> {
    // Get current feature name from world context (set in hooks.ts)
    const featureName = (world as any).currentFeatureName || '';

    // Check if we already have a page instance for this scenario
    if ((world as any).pageInstance) {
        return (world as any).pageInstance;
    }

    // Create new page instance for this scenario
    const pageInstance = await PageFactory.getPage(featureName, world.page!);
    (world as any).pageInstance = pageInstance;
    console.log(`[CommonSteps] Using Page Object for feature: ${featureName}`);

    return pageInstance;
}

// Global reset function
export function resetPageCache(): void {
    PageFactory.clearCache();
}

/**
 * ANY TRULY GLOBAL STEPS (NOT CONFLICTING WITH UNIQUE ONES) CAN GO HERE
 * For now, we rely on feature-specific unique steps.
 */
