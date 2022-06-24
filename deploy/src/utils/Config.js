/* eslint-env browser */

// Configuration object for values shared by multiple components

const Config = {
    VALID_FILETYPES: [".java", ".py", ".txt", ".js", ".html", ".rtf", ".json"],
    MS_OF_SEC: 1000,
    SEC_OF_MIN: 60,
    INTERVAL_REFRESH_RATE: 100,
    MIN_SEC_OF_AUDIO_REC: 3,
    NODE_TYPE_TEXT: 3,
    CAST_COLLECTION_ID: "622de1da30d840a4c304",
    URL_SUBSTRING_START: 8,
    PW_ERRORCODES: ["400", "401"],
    LS_KEY_CAST_ONBOARDING: "create-onboarding-done",
};

Object.freeze(Config);

export default Config;