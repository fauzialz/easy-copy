import LOCAL from "../config"
import { makeForm } from "../model"
import makeContent, { Content } from "../model/MakeContent"

interface ContentListType {
    title: string;
    contents: Content[];
    pinned?: boolean;
}

const contentList: ContentListType[] = [
    {
        title: 'First Time?',
        contents: [ makeContent('If you can read this, it means that this is your first time using this app, or your browser local data has been wiped out 🤔')],
        pinned: true,
    },
    {
        title: 'Save your text for later and copy it with ease',
        contents: [ makeContent('You can copy the text by clicking the copy icon on the right ----->')],
        pinned: true,
    },
    {
        title: '⚠️',
        contents: [ makeContent("All data is saved locally. Saving sensitive information isn't the purpose of this app")],
        pinned: true,
    },
    {
        title: '',
        contents: [ makeContent('Your pinned text will be prioritized and placed in the top')],
        pinned: true,
    },
    {
        title: '',
        contents: [ makeContent('This is unpinned text. Looks regular, right?') ]
    },
    {
        title: 'Contact Creator',
        contents: [
            makeContent('Hi my name is Fauzi, and btw you can make multiple contents like this'),
            makeContent('alaziz.fauzi@gmail.com', 'Email'),
            makeContent('@fauzial', 'Twitter'),
        ]
    },
    {
        title: 'Start New ✨',
        contents: [ makeContent("All of this is initial data. You can delete it and start new by clicking the Reset button. If you already add new data, don't worry, we will keep it for you") ]
    }
]

const baseId = LOCAL.initPackId

const generateInitialNotes = () => {
    const initValues = contentList.map((item, i) => {
        const initForm = makeForm()
        const counter = String(i + 1)
        const id = baseId.slice(0,baseId.length - counter.length) + counter
        const sequencialDate = new Date()
        sequencialDate.setSeconds(sequencialDate.getSeconds() + (contentList.length - i))

        initForm['id'] = id
        initForm['title'] = item.title
        initForm['contents'] = item.contents
        initForm['listContents'] = item.contents.length > 1
        initForm['pinned'] = !!item.pinned
        initForm['isFirstTimeData'] = true
        initForm['newEntry'] = false
        initForm['editedOn'] = sequencialDate
        return initForm
    })

    return initValues
}

export { generateInitialNotes }