const {
  register,
  login,
  allInstructors,
  logOut,
  addCourse,
  getCourse,
  getCourseName,
  addSchedule,
  getSchedule,
  getUserSchedule,
  checkAvailable,
} = require("../controllers/userController");

const router = require("express").Router();


router.post("/register", register);
router.post("/login", login);
router.get("/allinstructors/:id", allInstructors);
router.get("/logout/:id", logOut);


router.post("/addcourse", addCourse);
router.get("/getcourse", getCourse);
router.get("/getcoursename/:courseId", getCourseName);


router.post("/addschedule", addSchedule);
router.get("/getschedule",getSchedule);
router.get("/getuserschedule", getUserSchedule);
router.post("/checkInstructorAvailability", checkAvailable);


router.delete("/deleteinstructor/:id", async (req, res) => {
  try {
    await Instructor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Instructor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting instructor" });
  }
});


router.delete("/deletecourse/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course" });
  }
});


module.exports = router;
