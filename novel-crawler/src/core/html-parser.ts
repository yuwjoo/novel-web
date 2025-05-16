import * as cheerio from 'cheerio';
import { CheerioAPI, Cheerio, Element } from 'cheerio';
import { logger } from './logger';

/**
 * HtmlParser class provides utility methods to parse HTML content using Cheerio.
 */
export class HtmlParser {
    private $: CheerioAPI | null = null;

    /**
     * Loads HTML content into Cheerio for parsing.
     * @param htmlContent - The HTML string to load.
     */
    loadHtml(htmlContent: string): void {
        try {
            this.$ = cheerio.load(htmlContent);
        } catch (error) {
            logger.error('Error loading HTML content into Cheerio:', (error as Error).message);
            this.$ = null; // Ensure $ is null if loading fails
            throw error; // Re-throw the error to be handled by the caller
        }
    }

    /**
     * Checks if HTML is successfully loaded.
     * @returns True if HTML is loaded, false otherwise.
     */
    isHtmlLoaded(): boolean {
        return this.$ !== null;
    }

    /**
     * Finds elements based on a CSS selector.
     * @param selector - The CSS selector.
     * @returns A Cheerio object representing the found elements.
     * @throws Error if HTML is not loaded.
     */
    find(selector: string): Cheerio<Element> {
        if (!this.$) {
            logger.error('HTML content not loaded. Call loadHtml() first.');
            throw new Error('HTML content not loaded. Call loadHtml() first.');
        }
        return this.$(selector);
    }

    /**
     * Extracts text from an element found by a CSS selector.
     * Optionally, can get text from a specific child selector within the first matched element.
     * @param selector - The CSS selector for the parent element.
     * @param childSelector - (Optional) A CSS selector for a child element within the parent.
     * @param trim - (Optional) Whether to trim whitespace from the text. Defaults to true.
     * @returns The extracted text, or an empty string if not found or HTML not loaded.
     */
    getText(selector: string, childSelector?: string, trim: boolean = true): string {
        if (!this.$) {
            logger.warn('HTML content not loaded. Call loadHtml() first. Returning empty string.');
            return '';
        }
        try {
            const element = childSelector ? this.$(selector).find(childSelector).first() : this.$(selector).first();
            const text = element.text();
            return trim ? text.trim() : text;
        } catch (error) {
            logger.warn(`Error getting text for selector "${selector}"${childSelector ? ` child "${childSelector}"` : ''}: ${(error as Error).message}`);
            return '';
        }
    }

    /**
     * Extracts an attribute value from an element found by a CSS selector.
     * Optionally, can get an attribute from a specific child selector within the first matched element.
     * @param selector - The CSS selector for the parent element.
     * @param attributeName - The name of the attribute to extract.
     * @param childSelector - (Optional) A CSS selector for a child element within the parent.
     * @returns The attribute value, or an empty string if not found or HTML not loaded.
     */
    getAttribute(selector: string, attributeName: string, childSelector?: string): string {
        if (!this.$) {
            logger.warn('HTML content not loaded. Call loadHtml() first. Returning empty string.');
            return '';
        }
        try {
            const element = childSelector ? this.$(selector).find(childSelector).first() : this.$(selector).first();
            const attrValue = element.attr(attributeName);
            return attrValue || '';
        } catch (error) {
            logger.warn(`Error getting attribute "${attributeName}" for selector "${selector}"${childSelector ? ` child "${childSelector}"` : ''}: ${(error as Error).message}`);
            return '';
        }
    }

    /**
     * Extracts the HTML content of elements found by a CSS selector.
     * @param selector - The CSS selector.
     * @returns The HTML string of the first matched element, or null if not found or HTML not loaded.
     */
    getHtml(selector: string): string | null {
        if (!this.$) {
            logger.warn('HTML content not loaded. Call loadHtml() first. Returning null.');
            return null;
        }
        try {
            return this.$(selector).first().html();
        } catch (error) {
            logger.warn(`Error getting HTML for selector "${selector}": ${(error as Error).message}`);
            return null;
        }
    }

    /**
     * Iterates over elements found by a CSS selector and applies a callback function.
     * @param selector - The CSS selector.
     * @param callback - A function to be called for each element. 
     *                   The function receives the index and the Cheerio element.
     *                   `this` inside the callback refers to the raw DOM element.
     * @throws Error if HTML is not loaded.
     */
    forEach(selector: string, callback: (index: number, element: Cheerio<Element>) => void): void {
        if (!this.$) {
            logger.error('HTML content not loaded. Call loadHtml() first.');
            throw new Error('HTML content not loaded. Call loadHtml() first.');
        }
        this.$(selector).each((i, el) => {
            callback(i, this.$(el));
        });
    }
}

// Export a singleton instance if preferred, or allow instantiation
export const htmlParser = new HtmlParser();

