/* eslint-env browser */

/**
 * Configuration object for values shared by multiple components
 */

const Config = {
    VALID_FILETYPES: [".java", ".py", ".txt", ".js", ".html"],
    MS_OF_SEC: 1000,
    SEC_OF_MIN: 60,
    INTERVAL_REFRESH_RATE: 100,
    MIN_SEC_OF_AUDIO_REC: 3,
    NODE_TYPE_TEXT: 3,
};

Object.freeze(Config);

export default Config;