import { secrets } from "@/lib";
import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint(secrets.appwrite.endpoint)
  .setProject(secrets.appwrite.projectId)
  .setKey(secrets.appwrite.apiKey);

const users = new Users(client);
const database = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

export { users, database, storage, avatars };
