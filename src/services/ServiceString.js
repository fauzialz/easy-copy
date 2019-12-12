export default {
    toTitleCase: (str) => {
        if(!str) throw new Error("Bad Argument, sir!")
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    frontZero: (str) => ('0' + str).slice(-2)
}