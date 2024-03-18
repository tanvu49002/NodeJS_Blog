const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Course = require('./course');
const Schema = mongoose.Schema;
(options = {
    separator: '-',
    lang: 'en',
    // uric: true,
    // mark: true,
    custom: ['[', ']', '#'],
    unique: true,
})
const Lesson = new Schema(
    {
        title: { type: String },
        video: { type: String },
        id_course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        slug: {
            type: String,
            slug: 'title',
            // unique: true,
        },
    },
    {
        timestamps: true,
    },
);
//add plugin
mongoose.plugin(slug, options);
Lesson.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});


module.exports = mongoose.model('Lesson', Lesson);
