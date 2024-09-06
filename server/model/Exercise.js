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

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
