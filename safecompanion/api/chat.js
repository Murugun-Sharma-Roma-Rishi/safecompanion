export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  const systemPrompt = `You are a compassionate, trauma-informed safety companion named "Companion" for people in dangerous or abusive situations. You are embedded in a private safety app in Mauritius.

Rules you must ALWAYS follow:
- NEVER minimise, dismiss, or doubt what the user tells you
- ALWAYS prioritise their physical safety above all else  
- Speak gently, warmly, without judgment or clinical language
- If they seem in IMMEDIATE danger: calmly but urgently guide them to call 999 (Mauritius emergency)
- Give practical, clear, step-by-step guidance when asked
- Keep responses short (2-4 sentences) unless more detail is asked for
- NEVER lecture or give unsolicited opinions on their choices
- Remind them of the SOS button if they describe ongoing danger
- You do not remember previous conversations — each chat is private and fresh`;

  const geminiMessages = messages
    .filter(m => m.content && m.content.trim())
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Gemini requires first message to be from user
  if (geminiMessages.length === 0 || geminiMessages[0].role === 'model') {
    return res.status(400).json({ error: 'First message must be from user' });
  }

  console.log('GEMINI_KEY present:', !!process.env.GEMINI_KEY);
  console.log('GEMINI_KEY length:', process.env.GEMINI_KEY?.length);
  console.log('Messages count:', geminiMessages.length);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await response.json();
    console.log('Gemini status:', response.status);
    console.log('Gemini response:', JSON.stringify(data));

    if (!response.ok) {
      console.error('Gemini error:', data);
      return res.status(500).json({ reply: `DEBUG: ${response.status} - ${JSON.stringify(data)}` });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      ?? "I'm here for you. If you need emergency help, please call 999.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ reply: `DEBUG ERROR: ${err.message}` });
  }
}