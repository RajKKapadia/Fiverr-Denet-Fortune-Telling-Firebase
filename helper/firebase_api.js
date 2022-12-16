const { Firestore } = require('@google-cloud/firestore');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
require('dotenv').config();


const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);


const firestore = new Firestore({
    projectId: CREDENTIALS.project_id,
    credentials: {
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    }
});


initializeApp({
    credential: cert(CREDENTIALS)
});


const userInformation = firestore.collection('userInformation');
const unregisteredUsers = firestore.collection('unregisteredUsers');
const selfieBucket = getStorage().bucket('fortune-teller-coffee.appspot.com');


const uploadImage = async (imagePath, destination) => {

    try {
        let response = await selfieBucket.upload(
            imagePath,
            {
                destination: destination,
                metadata: {
                    cacheControl: "public, max-age=315360000",
                    contentType: "image/jpeg"
                }
            }
        );

        return {
            status: 1,
            response: response['1'],
            message: 'Success'
        };
    } catch (error) {
        return {
            status: 0,
            response: {},
            message: error.message
        };
    }
};


const checkRegistration = async (email, password) => {

    try {
        let querySnapshot = await userInformation
            .where('email', '==', email)
            .get();
        if (querySnapshot.empty) {
            return {
                status: 0,
                docs: []
            };
        } else {
            let docs = []
            querySnapshot.forEach(QueryDocumentSnapshot => {
                let tempData = QueryDocumentSnapshot.data();
                console.log(tempData);
                if (tempData.password === password) {
                    tempData['id'] = QueryDocumentSnapshot.id;
                    docs.push(tempData);
                }
            });
            if (docs.length != 0) {
                return {
                    status: 1,
                    docs: docs
                };
            } else {
                return {
                    status: 0,
                    docs: []
                };
            }
        }
    } catch (error) {
        console.log(`Error at getDocuments --> ${error.message}`);
        return {
            status: -1,
            docs: []
        };
    }
};


const createUser = async (user) => {

    try {
        let record = await userInformation.add(user);
        return {
            status: 1,
            id: record.id
        };
    } catch (error) {
        console.log(`Error at createDocument --> ${error}`);
        return {
            status: 0,
            id: ''
        };
    }
};


module.exports = {
    uploadImage,
    checkRegistration,
    createUser
};