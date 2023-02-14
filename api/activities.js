const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


const {
    getAllActivities,
    getActivityById,
    getActivityByName,
    getPublicRoutinesByActivity,
    createActivity,
    updateActivity,

} = require('../db');
const { requireUser } = require('./utils');

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines' , async (req,res,next) => {
    const activityId = req.params.activityId;

    const activity = await getActivityById(activityId)
    if(activity){
        try {
            const routines = await getPublicRoutinesByActivity(activityId);
            console.log(routines , 'roasdfs')
            res.send(routines);
        }catch({name, message}) {
            next({name, message});
        }
    }else {
        res.send({
            error: "ActivityNotFound",
            name: "ActivityNotFound",
            message: `Activity ${activityId} not found`
        })
    }
});


// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const getActivities = await getAllActivities();
    res.send(getActivities);
  } catch (error) {
    next({
      error: "There are no activities!",
      name: "Activity does not exist",
      message: `There are no activities!`,
    });
  }
});
// POST /api/activities

router.post ('/',requireUser, async (req,res,next) => {
    const {name,description} = req.body
    console.log(req.user , "req.user")
    try {
        const activityexists = await getActivityByName(name);
        if(!activityexists){
            const activitiesCreated = await createActivity({name,description});
            console.log(activitiesCreated, 'activities created')
            res.send(activitiesCreated)
        }else {
            res.send({
                error: `An activity with name ${name} already exists`,
                name: "Activity already exists",
                message: `An activity with name ${name} already exists`,
            })
        }
    } catch(error){
        next({
            error: "ErrorMissingActivity",
            name: "Missing Activity Error",
            message: `Activity not found`,
        });
    }
});

// PATCH /api/activities/:activityId

router.patch ("/:activityId", async (req,res,next) => {
    const { activityId } = req.params;
    const {name,description} = req.body
    console.log(req.params,req.user, 'req.params');

    try{
        const getActivity = await getActivityById(activityId)
        console.log(getActivity , req.user.id,"activityiD")

        if(getActivity){
            const updateActivities = await updateActivity ({name,description}); 
            res.send(updateActivities)

        }else{
            res.send({
                error:"Activity not found",
                name: "Activity not found",
                message: `Activity ${activityId} not found`
            });
        }
    }catch ({error,name,message}){
        next({
            error:"Activity not found",
            name: "Activity not found",
            message: `Activity ${activityId} not found`
        })
    }
})

module.exports = router;
