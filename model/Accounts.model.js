const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  trans_date: String,
  amount: Number,
  method: String,
  user_id: String,
});

const AccountModel = mongoose.model("accounts", accountSchema);

module.exports = {
  AccountModel,
};
