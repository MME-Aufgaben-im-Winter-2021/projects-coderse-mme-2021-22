import appwrite from "../../appwrite";

// Get a document in the CodeCast Collection with a ID
function getDocument(collection, docId){
    let promise = appwrite.database.getDocument(collection, docId);
    return promise;
}

export {getDocument};