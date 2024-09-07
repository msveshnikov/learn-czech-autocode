// server/model/Exercise.js

import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['multipleChoice', 'fillInTheBlank', 'listeningComprehension']
    },
    question: {
        type: String,
        required: true
    },
    answers: [
        {
            type: String
        }
    ],
    correctAnswer: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['vocabulary', 'grammar', 'pronunciation'],
        required: true
    },
    audioUrl: {
        type: String
    },
    lastReviewed: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

exerciseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

exerciseSchema.methods.checkAnswer = function (userAnswer) {
    return userAnswer === this.correctAnswer;
};

exerciseSchema.methods.updateLastReviewed = function () {
    this.lastReviewed = Date.now();
    return this.save();
};

exerciseSchema.statics.findByCategory = function (category) {
    return this.find({ category });
};

exerciseSchema.statics.findByDifficulty = function (difficulty) {
    return this.find({ difficulty });
};

exerciseSchema.statics.findByType = function (type) {
    return this.find({ type });
};

exerciseSchema.methods.getHint = function () {
    if (this.type === 'multipleChoice') {
        return this.answers[Math.floor(Math.random() * this.answers.length)];
    } else if (this.type === 'fillInTheBlank') {
        return this.correctAnswer.charAt(0);
    } else {
        return 'Listen carefully to the audio';
    }
};

exerciseSchema.methods.calculateScore = function (timeSpent) {
    const baseScore = 10;
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };
    const timeBonus = Math.max(0, 30 - timeSpent);
    return Math.round(
        baseScore * difficultyMultiplier[this.difficulty] + timeBonus
    );
};

exerciseSchema.statics.getRandomExercises = function (
    count,
    category,
    difficulty
) {
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    return this.aggregate([{ $match: query }, { $sample: { size: count } }]);
};

exerciseSchema.methods.getNextExercise = async function (lessonId) {
    const lesson = await mongoose.model('Lesson').findById(lessonId);
    const exerciseIndex = lesson.exercises.findIndex(
        (ex) => ex.toString() === this._id.toString()
    );
    if (exerciseIndex < lesson.exercises.length - 1) {
        return mongoose
            .model('Exercise')
            .findById(lesson.exercises[exerciseIndex + 1]);
    }
    return null;
};

exerciseSchema.statics.findByLessonId = function (lessonId) {
    return mongoose.model('Lesson').findById(lessonId).populate('exercises');
};

exerciseSchema.methods.updateDifficulty = function (userPerformance) {
    const difficultyLevels = ['easy', 'medium', 'hard'];
    const currentIndex = difficultyLevels.indexOf(this.difficulty);
    if (userPerformance > 0.8 && currentIndex < 2) {
        this.difficulty = difficultyLevels[currentIndex + 1];
    } else if (userPerformance < 0.4 && currentIndex > 0) {
        this.difficulty = difficultyLevels[currentIndex - 1];
    }
    return this.save();
};

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
