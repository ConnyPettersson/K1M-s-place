import axios from 'axios';
import { load } from 'cheerio';
import iconv from 'iconv-lite';
import { urls as importedUrls } from './urls';

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
  'friends.se': ['/wp/wp-admin/'],
  'rodakorset.se': [
    '/episerver/CMS/',
    '/util/',
    '/*?timeline=*',
    '/test/*',
    '/installningar/*',
    '/checkout/*',
  ],
  '1177.se': ['/episerver/', '/util/', '/modules/', '/error/'],
  'saffle.se': [
    '/imagedescription.action2',
    '/checkoutimages.action2',
    '/mybookmarks/addbookmark.action2',
    '/mybookmarks/removebookmark.action2',
    '/*.html.printable',
    '/*?contactPage=*',
    '/*?contactUserId=*',
    '/*?sv.state=*',
    '/*?state=keepAlive',
    '/*&state=keepAlive',
    '/*?profiling=*',
    '/*.pdf?properties=*',
    '/*?addToCart=true',
    '/*;jsessionid=*',
  ],
};

export const scrapeURL = async (url: string): Promise<string> => {
  console.log(`Attempting to fetch URL: ${url}`);
  try {
    const urlObj = new URL(url);
    const disallowedPaths =
      domainRules[urlObj.hostname.replace('www.', '')] || [];

    if (
      disallowedPaths.some(
        (path) => url.includes(path) && !path.startsWith('!'),
      )
    ) {
      console.error(`Access to the URL ${url} is disallowed by robots.txt`);
      throw new Error('Access to the URL is disallowed by robots.txt');
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer', // För att kunna behandla binära data korrekt
      maxRedirects: 5, // Limit redirects
      timeout: 10000, // Set a timeout
    });

    // Hantera teckenkodning korrekt med iconv-lite
    const decodedContent = iconv.decode(Buffer.from(response.data), 'utf-8');
    console.log('Raw HTML data:', decodedContent);

    const $ = load(decodedContent);

    let content = '';
    if (url.includes('bris.se')) {
      content = $('div.specific-class-for-bris, .another-class, p').text();
    } else if (url.includes('friends.se')) {
      content = $('div.specific-class-for-friends, .another-class, p').text();
    } else if (url.includes('1177.se')) {
      content = $('div.specific-class-for-1177, .another-class, p').text();
    } else if (url.includes('saffle.se')) {
      content = $('div.specific-class-for-saffle, .another-class, p').text();
    } else if (url.includes('polisen.se')) {
      content = $('div.specific-class-for-polisen, .another-class, p').text();
    }

    console.log(`Scraped content from ${url}:`, content.slice(0, 200)); // Logga de första 200 tecknen
    return content.trim();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`HTTP error! Status: ${error.response.status}`);
      } else if (error.request) {
        console.error(`No response received from ${url}. Request was made.`);
      } else {
        console.error(`Error setting up the request: ${error.message}`);
      }
      if (error.code === 'ERR_FR_TOO_MANY_REDIRECTS') {
        console.error(`Too many redirects when trying to access ${url}`);
      }
    } else {
      console.error(`Error scraping URL: ${url}`, error);
    }
    throw error;
  }
};

// Skrapa innehåll från alla URL:er i listan
const urls = importedUrls;

(async () => {
  for (const url of urls) {
    try {
      const content = await scrapeURL(url);
      console.log(`Content from ${url}:`, content);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  }
})();
