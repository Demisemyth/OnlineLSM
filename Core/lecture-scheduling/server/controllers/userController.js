const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      isAdmin,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    console.log(error);
  }
};

module.exports.allInstructors = async (req, res, next) => {
  try {

    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.json({ msg: "User id is required " });
    }


    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};


const Course = require("../models/courseModel");

module.exports.addCourse = async (req, res, next) => {
  try {

    const { name, level, description, image } = req.body;


    const newCourse = new Course({
      name,
      level,
      description,
      image,
    });


    const savedCourse = await newCourse.save();


    return res.json({ status: true, savedCourse });
  } catch (error) {

    next(error);
  }
};

module.exports.getCourse = async (req, res, next) => {
  try {

    const courses = await Course.find();


    return res.json({ status: true, courses });
  } catch (error) {

    next(error);
  }
};

module.exports.getCourseName = async (req, res, next) => {
  try {
    const { courseId } = req.params;


    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.json({ courseName: course.name });
  } catch (error) {
    next(error);
  }
};


const CourseSchedule = require("../models/scheduleModel");

module.exports.addSchedule = async (req, res, next) => {
  try {
    const { course, lecture, date, instructor, location } = req.body;


    const newSchedule = new CourseSchedule({
      course,
      lecture,
      date: new Date(date),
      instructor,
      location,
    });


    const savedSchedule = await newSchedule.save();


    res.status(201).json(savedSchedule);
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports.getSchedule = async (req, res, next) => {
  try {
    const { courseName } = req.query;


    if (!courseName) {
      return res.status(400).json({ error: "Course name is required." });
    }


    const schedules = await CourseSchedule.find({ course: courseName });


    res.status(200).json({ schedules });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getUserSchedule = async (req, res, next) => {
  try {
    const { currUser } = req.query;
    if (!currUser) {
      return res.status(400).json({ error: "No user is here! To display" });
    }


    const schedules = await CourseSchedule.find({ instructor: currUser });

    res.status(200).json({ schedules });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports.checkAvailable = async (req, res, next) => {
  const { username, date } = req.body;

  try {
    const existingSchedule = await CourseSchedule.findOne({
      instructor: username,
      date: new Date(date),
    });

    if (existingSchedule) {
      return res
        .status(409)
        .json({ error: "Instructor is already busy on this date." });
    }

    return res
      .status(200)
      .json({ message: "Instructor is available on this date." });
  } catch (error) {
    console.error("Error checking instructor availability:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}