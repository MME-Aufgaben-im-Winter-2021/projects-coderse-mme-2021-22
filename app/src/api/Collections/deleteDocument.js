import appwrite from "../../appwrite";

// Delete a document in the CodeCast Collection with a ID
function deleteDocument(collection, docId){
    let promise = appwrite.database.deleteDocument(collection, docId);
    return promise;
}

export {deleteDocument};