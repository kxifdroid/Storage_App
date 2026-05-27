"use server"

import { Client, Account, Databases, Avatars, Storage } from "node-appwrite";
import {
  appwriteConfig,
  validateAppwriteConfig,
} from "@/app/lib/appwrite/config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  validateAppwriteConfig();

  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");
  if (!session || !session.value) throw new Error("Could not find session");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  validateAppwriteConfig();

  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
