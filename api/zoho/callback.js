export default async function handler(req, res) {
  try {
    const code = req.query.code;
    console.log("Received code:", code);
    console.log("Using env vars:", {
      ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID,
      ZOHO_CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET ? "***" : "MISSING",
      ZOHO_REDIRECT_URI: process.env.ZOHO_REDIRECT_URI,
    });

    const tokenResponse = await fetch(
      `https://accounts.zoho.com/oauth/v2/token?code=${code}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=authorization_code`,
      { method: "POST" }
    );

    const data = await tokenResponse.json();
    console.log("OAuth Response:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
}
