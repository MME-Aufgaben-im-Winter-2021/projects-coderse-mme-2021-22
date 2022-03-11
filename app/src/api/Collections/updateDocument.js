import appwrite from "../appwrite";

// Update a document in the CodeCast Collection with a ID by handing your data
function updateDocument(collection, docId, data){
    let promise = appwrite.database.updateDocument(collection, docId, data);
    return promise;
}

export {updateDocument};