const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');
const bcrypt = require('bcrypt');

const nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Name must not exceed {ARGS[1]} characters.'
  })
];

const emailValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Email must not exceed {ARGS[1]} characters.'
  }),
  validate({
    validator: 'isEmail',
    message: 'Email must be valid.'
  })
];

const ageValidator = [];

const passValidator = [];

// Define the database model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: nameValidator
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    validate: emailValidator
  },
  age: {
    type: Number,
    validate: ageValidator
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    validate: passValidator
  }
});

UserSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

UserSchema.pre('save', async function (next) {
  console.log('just before saving')

  const rounds = 6; // What you want number for round paasword

  const hash = await bcrypt.hash(this.password, rounds);
  this.password = hash;
  next()
})


const User = module.exports = mongoose.model('user', UserSchema);
