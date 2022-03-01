import { appwrite } from "../../appwrite";

// Update a document in the CodeCast Collection with a ID by handing your data
async function updateCodeCast(id, data){
    await appwrite.database.updateDocument('CodeCast', id, data).then(res => {
        console.log("CAST DOCUMENT UPDATED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {updateCodeCast};