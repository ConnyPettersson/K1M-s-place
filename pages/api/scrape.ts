import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeURL } from '../../services/scraper';

type ResponseData = {
  text: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { url } = req.query;

  console.log('Received request to scrape URL:', url);

  if (!url || typeof url !== 'string') {
    console.error('Invalid URL provided:', url);
    return res.status(400).json({ text: 'URL is required' });
  }

  try {
    console.log('Starting scrape for URL:', url);
    const scrapedData = await scrapeURL(url);
    console.log('Scraped data:', scrapedData);
    res.status(200).json({ text: scrapedData });
  } catch (error) {
    console.error('Error in scrape handler:', error);
    res.status(500).json({ text: 'Failed to scrape data' });
  }
}
