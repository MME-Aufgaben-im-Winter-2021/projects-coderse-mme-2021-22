import { appwrite } from "../../appwrite";

// Retrieve a stored file
async function getFile(id){
    await appwrite.database.getFile(id).then(res => {
        console.log("FILE FOUND " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {getFile};