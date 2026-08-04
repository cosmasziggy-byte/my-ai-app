export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const token = process.env.HF_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'HF_TOKEN environment variable is missing on Vercel.' });
  }

  try {
    const response = await fetch("https://router.huggingface.co/hf-inference/models/Qwen/Qwen2.5-7B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Write a creepy short horror story based on this prompt: ${prompt}`,
        parameters: { max_new_tokens: 250 }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Hugging Face API error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Server fetch failed: ' + error.message });
  }
}
