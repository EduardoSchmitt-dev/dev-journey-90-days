const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiZnJlZUBlbWFpbC5jb20iLCJpYXQiOjE3NzEzNTcyNTcsImV4cCI6MTc3MTM1ODE1N30.Jrt9B-nETrWcGQRcCPwEFrsXq16sE3JXl5li3uqs0Po';

async function test() {
  for (let i = 1; i <= 25; i++) {
    try {
      const res = await axios.get('http://localhost:3000/features', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(i, res.status);
    } catch (err) {
      console.log(i, err.response.status);
    }
  }
}

test();
