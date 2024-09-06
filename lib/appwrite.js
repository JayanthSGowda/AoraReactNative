import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';


export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'Use Yours',
    projectId: 'Use Yours',
    databaseId: 'Use Yours',
    userCollectionId: 'Use Yours',
    videosCollectionId: 'Use Yours',
    storageId: 'Use Yours',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videosCollectionId,
    storageId,
 } = config;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;
const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

export const createUser = async ( email, password, username ) => {
    
    try{
        const newAccount = await account.create( ID.unique(), email, password, username )

        if (!newAccount) throw Error;

        const avatarURL = avatar.getInitials(username);
        await singIn(email, password);

        const newUser = databases.createDocument(
            config.databaseId, 
            config.userCollectionId,
            ID.unique(),
            {
                accountid: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarURL,
            }
        )

        return newUser;
    }catch (error) {
        throw new Error(error);
    }
}

export const singIn = async ( email, password ) => {
    const session = await account.createEmailPasswordSession(email,password);

    if(!session) throw Error;

    return session;
}

export const getCurrentUser = async () => {
    try {
        const curretAccount = await account.get();
        if(!curretAccount) throw Error;
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountid', curretAccount.$id)]
        );
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videosCollectionId
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videosCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videosCollectionId,
            [Query.search('prompt', query)]
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videosCollectionId,
            [Query.equal('creator', userId)]
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error)
    }
}