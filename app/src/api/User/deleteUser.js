import appwrite from "../appwrite.js";

// Function to delete a currently logged user
async function deleteUser() {
    await appwrite.account.delete().then(res => {
        console.log("ACCOUNT DELETED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {deleteUser};