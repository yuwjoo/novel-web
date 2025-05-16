/**
 * Application Configuration
 */

export const config = {
    sites: {
        bqg220: {
            baseUrl: "https://m.bqg220.cc",
            searchUrl: "https://m.bqg220.cc/s.php?q={keyword}", // Placeholder, actual API needs inspection
        },
        tbxsw: {
            baseUrl: "https://m.tbxsw.cc",
            searchUrl: "https://m.tbxsw.cc/search.html?keyword={keyword}", // Placeholder, actual API needs inspection
        },
    },
    // List of User-Agents to rotate through
    userAgents: [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (Linux; Android 11; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36"
    ],
    // Request delay in milliseconds to limit request frequency
    requestDelay: 1000, // 1 second, configurable as per user's request

    // Database configuration (already handled in data-source.ts for sqlite path)
    database: {
        fileName: "novel-crawler.sqlite",
    },

    // Default values for missing fields
    defaults: {
        author: "未知作者",
        description: "暂无简介",
        coverUrl: "",
        categoryName: "未分类",
        latestChapterTitle: "暂无最新章节",
        status: "连载中",
    }
};

/**
 * Selects a random User-Agent from the list.
 * @returns A random User-Agent string.
 */
export function getRandomUserAgent(): string {
    const randomIndex = Math.floor(Math.random() * config.userAgents.length);
    return config.userAgents[randomIndex];
}

