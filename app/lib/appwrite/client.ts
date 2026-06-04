"use client";

import { Client, Storage } from "appwrite";
import { Account } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.trim();
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT?.trim();

export const validateClientAppwriteConfig = () => {
  const missing = [];

  if (!endpoint) missing.push("NEXT_PUBLIC_APPWRITE_ENDPOINT");
  if (!projectId) missing.push("NEXT_PUBLIC_APPWRITE_PROJECT");

  if (missing.length > 0) {
    throw new Error(
      `Missing Appwrite client environment variables: ${missing.join(
        ", ",
      )}. Update .env.local and restart the dev server.`,
    );
  }

  if (!endpoint.startsWith("https://") && !endpoint.startsWith("http://")) {
    throw new Error("NEXT_PUBLIC_APPWRITE_ENDPOINT must be a valid URL.");
  }

  if (projectId.startsWith("http://") || projectId.startsWith("https://")) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_PROJECT must be the Appwrite project ID, not a URL.",
    );
  }
};

let client: Client | null = null;

const initializeClient = () => {
  if (client) return client;
  
  validateClientAppwriteConfig();
  
  client = new Client()
    .setEndpoint(endpoint!)
    .setProject(projectId!);
  
  return client;
};

export const getClientStorage = (jwt: string) => {
  const clientInstance = initializeClient();
  clientInstance.setJWT(jwt);
  return new Storage(clientInstance);
};

export const getClientAccount = () => {
  const clientInstance = initializeClient();
  return new Account(clientInstance);
};
