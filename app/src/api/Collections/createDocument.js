import appwrite from "../appwrite.js";

// Structure:
// {
//     "castID": "12391230asdasd"
//     "title": "test",
//     "userID": "213",
//     "audioFileIDs": [
//         "123"
//     ],
//     "codeFileID": "123"
// }

// Create a document in a Collection 
function createDocument(collection, data) {
    let promise = appwrite.database.createDocument(collection, "unique()", data);
    return promise;
}

export { createDocument };