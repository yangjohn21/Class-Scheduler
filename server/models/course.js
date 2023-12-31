const mongoose = require('mongoose');

const prerequisitesSchema = mongoose.Schema({
    options: [String]
});

const courseSchema = mongoose.Schema({
    name: String,
    key: String,
    credits: Number,
    number: String,
    professors: [String],
    subject: String,
    description: String,
    prerequisites: [String]
});

const Course = mongoose.model('Course', courseSchema)

module.exports = { Course, courseSchema };
