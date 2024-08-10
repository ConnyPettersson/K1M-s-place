jest.mock('../../../services/scraper', () => ({
  scrapeURL: jest.fn().mockResolvedValue('expected scraped data'),
}));
import { createMocks } from 'node-mocks-http';
import handleScrape from '../../../pages/api/scrape';

describe('scrape API Endpoint', () => {
  it('should return 200 and the correct data when a valid URL is provided', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { url: 'https://example.com' },
    });

    await handleScrape(req as any, res as any);
    const responseData = JSON.parse(res._getData());

    expect(res._getStatusCode()).toBe(200);
    expect(responseData).toEqual({
      text: 'expected scraped data',
    });
  });
});
