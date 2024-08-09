import openai from '../openai';

describe('OpenAI Client', () => {
  it('should respond with a message from OpenAI', async () => {
    const testPrompt = 'Hello, OpenAI!';
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: testPrompt }],
      temperature: 0.5,
    });

    expect(response.choices[0].message?.content).toBeTruthy();
  });
});
