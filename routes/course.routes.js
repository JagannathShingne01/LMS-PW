import { Router } from "express";
import { createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controllers/course.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.midddleware.js";

const router = Router();

router.route("/")
    .get(getAllCourses)
    .post(
        isLoggedIn,
        upload.single("thumbnail"),
        createCourse);

router.route("/:id")
    .get(
        isLoggedIn,
        getLecturesByCourseId
        )
    .put(
        isLoggedIn,
        updateCourse
        )
    .delete(
        isLoggedIn,
        removeCourse
        );

export default router;
