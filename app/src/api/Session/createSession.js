import appwrite from "../appwrite.js";

// Function to create a session -> authentication
async function createSession(email, password) {
    await appwrite.account.account.createSession(email, password).then(res => {
        console.log("SESSION CREATED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {createSession};