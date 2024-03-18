const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

(options = {
    separator: '-',
    lang: 'en',
    // uric: true,
    // mark: true,
    custom: ['[', ']', '#'],
    unique: true,
})
const Course = new Schema(
    {
        name: { type: String },
        description: { type: String },
        image: { type: String },
        slug: {
            type: String,
            slug: 'name',
            // unique: true,
        },

    },
    {
        timestamps: true,
    },
);
//add plugin
mongoose.plugin(slug, options);
Course.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});
//custom query
Course.query.sortQuery = function (req) {
    if (req.query.hasOwnProperty('sort')) {
        return this.sort({
            [req.query.column]: req.query.type,
        })
    }
    return this
}

module.exports = mongoose.model('Course', Course);
