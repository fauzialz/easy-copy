const Form = {
    /* Fitler mutliple text input before save to DB */
    formFilter : formData => {
      let newFormData = {...formData}
      newFormData.newEntry = false
      newFormData.editedOn = new Date()
      if(!newFormData.listContents) return newFormData

      for(let i in newFormData.contents) {
        if(newFormData.contents[i].withInfo && newFormData.contents[i].info.length === 0) {
          newFormData.contents[i].withInfo = false
        }
        newFormData.contents[i].focus = false
        newFormData.contents[i].infoFocu = false
      }
      return newFormData
    }
}

export default Form