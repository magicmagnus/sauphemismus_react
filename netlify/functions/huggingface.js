exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const requestData = JSON.parse(event.body);
    
    const response = await fetch(
      "https://router.huggingface.co/featherless-ai/v1/completions",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      })
    };
  }
};