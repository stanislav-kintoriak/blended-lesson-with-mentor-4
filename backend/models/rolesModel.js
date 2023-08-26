const { Schema, model } = require("mongoose");

const rolesSchema = new Schema({
  value: {
    type: String,
    ref: "user",
  },
});

module.exports = model("roles", rolesSchema);
