import { appwrite } from "../../appwrite";

// Delete a document in the CodeCast Collection with a ID
async function deleteCodeCast(id){
    await appwrite.database.deleteDocument('CodeCast', id).then(res => {
        console.log("CAST DOCUMENT DELETED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {deleteCodeCast};