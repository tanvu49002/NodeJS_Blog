const multer = require('multer');

const appRoot = require('app-root-path');
// Cấu hình Multer để lưu trữ file ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = appRoot + '/src/public/';

        // Kiểm tra loại file và xác định thư mục đích
        if (file.mimetype.startsWith('image/')) {
            uploadPath += 'img/';
        } else if (file.mimetype.startsWith('video/')) {
            uploadPath += 'video/';
        } else {
            // Nếu không phải ảnh hoặc video, bạn có thể xử lý tùy thuộc vào yêu cầu của bạn
            return cb(new Error('Invalid file type'));
        }

        // Gọi lại với đường dẫn đích được xác định
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const upload = multer({ storage: storage });

module.exports = upload;