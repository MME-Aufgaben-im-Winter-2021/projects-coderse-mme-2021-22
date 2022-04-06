/* eslint-env browser */

import { updateEmail, updateUsername } from "../../api/User/updateUser.js";
import { getUser } from "../../api/User/getUser.js";
import { Observable, Event } from "../../utils/Observable.js";
import Config from "../../utils/Config.js";
import { listDocuments } from "../../api/Collections/listDocuments.js";
import { deleteSession } from "../../api/Session/deleteSession.js";
import { deleteUser } from "../../api/User/deleteUser.js";
import { deleteFile } from "../../api/Storage/deleteFile.js";
import { deleteDocument } from "../../api/Collections/deleteDocument.js";

class AccountManager extends Observable {

    constructor() {
        super();
    }

    async onAccountSubmit(username, email, password) {
        let currentUser = await this.getUser(),
            currentEmail = currentUser.email;

        // For the case only the username should be changed
        if (currentEmail === email) {
            let checkPassword = await this.checkPassword(email, password),
                result = checkPassword.value,
                error = checkPassword.error;
            if (result) {
                updateUsername(username).then((res) => {
                    this.notifyAll(new Event("update-success", res));
                }, error => {
                    this.notifyAll(new Event("update-error", error.message));
                });
            } else {
                this.notifyAll(new Event("update-error", error.message));
            }
            return;
        }

    // If the email has changed, both values are tried to be updated
    // For the Username, it is not important to be changed, so if the email is valid
    // -> Username is changed, or not if it is still the same -> update success either way
    updateEmail(email, password).then(() => {
        updateUsername(username).then((res) => {
            this.notifyAll(new Event("update-success", res));
        }, error => {
            this.notifyAll(new Event("update-error", error.message));
        });
        }, error => {
            this.notifyAll(new Event("update-error", error.message));
        });
    }

    // Deletes a user account and all the casts linked
    // But only if the password is true
    async onAccountDelete(password){
        let user = await getUser(),
            docs = await listDocuments(Config.CAST_COLLECTION_ID),
            userDocs = docs.documents.filter( doc => doc.userID === user.$id),
            checkPassword = await this.checkPassword(user.email, password);

        if(!checkPassword.value){
            this.notifyAll(new Event("update-error", "To delete your account, you have to pass your accounts password: " + checkPassword.error.message));
            return;
        }

        for(let doc of userDocs){
            let castId = doc.$id,
                codeFileId = doc.codeFileID,
                records = doc.records;
            await deleteFile(codeFileId);

            for(let record of records){
                let recordId = JSON.parse(record).id;
                await deleteFile(recordId);
            }
            await deleteDocument(Config.CAST_COLLECTION_ID,castId);
        }
        
        await deleteUser();
        await deleteSession();
    }

    async getUser() {
        return await getUser();
    }

    // Checks if the password is correct, given the user email
    async checkPassword(email, password){
        let res = {
                error: "error",
                value: true,
            };
        await updateEmail(email, password).catch(e => res.error = e);
        if(Config.PW_ERRORCODES.includes(res.error.code.toString())){
            res.value = false;
        }
        return res;
    }
}

export default AccountManager;