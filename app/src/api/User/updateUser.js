import appwrite from "../appwrite.js";

// Update the username from the currently logged user
async function updateUsername(username) {
    await appwrite.account.updateName(username).then(res => {
        console.log("NAME CHANGED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}
// Update the password from the currently logged user
async function updatePassword(password) {
    await appwrite.account.updatePassword(password).then(res => {
        console.log("PASSWORD CHANGED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}
// Update the email from the currently logged user
async function updateEmail(email) {
    await appwrite.account.updateEmail(email).then(res => {
        console.log("PASSWORD CHANGED " + res);
    }, error => {
        console.log("THERE HAS BEEN AN ERROR " + error);
    });
}

export {updateUsername, updatePassword, updateEmail};