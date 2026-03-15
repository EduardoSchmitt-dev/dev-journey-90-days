const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdGVAZGV2LmNvbSIsInJvbGUiOiJGUkVFIiwianRpIjoiMWNhOTRhNGMtZGYzMi00NjA3LWE4MzAtMzg3MzhhMDYyNDVhIiwiaWF0IjoxNzczNjExNjU3LCJleHAiOjE3NzM2MTI1NTd9.rpLMA-9qozmNg4x-uBJ4l0hpc7T99IUt3M2orvnnWGI'

async function test() {
  for (let i = 1; i <= 25; i++) {
    try {
      const res = await axios.get('http://localhost:3001/api/v1/features', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(i, res.status);
    } catch (err) {
      if (err.response) {
        console.log(i, err.response.status);
      } else {
        console.log(i, "Connection error");
      }
    }
  }
}

test();