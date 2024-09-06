// server/model/Lesson.js

import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    category: { type: String, required: true },
    order: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

lessonSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

lessonSchema.methods.addExercise = function (exerciseId) {
    this.exercises.push(exerciseId);
    return this.save();
};

lessonSchema.methods.removeExercise = function (exerciseId) {
    this.exercises = this.exercises.filter(
        (id) => id.toString() !== exerciseId.toString()
    );
    return this.save();
};

lessonSchema.statics.findByCategory = function (category) {
    return this.find({ category }).sort('order');
};

lessonSchema.statics.findByLevel = function (level) {
    return this.find({ level }).sort('order');
};

lessonSchema.methods.getNextLesson = async function () {
    const nextLesson = await this.model('Lesson')
        .findOne({
            level: this.level,
            order: { $gt: this.order }
        })
        .sort('order');
    return nextLesson;
};

lessonSchema.methods.getPreviousLesson = async function () {
    const previousLesson = await this.model('Lesson')
        .findOne({
            level: this.level,
            order: { $lt: this.order }
        })
        .sort('-order');
    return previousLesson;
};

lessonSchema.methods.getExercisesWithDetails = async function () {
    await this.populate('exercises');
    return this.exercises;
};

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
