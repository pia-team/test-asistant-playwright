import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * BasePage interface that all Page Objects must implement.
 * This ensures consistency across all dynamically loaded Page Objects.
 */
export interface IBasePage {
    navigateToUrl(url: string): Promise<void>;
    fillField(fieldName: string, value: string): Promise<void>;
    clickElement(elementName: string): Promise<void>;
    getEnvironmentConfig(): Promise<{ baseLoginUrl: string;[key: string]: string }>;
}

/**
 * Page Factory - Dynamically loads the correct Page Object based on feature name.
 * 
 * This factory automatically discovers Page Objects by following the naming convention:
 * pages/{group}/{featureName}Page/{featureName}.page.ts
 * 
 * When new features are added via AI upload, they will automatically work
 * as long as they follow this naming convention.
 */
export class PageFactory {
    private static pageCache: Map<string, IBasePage> = new Map();
    private static pageModuleCache: Map<string, any> = new Map();

    /**
     * Gets or creates a Page Object instance for the given feature.
     * Dynamically discovers and loads the Page Object based on feature name.
     * 
     * @param featureName - Name of the feature (e.g., 'customer-create', 'catalog')
     * @param page - Playwright Page instance
     * @returns The Page Object instance
     */
    static async getPage(featureName: string, page: Page): Promise<IBasePage> {
        // Check cache first
        const cacheKey = `${featureName}-${page.url()}`;

        // Always create new instance for fresh state, but cache the module
        const PageClass = await this.loadPageClass(featureName);
        if (PageClass) {
            return new PageClass(page) as IBasePage;
        }

        throw new Error(`[PageFactory] Could not find Page Object for feature: ${featureName}`);
    }

    /**
     * Dynamically loads the Page class for a given feature.
     */
    private static async loadPageClass(featureName: string): Promise<any> {
        // Check module cache
        if (this.pageModuleCache.has(featureName)) {
            return this.pageModuleCache.get(featureName);
        }

        // Normalize feature name (remove .feature extension if present)
        const normalizedName = featureName.replace('.feature', '').replace(/\\/g, '/');

        // Try to find the Page Object in the pages directory
        const pagesDir = path.join(__dirname, '..', 'pages');
        const pageClass = await this.findPageClass(pagesDir, normalizedName);

        if (pageClass) {
            this.pageModuleCache.set(featureName, pageClass);
            console.log(`[PageFactory] Loaded Page Object for: ${featureName}`);
            return pageClass;
        }

        return null;
    }

    /**
     * Recursively searches for a Page Object matching the feature name.
     * Follows the convention: pages/{group}/{featureName}Page/{featureName}.page.ts
     */
    private static async findPageClass(pagesDir: string, featureName: string): Promise<any> {
        if (!fs.existsSync(pagesDir)) {
            console.log(`[PageFactory] Pages directory not found: ${pagesDir}`);
            return null;
        }

        // Expected Page Object class name (PascalCase)
        const expectedClassName = this.toPascalCase(featureName) + 'Page';

        // Search through all subdirectories
        const groups = fs.readdirSync(pagesDir);

        for (const group of groups) {
            const groupPath = path.join(pagesDir, group);
            if (!fs.statSync(groupPath).isDirectory()) continue;

            const pageFolders = fs.readdirSync(groupPath);

            for (const pageFolder of pageFolders) {
                const pageFolderPath = path.join(groupPath, pageFolder);
                if (!fs.statSync(pageFolderPath).isDirectory()) continue;

                // Check if folder name matches pattern: {featureName}Page
                const folderFeatureName = pageFolder.replace('Page', '');
                if (folderFeatureName.toLowerCase() === featureName.toLowerCase()) {
                    // Found matching folder, try to load the page file
                    const pageFiles = fs.readdirSync(pageFolderPath).filter(f => f.endsWith('.page.ts'));

                    if (pageFiles.length > 0) {
                        const pageFilePath = path.join(pageFolderPath, pageFiles[0]);
                        try {
                            // Dynamic require
                            const pageModule = require(pageFilePath);

                            // Find the Page class in the module
                            for (const exportName of Object.keys(pageModule)) {
                                if (exportName.endsWith('Page')) {
                                    console.log(`[PageFactory] Found Page class: ${exportName} in ${pageFilePath}`);
                                    return pageModule[exportName];
                                }
                            }
                        } catch (error) {
                            console.error(`[PageFactory] Error loading page module: ${pageFilePath}`, error);
                        }
                    }
                }
            }
        }

        // Try alternative search: feature name might contain group prefix
        // e.g., "dcm/customer-create" -> look for customer-createPage in dcm folder
        if (featureName.includes('/')) {
            const parts = featureName.split('/');
            const justFeatureName = parts[parts.length - 1];
            return this.findPageClass(pagesDir, justFeatureName);
        }

        console.log(`[PageFactory] No Page Object found for feature: ${featureName}`);
        return null;
    }

    /**
     * Converts kebab-case or snake_case to PascalCase.
     * e.g., 'customer-create' -> 'CustomerCreate'
     */
    private static toPascalCase(str: string): string {
        return str
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * Clears the page cache. Useful for testing.
     */
    static clearCache(): void {
        this.pageCache.clear();
        this.pageModuleCache.clear();
    }
}
