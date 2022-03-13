import appwrite from "../appwrite.js";

// Create a stored file
function deleteFile(id){
    let promise = appwrite.database.deleteFile(id);
    return promise;
}

export {deleteFile};