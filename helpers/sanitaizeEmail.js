module.exports = sanitaizeEmail = (text) =>{
    // Use regular expression to match digits or signs at the beginning of the string
    const regex = /^[0-9\W_]+/;
    return text.replace(regex, '');
}