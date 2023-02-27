import messages from './messages.json';

const Languages = {
    hu: "hu"
}
const MainObjects = {
    global: "global",
    field: "field"
}
const ObjectProperties = {
    adding: "adding",
    deleting: "deleting",
    editing: "editing",
    share: "share"
}
const MessageStatusCodes = {
    error: "error",
    warning: "warning",
    success: "success",
    notfound: "notfound"
}
export {
    Languages,
    MainObjects,
    ObjectProperties,
    MessageStatusCodes
}

/*

Next time: I have to rewrite this function x(lang: string, path: string)

    lang: en path: 'global.field.welcomeText' => "Welcome"
    lang: hu path: 'global.field.welcomeText' => "Üdvözöljük"

*/


/*

@param lang => What kind of language would you like (hu or en)?
@param field => What kind of field would you like (e-mail or password)?
@param action => Will this be an adding or a deleting action?
@param status => Will this be an error message or a success message?

*/
const getGlobalMessage = (lang, field, action, status) => {
    // validating the specified language
    const isLanguageExists = Languages[lang] ? Languages[lang] : undefined;
    if (!isLanguageExists) {
        return "This language is not available at the moment.";
    }

    // getting the object of the specified language (for example: "hu-HU": { ... })
    const languageObject = messages['languages'][lang];

    // getting the object of the specified language (for example: "global": { ... })
    const globalObject = languageObject[MainObjects.global];

    // what kind of action would you like?
    const isValidAction = ObjectProperties[action] ? ObjectProperties[action] : undefined;
    if (!isValidAction) {
        return "The given action is not available.";
    }

    // getting the object from the global object (for example: "adding": { ... })
    const actionObject = globalObject[action];

    // check that the specified status is exists or not
    const isStatusExists = MessageStatusCodes[status] ? MessageStatusCodes[status] : undefined;
    if (!isStatusExists) {
        return "The status what you give is not available!"
    }

    // getting the message
    let message = actionObject[status];
    const editableSentenceMarker = messages['markers']['editableSentence'];
    const replacedField = messages['markers']['replacedField'];

    if (message.startsWith(editableSentenceMarker)) {
        message = message.substring(1);
        return message;
    }

    message = message.replace(`${replacedField}`, field);
    return message;
}

/*

@param lang => What kind of language would you like (hu or en)?
@param field => What kind of field would you like (e-mail or password)?
@param status => Will this be an error message or a success message?

*/
const getFieldMessage = (lang, field, status) => {
    // validating the specified language
    const isLanguageExists = Languages[lang] ? Languages[lang] : undefined;
    if (!isLanguageExists) {
        return "This language is not available at the moment.";
    }

    // getting the object of the specified language (for example: "hu-HU": { ... })
    const languageObject = messages['languages'][lang];

    // getting the object of the specified language (for example: "field": { ... })
    const fieldObject = languageObject[MainObjects.field];

    // check that the specified status is exists or not
    const isStatusExists = MessageStatusCodes[status] ? MessageStatusCodes[status] : undefined;
    if (!isStatusExists) {
        return "The status what you give is not available!"
    }

    // the type (for example: "error") is exists ?
    const isTypeExists = fieldObject[status] ? fieldObject[status] : undefined
    if (!isTypeExists) {
        return `This property (${status}) is not exists.`;
    }

    // for example: "error": "..."
    let message = fieldObject[status];
    const editableSentenceMarker = messages['markers']['editableSentence'];
    const replacedField = messages['markers']['replacedField'];

    if (message.startsWith(editableSentenceMarker)) {
        message = message.substring(1, message.length);
        return message;
    }

    message = message.replace(`${replacedField}`, field);
    return message;
}

export {
    getFieldMessage,
    getGlobalMessage
}