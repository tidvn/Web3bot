const { model, Schema } = require('mongoose');

module.exports = model('UserSchema',
    new Schema({
        userId: String,
        stakeAddr:String,
        mnemonicHash: String,
    })
);