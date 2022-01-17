import React, {createContext, FC, useReducer} from 'react'
import { makeForm } from '../../model'
import { SET_FORM, CLEAR_FORM, SET_FORM_NEW_ID } from '../actionTypes'
import LOCAL from '../../config'
import { FormType } from '../../model/MakeForm'

type FormDispatch = {
    type: typeof SET_FORM;
    payload: { newForm: FormType };
} | {
    type: typeof CLEAR_FORM;
    payload?: {};
} | {
    type: typeof SET_FORM_NEW_ID;
    payload: { noteList: FormType[]};
}

type FormCtx = {
    form: FormType;
    dispatch: (f: FormDispatch) => void;
}

const initialForm = makeForm()

const formContext = createContext<FormCtx>({
    form: makeForm(),
    dispatch: () => {}
})
const { Provider } = formContext

const FormProvider: FC = ({ children }) => {
    const [form, dispatch] = useReducer((state: FormType, action: FormDispatch) => {
        switch(action.type) {
            case SET_FORM: {
                const { newForm } = action.payload
                return newForm
            }
            case SET_FORM_NEW_ID: {
                const { noteList } = action.payload
                let temp = {...state}
                if(noteList.length === 0) {
                    temp.id = LOCAL.initPackId
                }else{
                    let id = noteList[noteList.length - 1].id
                    let counter = `${+id.slice(-7) + 1}`
                    id = id.slice(0,id.length - counter.length) + counter
                    temp.id = id
                }
                return temp
            }
            case CLEAR_FORM: {
                return {...makeForm()}
            }
            default: {
                throw new Error()
            }
        }
    }, initialForm)

    return <Provider value={{ form, dispatch }} >{ children }</Provider>
}

export {formContext, FormProvider}
export type { FormDispatch }