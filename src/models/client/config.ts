import { Client, Account, Avatars, Databases, Storage } from "appwrite";
import { secrets } from "@/lib";

const client = new Client()
  .setEndpoint(secrets.appwrite.endpoint)
  .setProject(secrets.appwrite.projectId);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

export { account, database, storage, avatars };
