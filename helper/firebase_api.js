const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config()


const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);


const firestore = new Firestore({
    projectId: CREDENTIALS.project_id,
    credentials: {
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    }
});


const userInformation = firestore.collection('userInformation');
const unregisteredUsers = firestore.collection('unregisteredUsers');


const createDocument = async (user) => {

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


const getDocuments = async () => {

    try {
        let querySnapshot = await userInformation.get();
        if (querySnapshot.empty) {
            return {
                status: -1,
                docs: []
            };
        } else {
            let docs = []
            querySnapshot.forEach(QueryDocumentSnapshot => {
                let tempData = QueryDocumentSnapshot.data();
                tempData['id'] = QueryDocumentSnapshot.id;
                docs.push(tempData);
            });
            return {
                status: 1,
                docs: docs
            };
        }
    } catch (error) {
        console.log(`Error at getDocuments --> ${error}`);
        return {
            status: 0,
            docs: []
        };
    }
};


const getDocumentsWithWhere = async (key, value, condition) => {

    try {
        let querySnapshot = await userInformation
            .where(key, condition, value)
            .get();
        if (querySnapshot.empty) {
            return {
                status: -1,
                docs: []
            };
        } else {
            let docs = []
            querySnapshot.forEach(QueryDocumentSnapshot => {
                let tempData = QueryDocumentSnapshot.data();
                tempData['id'] = QueryDocumentSnapshot.id;
                docs.push(tempData);
            });
            return {
                status: 1,
                docs: docs
            };
        }
    } catch (error) {
        console.log(`Error at getDocuments --> ${error}`);
        return {
            status: 0,
            docs: []
        };
    }
};


const updateDocument = async (id, update) => {

    try {
        await userInformation
            .doc(id)
            .set(update, { merge: true });
        return {
            status: 1
        };
    } catch (error) {
        console.log(`Error at updateDocument --> ${error}`);
        return {
            status: 0
        };
    }
};


const deleteDocument = async (id) => {

    try {
        await userInformation
            .doc(id)
            .delete();
        return {
            status: 1
        };
    } catch (error) {
        console.log(`Error at deleteDocument --> ${error}`);
        return {
            status: 0
        };
    }
};


module.exports = {
    createDocument,
    getDocuments,
    getDocumentsWithWhere,
    updateDocument,
    deleteDocument
};