/* eslint-env browser */

/**
 * Configuration object for values shared by multiple components
 */

 const Config = {
    VALID_FILETYPES: [".java",".py",".txt",".js"],
    ROUTES: {
        404: "../404.html",
        // "/": "../home.html",
    },
};
  
Object.freeze(Config);
  
export default Config;