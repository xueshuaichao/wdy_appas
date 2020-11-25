const {customAlphabet} =  require('nanoid')
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
console.log(nanoid()) //=> "4f90d13a42"
