import { Obj } from "."

export default {
    /*  Check on multiple text mode if info is empty */
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