import { scrapeURL } from '../scraper';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('scrapeURL', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('should return the correct content from BRIS website', async () => {
    const mockData = {
      data: '<div class="specific-class-for-bris">Some content here</div>',
    };
    mockedAxios.get.mockResolvedValue(mockData as any);
    const url = 'https://www.bris.se';
    const content = await scrapeURL(url);
    expect(content).toBe('Some content here');
  });

  it('should handle errors correctly', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Failed to scrape data'));
    await expect(scrapeURL('https://www.bris.se')).rejects.toThrow(
      'Failed to scrape data',
    );
  });

  it('should block access to URLs disallowed by robots.txt', async () => {
    const disallowedUrl = 'https://www.bris.se/for-barn-och-unga/forum/';
    await expect(scrapeURL(disallowedUrl)).rejects.toThrow(
      'Access to the URL is disallowed by robots.txt',
    );
  });
});
