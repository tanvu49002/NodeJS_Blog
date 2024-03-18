const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const User = new Schema(
    {
        username: { type: String, required: true, maxlength: 20, unique: true },
        email: { type: String, required: true, maxlength: 50, unique: true },
        password: { type: String, required: true, minlength: 8 },
        isAdmin: { type: Boolean, default: false },
        registered_courses: [
            {
                course_id: { type: Schema.Types.ObjectId, ref: 'course' },
                register_date: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
    },
);
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});
module.exports = mongoose.model('User', User);
