import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    category: { type: String, required: true },
    order: { type: Number, required: true },
    content: { type: String, required: true },
    vocabulary: [
        {
            czech: { type: String, required: true },
            russian: { type: String, required: true },
            english: { type: String, required: true }
        }
    ],
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

lessonSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

lessonSchema.methods.addExercise = function (exerciseData) {
    this.exercises.push(exerciseData);
    return this.save();
};

lessonSchema.methods.removeExercise = function (exerciseId) {
    this.exercises = this.exercises.filter(
        (exercise) => exercise.toString() !== exerciseId.toString()
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
    return this.model('Lesson')
        .findOne({
            level: this.level,
            order: { $gt: this.order }
        })
        .sort('order');
};

lessonSchema.methods.getPreviousLesson = async function () {
    return this.model('Lesson')
        .findOne({
            level: this.level,
            order: { $lt: this.order }
        })
        .sort('-order');
};

lessonSchema.methods.addVocabulary = function (czech, russian, english) {
    this.vocabulary.push({ czech, russian, english });
    return this.save();
};

lessonSchema.methods.removeVocabulary = function (czechWord) {
    this.vocabulary = this.vocabulary.filter(
        (word) => word.czech !== czechWord
    );
    return this.save();
};

lessonSchema.statics.getRandomLessons = function (count, level) {
    const query = level ? { level } : {};
    return this.aggregate([{ $match: query }, { $sample: { size: count } }]);
};

lessonSchema.methods.updateProgress = async function (userId, progress) {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(userId, {
        $set: { [`progress.lessons.${this._id}`]: progress }
    });
};

lessonSchema.methods.getAverageCompletionTime = async function () {
    const Exercise = mongoose.model('Exercise');
    const exercises = await Exercise.find({ _id: { $in: this.exercises } });
    const totalTime = exercises.reduce(
        (sum, exercise) => sum + (exercise.averageCompletionTime || 0),
        0
    );
    return totalTime / exercises.length;
};

lessonSchema.statics.getLessonsByDifficulty = function (difficulty) {
    return this.find({ level: difficulty }).sort('order');
};

lessonSchema.methods.getRelatedLessons = function () {
    return this.model('Lesson')
        .find({
            category: this.category,
            _id: { $ne: this._id }
        })
        .limit(3);
};

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
