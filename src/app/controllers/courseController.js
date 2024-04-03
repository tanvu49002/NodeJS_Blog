const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
const Course = require('../models/course');
const Lesson = require('../models/lesson')
const User = require('../models/user')
const Comment = require('../models/comment')

const PAGE_SIZE = 4
class CourseController {
    //[get] course/getLessonDetail?id
    getLessonDetail(req, res, next) {
        const lessonId = req.params.id;
        Lesson.findOne({ _id: lessonId })
            .then(lesson => {
                if (!lesson) {
                    return res.status(404).json({ error: 'Lesson not found' });
                }
                // Trả về dữ liệu của bài học dưới dạng JSON
                res.json({
                    lesson: mongooseToObject(lesson)
                });
            })
            .catch(error => next(error));
    }
    //[get] course/:idcourse
    showLessonDetail(req, res, next) {
        let user = req.user;
        let courseId = req.params.id;
        let lessonId = req.query.id;

        if (!lessonId) {
            Lesson.findOne({ id_course: courseId })
                .then(lesson => {
                    return Promise.all([User.findOne({ _id: user.userId }), Lesson.find({ id_course: courseId }), lesson, Comment.find({ id_lesson: lesson._id }).populate('id_user')])
                })

                .then(([user, lessons, lessonDetails, comments]) => {
                    res.render('lesson', {
                        user: mongooseToObject(user),
                        lessons: multipleMongooseToObject(lessons),
                        lessonDetails: mongooseToObject(lessonDetails),
                        lessonId: lessonDetails._id,
                        comments: multipleMongooseToObject(comments),
                    });
                })
                .catch((error) => next(error));
        } else {
            Promise.all([User.findOne({ _id: user.userId }), Lesson.find({ id_course: courseId }), Lesson.findOne({ _id: lessonId }), Comment.find({ id_lesson: lessonId }).populate('id_user')])
                .then(([user, lessons, lessonDetails, comments]) => {
                    res.render('lesson', {
                        user: mongooseToObject(user),
                        lessons: multipleMongooseToObject(lessons),
                        lessonDetails: mongooseToObject(lessonDetails),
                        lessonId,
                        comments: multipleMongooseToObject(comments),
                    });
                })
                .catch((error) => next(error));
        }

    }
    //[get] course/create
    createCourse(req, res) {
        let user = req.user;
        User.findOne({ _id: user.userId })
            .then((user) => {
                res.render('createcourse', {
                    user: mongooseToObject(user)
                });
            })
            .catch((error) => next(error));

    }
    //[post] course/store
    storeCourse(req, res, next) {
        const { name, description } = req.body;

        // Kiểm tra xem file đã được tải lên chưa
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Lưu đường dẫn vào cơ sở dữ liệu
        const imagePath = '/img/' + req.file.filename;
        const course = new Course({
            name: name,
            description: description,
            image: imagePath,
        });
        course
            .save()
            .then(() => res.redirect('/course/mycourse?page=1'))
            .catch((error) => next(error));
    }

