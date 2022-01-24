import makeContent, { Content } from './MakeContent'

export type FormType = {
    id: string;
    title: string;
    listContents: boolean;
    contents: Content[];
    tags: any[];
    deleted: boolean;
    pinned: boolean;
    newEntry: boolean;
    editedOn: Date;
    isFirstTimeData: boolean;
}

function makeForm(): FormType {
    return ({
        id : '',
        title :  '',
        listContents : false,
        contents : [
            makeContent()
        ],
        tags : [],
        deleted : false,
        pinned : false,
        newEntry : true,
        editedOn : new Date(),
        isFirstTimeData: false,
    })
}

export default makeForm