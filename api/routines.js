const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');

const {
    getAllRoutines,
    createRoutine,
    updateRoutine,
    getRoutineById,
    destroyRoutine,
    getActivityById,
    attachActivitiesToRoutines
} = require ('../db')
// GET /api/routines
router.get("/", async (req, res, next) => {
    try {
      const getRoutines= await getAllRoutines();
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

    try {
        const creatorId = req.user.id ; 
        if (creatorId === req.user.id){
            const routinesCreated = await createRoutine({creatorId,name,goal,isPublic});
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
router.patch ("/:routineId", requireUser, async (req,res,next) => {
    const { routineId } = req.params;
    const {isPublic, name, goal } = req.body;
    console.log(req.params,req.user, 'req.params');

    try{
        const getRoutineId = await getRoutineById(routineId)
        console.log(getRoutineId.creatorId , req.user.id,"ceratoriD")

        if(getRoutineId.creatorId === req.user.id){
            const updateRoutines = await updateRoutine ({id:routineId,isPublic,name,goal}); 
            res.send(updateRoutines)

        }else{
            res.status(403);
            res.send({
                error:"Unauthorized",
                name: "Unauthorized",
                message: `User ${req.user.username} is not allowed to update ${getRoutineId.name}`
            });
        }
    }catch ({error,name,message}){
        next({
            error:"Unauthorized",
            name: "Unauthorized",
            message: "Unauthorzied "
        })
    }
})


// DELETE /api/routines/:routineId

router.delete ("/:routineId", requireUser, async (req,res,next) => {
    const { routineId} = req.params;
    
    try{
        const getRoutineId = await getRoutineById(routineId)
        console.log(getRoutineId.creatorId , req.user.id,"ceratoriD")

        if(getRoutineId && getRoutineId.creatorId === req.user.id){
            const destroyRoutines = await destroyRoutine (getRoutineId.id,{isPublic:false}); 
            res.send(destroyRoutines)

        }else{
            res.status(403);
            res.send({
                error:"Unauthorized",
                name: "Unauthorized",
                message: `User ${req.user.username} is not allowed to delete ${getRoutineId.name}`
            });
        }
    }catch ({error,name,message}){
        next({
            error:"Unauthorized",
            name: "Unauthorized",
            message: "Unauthorzied "
        })
    }
})


// POST /api/routines/:routineId/activities
router.patch ('/:routineId/activities', async (req,res,next) => {
    const { routineId } = req.params;
    const {activityId,count,duration} = req.body

    try{
        const getRoutine = await getRoutineById(routineId);
        console.log(getRoutine , 'routien')
        const activityById = await getActivityById (activityId);
        console.log(activityById , 'activity id')
        const attachActivity = await attachActivitiesToRoutines(getRoutine);
        console.log(attachActivity, 'attach activity')

        if(getRoutine.id ){
            getRoutine.activities = {
                activityId,
                count,
                duration,
                routineId
            }; 
            res.send(getRoutine.activities)

        }else{
            res.status(403);
            res.send({
                error:"Unauthorized",
                name: "Unauthorized",
                message: `Activity ID ${activityId} already exists in Routine ID ${getRoutine.id}`
            });
        }
    }catch ({error,name,message}){
        next({
            error:"Unauthorized",
            name: "Unauthorized",
            message: "Unauthorzied "
        })
    }
});

module.exports = router;
