import { SET_FORM, CLEAR_FORM, SET_FORM_NEW_ID } from "./actionTypes";
import { Obj } from "../services"

export const setForm = newForm => ({type : SET_FORM, payload : Obj.deepCopy({ newForm }) })
export const clearForm = () => ({type : CLEAR_FORM, payload : {} })
export const setFormNewId = noteList => ({type : SET_FORM_NEW_ID, payload : Obj.deepCopy({ noteList }) })