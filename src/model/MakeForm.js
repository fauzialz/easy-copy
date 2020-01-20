import makeContent from './MakeContent'

function makeForm() {
    return Object.freeze({
        id : '',
        title :  '',
        listContents : false,
        contents : [
            makeContent()
        ],
        tags : [],
        deleted : false,
        pinned : false,
        newEntry : true
    })
}

export default makeForm