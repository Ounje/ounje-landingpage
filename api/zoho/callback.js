export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const response = await fetch(
      `https://accounts.zoho.com/oauth/v2/token?code=${code}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=authorization_code`,
      { method: "POST" }
    );

    const data = await response.json();
    console.log("OAuth Response:", data);

    res.status(200).json({
      message:
        "Check your Vercel logs for the refresh token — store it in .env",
      data,
    });
  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).json({ error: "OAuth token exchange failed" });
  }
}
