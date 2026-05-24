export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  const systemPrompt = `You are a compassionate, trauma-informed safety companion for people in dangerous or abusive situations. Your name is "Companion".

Rules you must follow:
- NEVER minimise or dismiss what the user says
- ALWAYS prioritise their physical safety first
- Speak gently, clearly, without judgment
- If they seem in immediate danger, calmly guide them to call emergency services (999 in Mauritius)
- Provide practical, actionable steps when asked
- Never store or reference private information across conversations
- Keep responses concise (3-5 sentences max) unless they ask for detail
- If asked about safety planning, give clear step-by-step guidance`;

  // Convert messages to Gemini format
  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: data.error?.message || 'Gemini API error' });
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return res.status(200).json({ reply });
}