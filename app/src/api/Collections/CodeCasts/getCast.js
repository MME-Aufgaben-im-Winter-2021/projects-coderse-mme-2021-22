import { appwrite } from "../../appwrite";

// Get a document in the CodeCast Collection with a ID
async function getCodeCast(id){
    await appwrite.database.getDocument('CodeCast', id).then(res => {
        console.log("CAST DOCUMENT RETRIEVED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {getCodeCast};