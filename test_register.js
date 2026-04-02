import axios from 'axios';

async function register() {
  try {
    const res = await axios.post('http://localhost:5000/api/user/register', {
      name: 'Test User',
      email: 'testuser@gmail.com',
      password: 'password123',
      mobile: '1234567890'
    });
    console.log(JSON.stringify(res.data));
  } catch (error) {
    console.error(error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

register();
