const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

function ts() {
  return new Date().toISOString();
}

const logger = {
  info: (...args) => console.log(`[${ts()}] [INFO]`, ...args),
  warn: (...args) => console.warn(`[${ts()}] [WARN]`, ...args),
  error: (...args) => console.error(`[${ts()}] [ERROR]`, ...args),
  debug: (...args) => {
    if (LOG_LEVEL === 'debug') console.log(`[${ts()}] [DEBUG]`, ...args);
  },
};

export default logger;