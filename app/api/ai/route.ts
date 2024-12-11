import { SekolahIsoType } from '@/types/response/zonasi.interface';
import { arrayToTableString } from '@/utils/helper';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';

function commonSetting() {
    const MODEL_NAME = process.env.GOOGLE_GEMINI_MODEL || '';
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
        responseMimeType: 'text/plain',
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    return { model, generationConfig, safetySettings };
}

async function runInsight({
    my_lat,
    my_lon,
    list_sekolah,
}: {
    my_lat: number;
    my_lon: number;
    list_sekolah: SekolahIsoType[];
}) {
    if (!API_KEY) {
        console.error('Please provide the API Key.');
        return;
    }

    const { model, generationConfig, safetySettings } = commonSetting();

    const parts = [
        {
            text: `Indonesia menerapkan sistem zonasi sekolah untuk penerimaan peserta didik baru,
            dimana peserta didik yang rumahnya berada dekat dengan sekolah akan diprioritaskan terlebih dahulu,
            berikut merupakan hasil dari pencarian sekolah terdekat salah seorang user :

            * Lokasi user [lon, lat]: [${my_lon}, ${my_lat}]
            * Daftar Sekolah terdekat: ${arrayToTableString(list_sekolah) || '-'}
            Penjelasan Data : (
                time = waktu tempuh dalam menit,
                radius = jarak garis lurus dari lokasi saya ke sekolah dalam meter,
                route = jarak hasil perhitungan routing jalan dari lokasi saya ke sekolah dalam km,
                zonasi = true/ya menerangkan bahwa sekolah tersebut menerapkan sistem zonasi
                )

            Berikan insight atau penjelasan terkait data yang diberikan,
            gunakan tone yang santai untuk menjelaskan data kepada user yang merupakan orang tua siswa!
            `,
        },
    ];

    const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig,
        safetySettings,
    });

    const { response } = result;
    return response.text();
}

export async function POST(request: Request) {
    const restRequest = await request.json();

    try {
        const res = await runInsight(restRequest);
        return NextResponse.json({ success: true, data: res }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
