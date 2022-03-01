import { appwrite } from "../../appwrite";

// Create a stored file
async function createFile(id,data){
    await appwrite.database.createFile(id, data).then(res => {
        console.log("FILE CREATED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {createFile};