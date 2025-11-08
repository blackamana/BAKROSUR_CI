import { generateText } from '@rork/toolkit-sdk';

export interface TranslateOptions {
  text: string;
  targetLanguage: 'fr' | 'en' | 'ar';
  sourceLanguage?: string;
}

export async function translateText({
  text,
  targetLanguage,
  sourceLanguage,
}: TranslateOptions): Promise<string> {
  console.log('Translating text to:', targetLanguage);

  const languageNames = {
    fr: 'French',
    en: 'English',
    ar: 'Arabic',
  };

  const targetLangName = languageNames[targetLanguage];
  const sourceLangInfo = sourceLanguage
    ? `from ${sourceLanguage}`
    : 'automatically detecting the source language';

  const prompt = `Translate the following text to ${targetLangName} ${sourceLangInfo}. 
Only respond with the translation, nothing else. Preserve formatting and structure.

Text to translate:
${text}`;

  try {
    const translated = await generateText({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log('Translation successful');
    return translated.trim();
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
}

export interface TranslateBatchOptions {
  texts: string[];
  targetLanguage: 'fr' | 'en' | 'ar';
  sourceLanguage?: string;
}

export async function translateBatch({
  texts,
  targetLanguage,
  sourceLanguage,
}: TranslateBatchOptions): Promise<string[]> {
  console.log('Translating batch of texts to:', targetLanguage);

  const languageNames = {
    fr: 'French',
    en: 'English',
    ar: 'Arabic',
  };

  const targetLangName = languageNames[targetLanguage];
  const sourceLangInfo = sourceLanguage
    ? `from ${sourceLanguage}`
    : 'automatically detecting the source language';

  const numberedTexts = texts.map((text, index) => `${index + 1}. ${text}`).join('\n');

  const prompt = `Translate the following texts to ${targetLangName} ${sourceLangInfo}.
Respond with ONLY the translations, one per line, numbered the same way.
Preserve formatting and structure.

Texts to translate:
${numberedTexts}`;

  try {
    const translated = await generateText({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const lines = translated
      .trim()
      .split('\n')
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((line) => line.length > 0);

    console.log('Batch translation successful');
    return lines.slice(0, texts.length);
  } catch (error) {
    console.error('Batch translation error:', error);
    throw new Error('Failed to translate texts');
  }
}
