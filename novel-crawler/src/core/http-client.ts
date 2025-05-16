import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { config, getRandomUserAgent } from "../config";
import { logger } from "./logger"; // Assuming logger.ts will be created

/**
 * A simple delay utility function.
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * HttpClient class to manage HTTP requests with features like
 * random User-Agent and request delay.
 */
export class HttpClient {
    private axiosInstance: AxiosInstance;
    private lastRequestTime: number = 0;

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 15000, // 15 seconds timeout
        });
    }

    /**
     * Makes a GET request to the specified URL.
     * It enforces a delay between requests and uses a random User-Agent.
     * @param url - The URL to fetch.
     * @param axiosConfig - Optional Axios request configuration.
     * @returns A promise that resolves with the AxiosResponse.
     * @throws Throws an error if the request fails after retries or due to other issues.
     */
    async get<T = any>(url: string, axiosConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        const currentTime = Date.now();
        const timeSinceLastRequest = currentTime - this.lastRequestTime;

        if (timeSinceLastRequest < config.requestDelay) {
            const waitTime = config.requestDelay - timeSinceLastRequest;
            logger.debug(`Waiting for ${waitTime}ms before next request.`);
            await delay(waitTime);
        }

        const headers = {
            "User-Agent": getRandomUserAgent(),
            ...(axiosConfig?.headers || {}),
        };

        logger.info(`Making GET request to: ${url}`);
        try {
            const response = await this.axiosInstance.get<T>(url, { ...axiosConfig, headers });
            this.lastRequestTime = Date.now();
            return response;
        } catch (error) {
            this.lastRequestTime = Date.now(); // Update time even on error to respect delay for next try
            if (axios.isAxiosError(error)) {
                logger.error(`Axios error fetching ${url}: ${error.message}`);
                if (error.response) {
                    logger.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
                }
            } else {
                logger.error(`Error fetching ${url}: ${(error as Error).message}`);
            }
            // As per user requirement: "致命错误就直接退出程序"
            // However, a single failed GET might not be fatal for the whole app.
            // For now, we re-throw, and the caller can decide if it's fatal.
            // If all GETs are critical, the main loop should handle process.exit(1).
            throw error; 
        }
    }

    // You can add other methods like post, put, delete if needed
}

// Export a singleton instance if preferred, or allow instantiation
export const httpClient = new HttpClient();

