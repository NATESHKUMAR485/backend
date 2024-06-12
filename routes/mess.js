

// Define a route to handle POST requests on '/login'
app.post('/login1', async (req, res) => {
  const { username, password, type } = req.body;
  
  try {
    // Assuming the login URL expects a POST request with a JSON body
    const response = await axios.post('https://hotsel-ms.vercel.app/auth/login', {
      username,
      password,
      type
    });

    // Check if login is successful and forward data to frontend
    if (response.status === 200) {
      console.log('Login successful:', response.data);
      
      // Forwarding response data to a front-end URL (assuming it also expects a POST request)
      const frontendResponse = await axios.post('https://hotsel-ms.vercel.app/auth/login', response.data);

      // Send response to the client
      res.json({
        message: 'Login and data forwarding successful',
        data: frontendResponse.data
      });
    } else {
      // Handle non-200 response
      res.status(response.status).json({ message: 'Login failed' });
    }
  } catch (error) {
    console.error('Error during login or data forwarding:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


