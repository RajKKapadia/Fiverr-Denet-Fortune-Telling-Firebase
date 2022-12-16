const formatResponseForDialogflow = (text, oc) => {

    let responseData = {};

    responseData['fulfillmentText'] = text;

    if (oc.length > 0) {
        responseData['outputContexts'] = oc
    }

    return responseData;
};


const getErrorMessage = () => {

    return formatResponseForDialogflow(
        'We are facing a technical issue, please try after sometimes.',
        []
    );
};


const getParametersFromOutputContexts = (req, contextName) => {

    let outputContexts = req.body.queryResult.outputContexts;

    let parameters = {}

    outputContexts.forEach(outputContext => {
        let session = outputContext.name;
        if (session.includes(`/contexts/${contextName}`)) {
            if (outputContext.hasOwnProperty('parameters')) {
                parameters = outputContext.parameters;
            }
        }
    });

    return parameters
};


module.exports = {
    formatResponseForDialogflow,
    getErrorMessage,
    getParametersFromOutputContexts
};