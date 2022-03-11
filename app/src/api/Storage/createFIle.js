import appwrite from "../../appwrite";

// Create a stored file
function createFile(id,data){
    let promise = appwrite.database.createFile(id, data);
    return promise;
}

export {createFile};