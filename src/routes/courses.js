var express = require('express');
var router = express.Router();
const courseController = require('../app/controllers/courseController');
const verifyMiddleware = require('../app/middleware/verifyMiddleware');
const multerMiddleware = require('../app/middleware/multerMiddleware');

router.post('/store', multerMiddleware.single('image'), courseController.storeCourse);
router.post('/:id/lesson/store', multerMiddleware.single('video'), courseController.storeLesson);

router.get('/create', verifyMiddleware.verifyToken, courseController.createCourse);
router.get('/:id/createlesson', verifyMiddleware.verifyToken, courseController.createLesson);

router.get('/mycourse', verifyMiddleware.verifyToken, courseController.showMyCourse);
router.get('/mycourse/trash', verifyMiddleware.verifyToken, courseController.showMyTrashCourse);
router.patch('/mycourse/:id/restore', courseController.restoreMyCourse);
router.put('/mycourse/:id', courseController.updateMyCourse);
router.delete('/mycourse/:id', courseController.deleteMyCourse);
router.delete('/mycourse/:id/permanenly', courseController.permanenlyDeleteMyCourse);
router.get('/mycourse/:id', verifyMiddleware.verifyToken, courseController.showMyLesson)
router.get('/:id', verifyMiddleware.verifyToken, courseController.showLessonDetail);
router.get('/getLessonDetail/:id', verifyMiddleware.verifyToken, courseController.getLessonDetail);


module.exports = router;
