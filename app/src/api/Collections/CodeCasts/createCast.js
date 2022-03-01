import { appwrite } from "../../appwrite";

// Create a document in the CodeCast Collection with a unique ID (not tested!) by handing your data
async function createCodeCast(data){
    await appwrite.database.createDocument('CodeCast', 'unique()', data).then(res => {
        console.log("CAST DOCUMENT CREATED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {createCodeCast};