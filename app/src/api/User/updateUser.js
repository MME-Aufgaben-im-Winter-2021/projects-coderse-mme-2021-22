import appwrite from "../appwrite.js";

// Update the username from the currently logged user
function updateUsername(username) {
    let promise = appwrite.account.updateName(username);
    return promise;
}
// Update the password from the currently logged user
function updatePassword(password) {
    let promise = appwrite.account.updatePassword(password);
    return promise;
}
// Update the email from the currently logged user
function updateEmail(email) {
    let promise = appwrite.account.updateEmail(email);
    return promise;
}

export {updateUsername, updatePassword, updateEmail};