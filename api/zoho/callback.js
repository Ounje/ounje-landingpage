export async function handler(event) {
  const code = event.queryStringParameters.code;

  const response = await fetch(
    `https://accounts.zoho.com/oauth/v2/token?code=${code}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&grant_type=authorization_code`,
    { method: "POST" }
  );

  const data = await response.json();
  console.log("OAuth Response:", data);

  return {
    statusCode: 200,
    body: "Check your logs for refresh token — store it in .env",
  };
}
