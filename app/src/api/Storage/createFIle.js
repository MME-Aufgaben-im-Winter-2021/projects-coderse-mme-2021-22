import appwrite from "../appwrite.js";

// Create a stored file
function createFile(id, data) {
    let promise = appwrite.storage.createFile("unique()", data);
    return promise;
}

export { createFile };