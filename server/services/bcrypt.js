const bcrypt = require("bcrypt");

const saltRound = 10;

module.exports = {
    //Encrypts the password
    hash: (plainTextPwd) => {
        return bcrypt.hash(plainTextPwd,saltRound);
    },
    //Reveals the encryption of the password
    verify: (plainTextPwd,hash) => {
        return bcrypt.compare(plainTextPwd,hash);
    }
}



 