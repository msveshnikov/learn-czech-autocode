import dotenv from "dotenv";
import pLimit from "p-limit";
import Voice from "./model/Voice.js";
dotenv.config({ override: true });

const limiter = pLimit(1);

const elevenVoicesSeed = {
    Rachel: "21m00Tcm4TlvDq8ikWAM",
    Simeon: "alMSnmMfBQWEfTP8MRcX",
    AnaRita: "wJqPPQ618aTW29mptyoc",
    Max: "Q5LoqC73D5BN0PVtcOl3",
    Putin: "MxEUV4BmhCDPsC7K5IRU",
    Aerisita: "5x4OabTaxKEADQiUryOC",
};

export async function seedVoices() {
    const voiceCount = await Voice.countDocuments();
    if (voiceCount === 0) {
        const voiceData = Object.entries(elevenVoicesSeed).map(([name, voiceId]) => ({ name, voiceId }));
        await Voice.insertMany(voiceData);
        console.log("Eleven voices inserted into the database.");
    } else {
        console.log("Eleven voices already exist in the database.");
    }
}

export const findElevenVoice = async (voice, userId) => {
    const userVoices = await Voice.find({ user: userId });
    const globalVoices = await Voice.find({ user: null });
    const allVoices = [...userVoices, ...globalVoices];
    return allVoices.find((v) => v.name === voice);
};

export const getElevenAudio = async (text, voiceId) => {
    const body = {
        text: text,
        model_id: "eleven_multilingual_v2",
    };

    const response = await limiter(() =>
        fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
                Accept: "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": process.env.ELEVEN_KEY,
            },
            body: JSON.stringify(body),
        })
    );

    if (!response.ok) {
        throw new Error("Error from ElevenLabs API:", await response.status());
    }

    const audioBlob = await response.blob();
    return Buffer.from(await audioBlob.arrayBuffer());
};

export const generateSoundEffect = async (text, durationSeconds = null, promptInfluence = 0.3) => {
    const url = "https://api.elevenlabs.io/v1/sound-generation";

    const headers = {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVEN_KEY,
    };

    const payload = {
        text: text,
        prompt_influence: promptInfluence,
    };

    if (durationSeconds !== null) {
        if (durationSeconds >= 0.5 && durationSeconds <= 22) {
            payload.duration_seconds = durationSeconds;
        } else {
            throw new Error("duration_seconds must be between 0.5 and 22 seconds.");
        }
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const audioBlob = await response.blob();
        return Buffer.from(await audioBlob.arrayBuffer());
    } catch (error) {
        console.error("Error occurred while generating sound effect:", error);
        return null;
    }
};
