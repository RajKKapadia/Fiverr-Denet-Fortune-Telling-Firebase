const express = require('express');
const router = express.Router();

const FIREBASE_API = require('../helper/firebase_api');

router.post('/api/create-document', async (req, res) => {
    let data = req.body;

    let result = await FIREBASE_API.createDocument(data);

    res.send(result);
});

router.get('/api/get-documents', async (req, res) => {

    let result = await FIREBASE_API.getDocuments();

    res.send(result);
});

router.get('/api/get-documents-with-where', async (req, res) => {

    let data = req.body;

    let result = await FIREBASE_API.getDocumentsWithWhere(
        data.key,
        data.value,
        data.condition
    );

    res.send(result);
});

router.put('/api/update-document', async (req, res) => {

    let data = req.body;

    let result = await FIREBASE_API.updateDocument(data.id, data.update);

    res.send(result);
});

router.delete('/api/delete-document', async (req, res) => {

    let data = req.body;

    let result = await FIREBASE_API.deleteDocument(data.id);

    res.send(result);
});

module.exports = {
    router
};