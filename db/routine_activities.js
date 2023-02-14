const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {rows : [routineActivity]} = await client.query(`
      INSERT INTO routine_activities ( "routineId", "activityId", count, duration)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT ("routineId", "activityId") DO NOTHING
      RETURNING *
    ;`, [routineId, activityId, count, duration])
    return routineActivity
  }catch (error){
    console.log(error)
  }
}

async function getRoutineActivityById(id) {
  try{
    const{rows: [routineactivity]} = await client.query(`
    SELECT * FROM routine_activities
    WHERE id= ${id}
    ;`)
    return routineactivity;
  }catch(error) {
    console.log(error);
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try{
    const{rows} = await client.query(`
    SELECT * FROM routine_activities
    WHERE "routineId"= ${id}
    ;`)
    return rows;
  }catch(error) {
    console.log(error);
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    const {rows: [routine]} = await client.query(`
      UPDATE routine_activities
      SET ${setString}
      WHERE id = ${ id }
      RETURNING *
    ;`, Object.values(fields))
      return routine
    }catch (error){
      console.log(error)
    }
  }

async function destroyRoutineActivity(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      DELETE FROM routine_activities
      WHERE id = $1 
      RETURNING *;
    `, [id]);

    return routineActivity;
  } catch(error){
      console.log(error);
  }
} 


async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routineActivity]} = await client.query(`
        SELECT * FROM routine_activities
        JOIN routines ON routine_activities."routineId" = routines.id
        WHERE routine_activities.id=$1 AND routines."creatorId"=$2;
        ;`,[routineActivityId, userId]);
    return routineActivity;
  } catch(error){
    console.log(error);
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
