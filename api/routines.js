const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');

const {
    getAllRoutines,
    createRoutine,
    updateRoutine,
    destroyRoutine,
} = require ('../db')
// GET /api/routines
router.get("/", async (req, res, next) => {
    try {
      const getRoutines= await getAllRoutines();
      console.log(getRoutines)
      res.send(getRoutines);
    } catch (error) {
      next({
        error: "There are no routines!",
        name: "Routine does not exist",
        message: `There are no routines!`,
      });
    }
  });
// POST /api/routines
router.post ('/', requireUser, async (req,res,next) => {
    const {name,goal,isPublic} = req.body;

    const creatorId = req.user.id; //logged in user
    console.log(req.user, "ufaosdijf;kldsjflkae")
    try {
        if (creatorId){
            const routinesCreated = await createRoutine({creatorId,name,goal,isPublic});
            console.log(routinesCreated)
            res.send(routinesCreated)
        }else{
            res.send({
                error: "Invalid User!",
                name: "Must be logged in",
                message: `You must be logged in to perform this action!`,
            });
        }
    } catch({error,name, message}) {
        next({error,name, message});
    }
});


// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
