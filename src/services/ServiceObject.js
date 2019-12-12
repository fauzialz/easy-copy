export default {
    deepCopy: (obj) => JSON.parse(JSON.stringify(obj)),
    isEmpty: (obj) => Object.entries(obj).length === 0 && obj.constructor === Object,
    deleteProps: (obj, propNames) => {
        if(propNames.constructor !== Array) throw new Error('Wrong argument type. propNames not an array!')
        propNames.forEach(name => {
            if (obj[name] === undefined) {
                throw new Error(`Object don't have property named "${name}"`)
            }else delete obj[name]
        })
        return obj
    }
}