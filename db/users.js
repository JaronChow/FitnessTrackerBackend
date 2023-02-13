const client = require("./client");
const bcrpyt = require ("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword =  await bcrpyt.hash(password, SALT_COUNT)

  try{
      const { rows: [user] } = await client.query(`
      INSERT INTO users (username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING
      RETURNING *
    ;`, [username,hashedPassword]);
    delete user.password
    return user;
  }catch (error){
    console.log(error)
  }
}

async function getUser({ username, password }) {
try{
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  let passwordsMatch = await bcrpyt.compare(password, hashedPassword) 

  if (passwordsMatch) {
    // return the user object (without the password)
      delete user.password
      return user
  } 
  }catch (error) {
    console.log(error)
  } 
}

async function getUserById(userId) {
  try{
    const { rows: [ user ] } = await client.query(`
      SELECT id, username
      FROM users
      WHERE id= $1;
    `, [userId]);
    return user;
  }catch (error) {
    console.log(error)
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username = $1;
    `, [username]);

    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername
}
