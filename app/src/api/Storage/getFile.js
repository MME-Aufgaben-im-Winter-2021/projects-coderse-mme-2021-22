import appwrite from "../../appwrite";

// Retrieve a stored file
function getFile(id){
    let promise = appwrite.database.getFile(id);
    return promise;
}

export {getFile};