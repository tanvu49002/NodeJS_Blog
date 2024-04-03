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
        id_lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        commentdetail: { type: String },
    },
    {
        timestamps: true,
    },
);
//add plugin
// mongoose.plugin(slug, options);
Comment.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});


module.exports = mongoose.model('Comment', Comment);
