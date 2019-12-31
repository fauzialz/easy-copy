import { Obj } from "."

export default {
    /* Fitler mutliple text input before save to DB */
    formFilter : formData => {
      if(!formData.listContents) return formData
      let temp = Obj.deepCopy(formData)
      for(let i in temp.contents) {
        if(temp.contents[i].withInfo && temp.contents[i].info.length === 0) {
          temp.contents[i].withInfo = false
        }
        temp.contents[i].focus = false
        temp.contents[i].infoFocu = false
      }
      return temp
    } 
}