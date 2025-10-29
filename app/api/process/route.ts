import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import OpenAI from 'openai';
import FormData from 'form-data'; // Use 'form-data' for ocr.space
import { v4 as uuidv4 } from 'uuid'; // Use uuid for a unique ID

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 1. Get FormData from the client
    const clientFormData = await request.formData();
    const idImage = clientFormData.get('idImage') as File;
    const audioBlob = clientFormData.get('audioBlob') as File;
    const faceMatchPercent = clientFormData.get('faceMatchPercent') as string;

    if (!idImage || !audioBlob || !faceMatchPercent) {
      throw new Error('Missing required form data.');
    }

    // 2. Upload files to Vercel Blob
    const [idBlob, audioBlobResult] = await Promise.all([
      put(idImage.name, idImage, {
        access: 'public',
        contentType: idImage.type,
      }),
      put(audioBlob.name, audioBlob, {
        access: 'public',
        contentType: audioBlob.type,
      }),
    ]);

    // 3. Run OCR on the ID image
    const ocrFormData = new FormData();
    ocrFormData.append('url', idBlob.url);
    ocrFormData.append('apikey', process.env.OCR_SPACE_API_KEY!);
    ocrFormData.append('OCREngine', '2'); // Engine 2 is better

    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: ocrFormData as any,
    });
    const ocrData = await ocrResponse.json();
    
    // Naive parsing: just get all text. A real app would search for "Name:".
    const extractedText = ocrData.ParsedResults[0]?.ParsedText || 'Name not found';
    
    // Let's try to find a name (this is a simple hack)
    const nameMatch = extractedText.match(/Name:\s*([A-Za-z\s]+)/i);
    const extractedName = nameMatch ? nameMatch[1].trim() : 'Name not found';

    // 4. Run STT (Whisper) on the audio
    // We must pass the File object directly to OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1',
    });
    const transcriptText = transcription.text;

    // 5. Run LLM (GPT) to extract structured data from the transcript
    const llmPrompt = `
      You are an expert HR assistant. Extract the following information from the audio transcript.
      Respond with ONLY a valid JSON object.
      
      Transcript: "${transcriptText}"

      Extract:
      - skills: string[] (e.g., ["North Indian cooking", "cleaning"])
      - experience_years: number (just the number)
      - salary_expectation: string (e.g., "₹10,000 per month")
    `;

    const extraction = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: llmPrompt }],
    });

    const extractedJson = JSON.parse(extraction.choices[0].message.content || '{}');

    // 6. Assemble final profile and save to Vercel KV
    const profileId = uuidv4();
    const profileData = {
      name: extractedName,
      faceMatch: parseFloat(faceMatchPercent),
      idCardUrl: idBlob.url,
      audioUrl: audioBlobResult.url,
      transcript: transcriptText,
      skills: extractedJson.skills || [],
      experience: extractedJson.experience_years || 0,
      salary: extractedJson.salary_expectation || 'Not specified',
      createdAt: new Date().toISOString(),
    };

    await kv.set(profileId, profileData);

    // 7. Return the new profileId to the client
    return NextResponse.json({ profileId: profileId });

  } catch (error: any) {
    console.error('Error in /api/process:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}