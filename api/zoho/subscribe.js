export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email } = JSON.parse(event.body);

  if (!email || !email.includes("@")) {
    return { statusCode: 400, body: "Invalid email" };
  }

  // 1. Refresh the access token
  const tokenRes = await fetch(
    `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`,
    { method: "POST" }
  );

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // 2. Add contact to Zoho list
  const zohoRes = await fetch(
    "https://campaigns.zoho.com/api/v1.1/addcontacts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      body: JSON.stringify({
        listkey: process.env.ZOHO_LIST_KEY,
        contactinfo: { EmailAddress: email },
      }),
    }
  );

  const zohoData = await zohoRes.json();
  return {
    statusCode: zohoRes.ok ? 200 : 400,
    body: JSON.stringify(zohoData),
  };
}
