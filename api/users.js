/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {requireUser} = require("./utils")
const { JWT_SECRET } = process.env;

const {
    createUser,
    getUser,
    getUserByUsername,
    getPublicRoutinesByUser,
    getAllRoutinesByUser
  } = require ('../db')

// POST /api/users/register
router.post('/register', async (req, res, next) => {
const { username, password } = req.body;

try {
    const _user = await getUserByUsername(username);
    if (password.length < 8) {
        res.send({
            error: "error",
            message: "Password Too Short!",
            name: "PasswordLengthError",
        })
    }
    if (_user) {
        res.send({
            error: "error",
            message: `User ${username} is already taken.`,
            name: 'UserExistsError',
        });
    }
    const user = await createUser({username,password});  
    const token = jwt.sign({id: user.id, username:username},JWT_SECRET,{expiresIn: '1w'});
      res.send({ 
        message: "thank you for signing up",
        token,
        user
    });
    
    } catch ({ error,name,message }) {
      next({ error,name,message })
    } 
  });
// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username , password } = req.body;
  
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    } 
      try {
        const user = await getUser({ username, password });
        if (!user){
          res.send({message:'user exists' }) 
        }
        if (user) { 
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {expiresIn:"1w"});   // keep the id and username in the token
            res.send({
                user,
                message: "you're logged in!", 
                token
            });
        } else { 
            next({
                name:'IncorrectCredentialsError',
                message:'Username or password is incorrect'
            });
        }

    } catch ({name, message}) {
        next ({name, message});
    }
});


// GET /api/users/me

router.get('/me', requireUser,async (req, res, next) => {
  const user = req.user
  try {
    if (!req.user){
      res.send({
        error:"Unauthorized",
        name:"UnauthorizedUser",
        message: "You must be logged in to perform this action"
    });
    } else {
      res.send(
        user
      );
    }
  } catch({error,name, message}) {
    next({error,name, message});
  }
});

// GET /api/users/:username/routines

router.get('/:username/routines', async (req, res, next) => {
  const { username } = req.params
  console.log(req.params ,"req.params")
  if(req.user.username == username){
    console.log(req.user, "req.user")
    try {
        const routines = await getAllRoutinesByUser({username})
        console.log(routines)
        res.send(routines)
      }catch({name, message}) {
      next({name, message});
      }
  } else{
    try {
      const publicRoutines = await getPublicRoutinesByUser({username});
      console.log(publicRoutines)
      res.send(publicRoutines)
    }catch({name, message}) {
      next({name, message});
    }
  }
});

module.exports = router;
