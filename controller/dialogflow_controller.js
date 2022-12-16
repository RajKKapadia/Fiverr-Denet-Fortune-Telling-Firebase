const {
    createUser,
    checkRegistration
} = require('../helper/firebase_api');
const {
    getParametersFromOutputContexts,
    getErrorMessage,
    formatResponseForDialogflow
} = require('../helper/utils');


const confirmsDataPrivacy = (req) => {

    let parameters = getParametersFromOutputContexts(req, 'session-vars');
    let session = req.body.session;

    if (parameters.hasOwnProperty('person')) {

        let oc = [
            {
                name: `${session}/contexts/await-image`,
                lifespanCount: 1
            }
        ]

        let name = parameters.person.name;

        name = name.charAt(0).toUpperCase() + name.slice(1);

        return formatResponseForDialogflow(
            `Thank you ${name} for agreeing to our Terms of use. now I want you do upload the cup image.`,
            oc
        );
    } else {
        return getErrorMessage();
    }
};


const userProvidesName = (req) => {

    let parameters = getParametersFromOutputContexts(req, 'session-vars');
    let session = req.body.session;

    if (parameters.hasOwnProperty('person')) {

        let oc = [
            {
                name: `${session}/contexts/await-data-privacy`,
                lifespanCount: 1
            }
        ]

        let name = parameters.person.name;

        name = name.charAt(0).toUpperCase() + name.slice(1);

        return formatResponseForDialogflow(
            `Good to meet you ${name}, Do you agree the Terms of use and GDPR?`,
            oc
        );
    } else {
        return getErrorMessage();
    }
};


const userProvidesSelfie = (req) => {

    let parameters = getParametersFromOutputContexts(req, 'session-vars');
    let session = req.body.session;

    if (parameters.hasOwnProperty('person')) {

        let oc = [
            {
                name: `${session}/contexts/await-relation-status`,
                lifespanCount: 1
            }
        ]

        let name = parameters.person.name;
        name = name.charAt(0).toUpperCase() + name.slice(1);

        return formatResponseForDialogflow(
            `Ok ${name}. One more question left: What is your relationship status?`,
            oc
        );
    } else {
        return getErrorMessage();
    }
};


const confirmsSendReport = (req) => {

    let parameters = getParametersFromOutputContexts(req, 'session-vars');
    let session = req.body.session;

    let name = parameters.person.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);

    if (parameters.hasOwnProperty('user-status')) {
        return formatResponseForDialogflow(
            `Ok. Hope to see you soon ${name}. Bye for now. [Exits]`
        );
    } else {
        oc = [
            {
                name: `${session}/contexts/await-guest-email`,
                lifespanCount: 1
            }
        ]

        return formatResponseForDialogflow(
            `Okay ${name}, please provide your valid email address to receive a copy.`,
            oc
        );
    }
};


const guestUserProvidesPassword = async (req) => {

    let parameters = getParametersFromOutputContexts(req, 'session-vars');

    let name = parameters.person.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let maritalStatus = parameters['marital-status'];
    let guestEmail = parameters['guest-email'];
    let guestPassword = parameters['guest-password'];
    let age = 0;
    let gender = 'Unknown';

    if (parameters.hasOwnProperty('age')) {
        age = parameters.age;
    }
    if (parameters.hasOwnProperty('gender')) {
        gender = parameters.gender;
    }

    let user = {
        name: name,
        maritalStatus: maritalStatus,
        email: guestEmail,
        password: guestPassword,
        gender: gender,
        age: age
    }

    let result = await createUser(user);

    if (result.status == 1) {
        return formatResponseForDialogflow(
            `Great, you are now my resgitred user ${name}. I hope you enjoyed yourself.`,
            []
        );
    } else {
        return getErrorMessage();
    }
};


const registeredUserProvidesPassword = async (req) => {

    let parameters = getParametersFromOutputContexts(req, 'session-vars');
    let session = req.body.session;

    let email = parameters.email;
    let password = parameters.password;

    let attempt = 0;
    if (parameters.hasOwnProperty('attempt')) {
        attempt += Number(parameters.attempt);
    }

    if (attempt > 2) {
        return formatResponseForDialogflow(
            'It seems that you have facing issue with login, please contact XXXX about this issue.',
            []
        );
    } else {
        let result = await checkRegistration(email, password);
        if (result.status == 1) {
            let oc = [
                {
                    name: `${session}/contexts/await-image`,
                    lifespanCount: 1
                }
            ]

            return formatResponseForDialogflow(
                `Good to see you [User name]. So for this reading session just send me your cup image.`,
                oc
            );
        } else if (result.status == 0) {
            let oc = [
                {
                    name: `${session}/contexts/await-email`,
                    lifespanCount: 1,
                    parameters: {
                        attempt: attempt + 1
                    }
                }
            ]

            return formatResponseForDialogflow(
                `The credentials you provided are not right, please provide your registered email address.`,
                oc
            );
        }
    }
};


module.exports = {
    confirmsDataPrivacy,
    userProvidesName,
    userProvidesSelfie,
    confirmsSendReport,
    guestUserProvidesPassword,
    registeredUserProvidesPassword
};