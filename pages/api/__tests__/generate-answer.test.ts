import { createMocks } from 'node-mocks-http';
import handleGenerateAnswer from '../generate-answer';
import { scrapeURL } from '../../../services/scraper';
import openai from '../../../utils/openai';

jest.mock('../../../services/scraper', () => ({
  scrapeURL: jest.fn().mockResolvedValue('Mocked scraped data'),
}));

jest.mock('../../../utils/openai', () => {
  return {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Mocked AI response',
              },
            },
          ],
        }),
      },
    },
  };
});

describe('generate-answer API Route', () => {
  it('should return 400 if prompt is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { prompt: '' },
    });

    await handleGenerateAnswer(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      text: 'Please send your prompt',
    });
  });

  it('should call scraper and OpenAI, then return AI response', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { prompt: 'Hello AI' },
    });

    await handleGenerateAnswer(req as any, res as any);

    expect(scrapeURL).toHaveBeenCalled();

    expect(openai.chat.completions.create).toHaveBeenCalled();

    const responseData = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(200);
    expect(responseData.text).toMatch('Mocked AI response');
  });
});
