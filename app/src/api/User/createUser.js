import appwrite from "../appwrite.js";

// Function to create a user
async function createUser(email, password, username) {
    await appwrite.account.create('unique()', email, password, username).then(res => {
        console.log("ACCOUNT CREATED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {createUser};