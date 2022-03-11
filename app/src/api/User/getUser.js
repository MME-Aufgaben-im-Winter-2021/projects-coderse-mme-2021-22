import appwrite from "../appwrite.js";

// Function to get the currently logged in user
async function getUser() {
    await appwrite.account.get().then(res => {
        console.log("CURRENT ACCOUNT " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {getUser};