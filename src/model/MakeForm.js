import makeContent from './MakeContent'

function makeForm() {
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
        editedOn : new Date()
    })
}

export default makeForm