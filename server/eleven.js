import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const elevenVoicesSeed = {
    CzechMale: 'GyUHLb3fVDc1ZSEJWkCt'
};

const getElevenAudio = async (text, voiceId) => {
    const body = {
        text: text,
        model_id: 'eleven_multilingual_v2'
    };

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            Accept: 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVEN_KEY
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Error from ElevenLabs API: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

const processLessonsAndExercises = async () => {
    try {
        const lessonsData = JSON.parse(
            await fs.readFile(path.join(__dirname, 'lessons.json'), 'utf-8')
        );

        for (const lesson of lessonsData) {
            for (const exercise of lesson.exercises) {
                await processExercise(exercise);
            }
        }

        await fs.writeFile(
            path.join(__dirname, 'lessons.json'),
            JSON.stringify(lessonsData, null, 2)
        );

        console.log('Audio processing completed');
    } catch (error) {
        console.error('Error processing lessons and exercises:', error);
    }
};

const processExercise = async (exercise) => {
    if (
        exercise.type === 'listeningComprehension' &&
        (!exercise.audioUrl || exercise.audioUrl.includes('example.com'))
    ) {
        const audioBuffer = await getElevenAudio(
            exercise.correctAnswer,
            elevenVoicesSeed.CzechMale
        );
        const fileName = `${exercise.correctAnswer
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '_')}.mp3`;
        const filePath = path.join(__dirname, 'public', 'audio', fileName);
        await fs.writeFile(filePath, audioBuffer);
        exercise.audioUrl = `/audio/${fileName}`;
        console.log(`Audio generated for: ${exercise.correctAnswer}`);
    }
};

const main = async () => {
    await processLessonsAndExercises();
};

main();
