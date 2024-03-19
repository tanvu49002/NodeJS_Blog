const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Lesson = require('./lesson');
const User = require('./user');
const Schema = mongoose.Schema;
// (options = {
//     separator: '-',
//     lang: 'en',
//     // uric: true,
//     // mark: true,
//     custom: ['[', ']', '#'],
//     unique: true,
// })
const Comment = new Schema(
    {
        commentdetail: { type: String },
        id_lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    },
);
//add plugin
// mongoose.plugin(slug, options);
Lesson.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});


module.exports = mongoose.model('Comment', Comment);
