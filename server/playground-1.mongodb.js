// server/playground-1.mongodb.js

/* global use, db */

use('learn_czech');

// Insert sample lessons
db.lessons.insertMany([
    {
        title: 'Basic Greetings',
        description: 'Learn common Czech greetings',
        level: 'beginner',
        category: 'conversation',
        order: 1,
        content: 'In this lesson, we will learn basic Czech greetings.',
        vocabulary: [
            { czech: 'Ahoj', russian: 'Привет', english: 'Hello' },
            { czech: 'Dobrý den', russian: 'Добрый день', english: 'Good day' },
            {
                czech: 'Na shledanou',
                russian: 'До свидания',
                english: 'Goodbye'
            }
        ]
    },
    {
        title: 'Numbers 1-10',
        description: 'Learn to count from 1 to 10 in Czech',
        level: 'beginner',
        category: 'numbers',
        order: 2,
        content: 'This lesson covers the numbers from 1 to 10 in Czech.',
        vocabulary: [
            { czech: 'Jedna', russian: 'Один', english: 'One' },
            { czech: 'Dva', russian: 'Два', english: 'Two' },
            { czech: 'Tři', russian: 'Три', english: 'Three' }
        ]
    }
]);

// Insert sample exercises
db.exercises.insertMany([
    {
        type: 'multipleChoice',
        question: 'How do you say "Hello" in Czech?',
        answers: ['Ahoj', 'Na shledanou', 'Dobrý den'],
        correctAnswer: 'Ahoj',
        difficulty: 'easy',
        category: 'vocabulary'
    },
    {
        type: 'fillInTheBlank',
        question: 'Complete the sentence: "_____ den" (Good day)',
        correctAnswer: 'Dobrý',
        difficulty: 'medium',
        category: 'grammar'
    },
    {
        type: 'listeningComprehension',
        question: 'Listen and choose the correct number',
        answers: ['Jedna', 'Dva', 'Tři'],
        correctAnswer: 'Dva',
        difficulty: 'medium',
        category: 'listening',
        audioUrl: 'https://example.com/audio/dva.mp3'
    }
]);

// Link exercises to lessons
const basicGreetingsLesson = db.lessons.findOne({ title: 'Basic Greetings' });
const numbersLesson = db.lessons.findOne({ title: 'Numbers 1-10' });

const greetingExercise = db.exercises.findOne({
    question: 'How do you say "Hello" in Czech?'
});
const grammarExercise = db.exercises.findOne({
    question: 'Complete the sentence: "_____ den" (Good day)'
});
const listeningExercise = db.exercises.findOne({
    question: 'Listen and choose the correct number'
});

db.lessons.updateOne(
    { _id: basicGreetingsLesson._id },
    {
        $push: {
            exercises: { $each: [greetingExercise._id, grammarExercise._id] }
        }
    }
);

db.lessons.updateOne(
    { _id: numbersLesson._id },
    { $push: { exercises: listeningExercise._id } }
);

// Create indexes for better performance
db.lessons.createIndex({ level: 1, order: 1 });
db.lessons.createIndex({ category: 1 });
db.exercises.createIndex({ category: 1, difficulty: 1 });

// Sample query to get all beginner lessons with their exercises
db.lessons
    .aggregate([
        { $match: { level: 'beginner' } },
        { $sort: { order: 1 } },
        {
            $lookup: {
                from: 'exercises',
                localField: 'exercises',
                foreignField: '_id',
                as: 'exerciseDetails'
            }
        }
    ])
    .toArray();

use('learn_czech');

db.users.dropIndex('username_1');
