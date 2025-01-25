import openai from '../openai';

jest.mock('../openai', () => {
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

describe('OpenAI Client (mocked)', () => {
  it('should respond with a mock message', async () => {
    const testPrompt = 'Hello, OpenAI!';
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: testPrompt }],
      temperature: 0.5,
    });

    expect(response.choices[0].message?.content).toBe('Mocked AI response');
  });
});