    //[get] course/mycourse
    showMyCourse(req, res, next) {
        let user = req.user;
        let page = req.query.page;
        if (page) {
            page = parseInt(page)
            if (page < 1) {
                page = 1
            }
            let start = (page - 1) * PAGE_SIZE
            Promise.all([Course.find({}).skip(start).limit(PAGE_SIZE), Course.countDocumentsDeleted(), Course.countDocuments(), User.findOne({ _id: user.userId })])
                .then(([courses, deletedcount, countcourse, user]) => {
                    res.render('managecourse', {
                        courses: multipleMongooseToObject(courses),
                        deletedcount,
                        totalpage: Math.ceil(countcourse / PAGE_SIZE),
                        user: mongooseToObject(user),
                    });

                })
                .catch((error) => next(error));
        } else {
            // Promise.all([Course.find({}).sortQuery(req), Course.countDocumentsDeleted()])
            //     .then(([courses, deletedcount]) => {
            //         res.render('managecourse', {
            //             deletedcount,
            //             courses: multipleMongooseToObject(courses),
            //         });
            //         // res.json(courses)
            //     })
            //     .catch((error) => next(error));
        }

    }
    //[put] course/mycourse/:id
    updateMyCourse(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/course/mycourse'))
            .catch(next);
    }
    //[delete] course/mycourse/:id
    deleteMyCourse(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('/course/mycourse?page=1'))
            .catch(next);
    }
    //[get] course/mycourse/trash
    showMyTrashCourse(req, res, next) {
        let user = req.user;
        let page = req.query.page;
        if (page) {
            page = parseInt(page)
            if (page < 1) {
                page = 1;
            }
            let start = (page - 1) * PAGE_SIZE;
            Promise.all([Course.findWithDeleted({ deleted: true }).skip(start).limit(PAGE_SIZE), Course.countDocumentsDeleted(), Course.countDocuments(), User.findOne({ _id: user.userId })])
                .then(([courses, countcoursedeleted, countcourse, user]) => {
                    res.render('trashcourse', {
                        courses: multipleMongooseToObject(courses),
                        countcourse,
                        totalpage: Math.ceil(countcoursedeleted / PAGE_SIZE),
                        user: mongooseToObject(user),
                    });
                })
                .catch((error) => next(error));
        }
    }
    //[patch] course/mycourse/:id/restore
    restoreMyCourse(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[delete] course/mycourse/:id/permanenly
    permanenlyDeleteMyCourse(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/course/mycourse/trash?page=1'))
            .catch(next);
    }
    //[get] course/mycourse/:id
    showMyLesson(req, res, next) {
        let user = req.user;
        Promise.all([User.findOne({ _id: user.userId }), Lesson.find({ id_course: req.params.id }), Course.findOne({ _id: req.params.id })])
            .then(([user, lessons, course]) => {
                res.render('managelesson', {
                    course: mongooseToObject(course),
                    user: mongooseToObject(user),
                    lessons: multipleMongooseToObject(lessons),
                });
            })
            .catch((error) => next(error));
    }
    //[get] :id/createlesson
    createLesson(req, res) {
        let user = req.user;
        Promise.all([User.findOne({ _id: user.userId }), Course.findOne({ _id: req.params.id })])
            .then(([user, course]) => {
                res.render('createlesson', {
                    course: mongooseToObject(course),
                    user: mongooseToObject(user),
                });
            })
            .catch((error) => next(error));
    }
    //[post] :id/lesson/store
    storeLesson(req, res, next) {
        const title = req.body.title;
        const id_course = req.params.id;
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const videoPath = '/video/' + req.file.filename;
        const lesson = new Lesson({
            title: title,
            video: videoPath,
            id_course: id_course,
        });
        lesson
            .save()
            .then(() => res.redirect('/course/mycourse/' + id_course))
            .catch((error) => next(error));
    }
    //[post] /course/:idlesson/comment/store
    storeComment(req, res, next) {
        const commentdetail = req.body.commentdetail;
        const courseId = req.params.id;
        let id_lesson = req.query.id;
        const user = req.user;

        // Kiểm tra nếu không có id_lesson từ URL, thì tìm lesson đầu tiên trong khoá học
        if (!id_lesson) {
            Lesson.findOne({ id_course: courseId })
                .then(lesson => {
                    if (!lesson) {
                        throw new Error('No lesson found in this course');
                    }
                    // Gán giá trị id_lesson tìm được từ database
                    id_lesson = lesson._id;
                    // Tạo mới comment sau khi đã xác định được id_lesson
                    const comment = new Comment({
                        id_lesson,
                        id_user: user.userId,
                        commentdetail,
                    });
                    return comment.save();
                })
                .then(() => res.redirect('back'))
                .catch(error => next(error));
        } else {
            // Trong trường hợp có id_lesson từ URL, tạo mới comment ngay lập tức
            const comment = new Comment({
                id_lesson,
                id_user: user.userId,
                commentdetail,
            });
            comment
                .save()
                .then(() => res.redirect('back'))
                .catch(error => next(error));
        }
    }
}

module.exports = new CourseController();
