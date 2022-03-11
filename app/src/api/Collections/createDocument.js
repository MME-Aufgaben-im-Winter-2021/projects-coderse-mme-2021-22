import appwrite from "../appwrite";

// Create a document in the CodeCast Collection with a unique ID (not tested!) by handing your data
function createDocument(collection, data){
    let promise = appwrite.database.createDocument(collection , 'unique()', data);
    return promise;
}

export {createDocument};