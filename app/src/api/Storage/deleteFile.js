import { appwrite } from "../../appwrite";

// Create a stored file
async function deleteFile(id){
    await appwrite.database.deleteFile(id).then(res => {
        console.log("FILE DELETED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {deleteFile};