/**
 * Simple Logger Module
 * Outputs messages to the console with different levels.
 */

enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

// Set the current log level for the application
// For development, DEBUG is fine. For production, INFO or WARN might be better.
const CURRENT_LOG_LEVEL: LogLevel = LogLevel.DEBUG;

function getTimestamp(): string {
    return new Date().toISOString();
}

export const logger = {
    debug: (message: string, ...args: any[]) => {
        if (CURRENT_LOG_LEVEL <= LogLevel.DEBUG) {
            console.debug(`[${getTimestamp()}] [DEBUG] ${message}`, ...args);
        }
    },
    info: (message: string, ...args: any[]) => {
        if (CURRENT_LOG_LEVEL <= LogLevel.INFO) {
            console.info(`[${getTimestamp()}] [INFO] ${message}`, ...args);
        }
    },
    warn: (message: string, ...args: any[]) => {
        if (CURRENT_LOG_LEVEL <= LogLevel.WARN) {
            console.warn(`[${getTimestamp()}] [WARN] ${message}`, ...args);
        }
    },
    error: (message: string, ...args: any[]) => {
        if (CURRENT_LOG_LEVEL <= LogLevel.ERROR) {
            console.error(`[${getTimestamp()}] [ERROR] ${message}`, ...args);
        }
    },
};

