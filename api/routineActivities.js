const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');
const {
    destroyRoutineActivity,
    getRoutineById,
    getRoutineActivityById,
    updateRoutineActivity,
  } = require ("../db")

// PATCH /api/routine_activities/:routineActivityId

router.patch ("/:routineActivityId", requireUser, async (req,res,next) => {
    const { routineActivityId } = req.params;
    const {duration,count} = req.body
    console.log(routineActivityId , "workdafkljhsdwji tngfliweuctyghvkisuhjdygtlfm")
    try{
        const routineActivity = await getRoutineActivityById(routineActivityId.routineId)
        const routine = await getRoutineById(routineActivity.routineId)
        console.log(routineActivity , "routienavtivig")

        if(routineActivity){
            const updateActivities = await updateRoutineActivity ({id:routineActivity.id,duration,count}); 
            res.send(updateActivities)

        }else if(routine.creatorid !== req.user.id){
            res.status(403)
            res.send({
                error: "Unauthorized",
                name: "Unauthorized",
                message: `User ${req.user.username} is not allowed to update ${routine.name}`,
            })
        }
        else{
            res.send({
                error:"Routine Activity not found",
                name: "Routine Activity not found",
                message: `Routine Activity ${routineActivityId} not found`
            });
        }
        }catch ({error,name,message}){
        next({
            error:"Routine Activity not found",
            name: "Routine Activity not found",
            message: `Routine Activity ${routineActivityId} not found`
        })
    }
})

// DELETE /api/routine_activities/:routineActivityId

router.delete ("/:routineId", requireUser, async (req,res,next) => {
    const { routineActivityId } = req.params;
    
    try{
        const getRoutineActivity = await getRoutineActivityById(routineActivityId)

        if(getRoutineActivity.creatorId === req.user.id){
            const destroyRoutines = await destroyRoutineActivity (getRoutineActivity.id); 
            res.send(destroyRoutines)

        }else{
            res.status(403);
            res.send({
                error:"Unauthorized",
                name: "Unauthorized",
                message: `User ${req.user.username} is not allowed to delete ${getRoutineActivity.name}`
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

module.exports = router;
