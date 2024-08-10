import type { NextApiRequest, NextApiResponse } from 'next';
import openai from '../../utils/openai';
import dotenv from 'dotenv';
import { scrapeURL } from '../../services/scraper';

dotenv.config();

type ResponseData = {
  text: string;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

const urls = ['https://www.bris.se', 'https://www.friends.se'];

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { prompt } = req.body;

  if (!prompt || prompt === '') {
    return res.status(400).json({ text: 'Please send your prompt' });
  }

  try {
    let additionalInfo = '';

    for (const url of urls) {
      try {
        const scrapedData = await scrapeURL(url);
        console.log(`Data scraped from ${url}:`, scrapedData); // Logga URL och hämtad data
        additionalInfo += `${scrapedData}\n`;
      } catch (error) {
        console.error('Error scraping URL:', url, error);
      }
    }

    // const aiPrompt = `${prompt}\nAdditional Info:\n${additionalInfo}`;

    // Skapa strukturerad prompt
    const structuredPrompt = `
    Du är en AI-assistent för föräldrar som söker råd om olika problem. Använd informationen från BRIS och Friends för att ge relevanta och empatiska råd. Följ dessa riktlinjer:
    ### Inledande Frågor
    1. **Öppna Frågor**: Starta med öppna frågor som uppmuntrar användaren att dela mer om sin situation.
       - "Hur kan jag hjälpa dig idag?"
       - "Kan du berätta lite mer om vad som händer?"

    2. **Empatiska Frågor**: Visa empati och förståelse för användarens känslor.
       - "Det låter som en svår situation. Hur mår du just nu?"
       - "Jag är ledsen att höra att du går igenom detta. Vill du prata om det?"

    ### Fördjupade Frågor
    1. **Följdfrågor**: Baserat på användarens svar, ställ följdfrågor för att få mer insikt.
       - "Kan du ge ett exempel på när du känner så här?"
       - "Vad tror du har orsakat dessa känslor?"

    2. **Specifika Frågor**: Fokusera på specifika aspekter av användarens problem.
       - "Hur påverkar detta ditt dagliga liv?"
       - "Finns det specifika situationer eller personer som gör att du känner dig sämre?"

    ### Uppmuntrande Frågor
    1. **Stödjande Frågor**: Uppmuntra användaren att tänka på lösningar eller strategier som kan hjälpa.
       - "Vad brukar hjälpa dig att må bättre när du känner så här?"
       - "Finns det någon du kan prata med om detta, som en vän eller familjemedlem?"

    2. **Utforskande Frågor**: Hjälp användaren att utforska sina känslor och tankar djupare.
       - "Hur tror du att situationen skulle förändras om du gjorde [specifik åtgärd]?"
       - "Vad är det första steget du skulle kunna ta för att börja må bättre?"

    ### Avslutande Frågor och Sammanfattning
    1. **Sammanfatta och Bekräfta**: Sammanfatta vad användaren har sagt och bekräfta deras känslor.
       - "Så om jag förstår dig rätt, du känner [känsla] på grund av [situation]. Stämmer det?"
       - "Det låter som att detta verkligen påverkar dig. Finns det något mer du vill lägga till?"

    2. **Erbjuda Ytterligare Hjälp**: Fråga om användaren vill ha ytterligare hjälp eller resurser.
       - "Skulle du vilja ha några tips eller resurser som kan hjälpa dig med detta?"
       - "Finns det något specifikt du skulle vilja prata om eller ha råd kring?"

    ### Exempel på en Dialog
    Användare: "Jag känner mig väldigt stressad över skolan just nu."
    AI-assistent:
    - "Jag förstår, skolan kan vara väldigt stressande ibland. Kan du berätta mer om vad som gör dig stressad just nu?"
    - "Det låter tufft. Hur länge har du känt dig så här stressad?"
    - "Finns det specifika ämnen eller uppgifter som är extra svåra för dig?"
    - "Vad brukar du göra för att hantera stressen när det blir för mycket?"
    - "Har du pratat med dina lärare eller föräldrar om hur du känner?"
    - "Tack för att du delar med dig. Vill du att jag ger några tips på hur du kan hantera stressen?"

    Additional Information:
    ${additionalInfo}

    Fråga: ${prompt}
    `;

    const aiResult = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: structuredPrompt }],
      temperature: 0.9,
      max_tokens: 2048,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    console.log('Fetching AI response...');

    const response =
      aiResult.choices[0].message?.content?.trim() ||
      'Sorry, there was a problem!';
    res.status(200).json({ text: response });
  } catch (error) {
    console.error('Error fetching AI response:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      text: `Sorry, there was a problem fetching the response. Error: ${errorMessage}`,
    });
  }
}
