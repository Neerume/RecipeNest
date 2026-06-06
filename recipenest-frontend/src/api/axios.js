import axios from 'axios';

export default axios.create({
  baseURL: 'https://localhost:7296/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
