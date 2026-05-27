export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_KEY!
};

export const validateAppwriteConfig = () => {
  const requiredEnv = {
    NEXT_PUBLIC_APPWRITE_ENDPOINT: appwriteConfig.endpointUrl,
    NEXT_PUBLIC_APPWRITE_PROJECT: appwriteConfig.projectId,
    NEXT_PUBLIC_APPWRITE_DATABASE: appwriteConfig.databaseId,
    NEXT_PUBLIC_APPWRITE_USERS_COLLECTION: appwriteConfig.userCollectionId,
    NEXT_APPWRITE_KEY: appwriteConfig.secretKey,
  };

  const missing = Object.entries(requiredEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing Appwrite environment variables: ${missing.join(
        ", ",
      )}. Create .env.local in the project root and restart the dev server.`,
    );
  }
};
