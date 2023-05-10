const bcrypt = require('bcrypt');

const encryptPassword = async (password) => {
  try {
    const saltRounds = 3; // Number of salt rounds for bcrypt hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword)
    return hashedPassword;
  } catch (error) {
    console.log(error);
 
    throw new Error('Error encrypting password');
  }
};


module.exports={encryptPassword}