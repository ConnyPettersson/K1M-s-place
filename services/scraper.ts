import axios from 'axios';
import { load } from 'cheerio';

interface DomainRules {
  [key: string]: string[];
}

const domainRules: DomainRules = {
  'bris.se': [
    '/for-barn-och-unga/forum/',
    '/for-barn-och-unga/mitt-konto',
    '/for-barn-och-unga/meddelanden',
    '/for-barn-och-unga/chatt',
    '/for-barn-och-unga/logga-in',
    '/for-barn-och-unga/logga-ut',
    '/natt-pa-bris',
    '/globalassets/',
    '/api/chat/isopen',
    '/api/chat/isfull',
    '/api/chat/kurator',
    '/api/misc/info',
  ],
  'friends.se': ['/wp/wp-admin/', '!/wp/wp-admin/admin-ajax.php'],
};

export const scrapeURL = async (url: string): Promise<string> => {
  try {
    const urlObj = new URL(url);
    const disallowedPaths =
      domainRules[urlObj.hostname.replace('www.', '')] || [];

    if (
      disallowedPaths.some(
        (path: string) => url.includes(path) && !path.startsWith('!'),
      )
    ) {
      throw new Error('Access to the URL is disallowed by robots.txt');
    }

    const { data } = await axios.get(url);
    const $ = load(data);

    let content = '';
    if (url.includes('bris.se')) {
      content = $('div.specific-class-for-bris, .another-class, p').text();
    } else if (url.includes('friends.se')) {
      content = $('div.specific-class-for-friends, .another-class, p').text();
    }

    console.log(`Scraped content from ${url}:`, content);
    return content.trim();
  } catch (error) {
    console.error('Error scraping:', error);
    throw error; // Vidarebefordra exakt fel som kastas
  }
};
