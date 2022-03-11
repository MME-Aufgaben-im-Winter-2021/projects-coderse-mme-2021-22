import { Appwrite } from 'appwrite';

const appwrite = new Appwrite();

appwrite
     .setEndpoint("https://appwrite.software-engineering.education/v1") // Your Appwrite Endpoint process.env.APPWRITE_ENDPOINT
     .setProject("6206642b73fcd6ebf79d"); // Your project ID process.env.APPWRITE_KEY

export { appwrite };