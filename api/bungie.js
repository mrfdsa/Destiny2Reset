//axios, 환경변수 불러오기
//react와 같이 사용하기
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const config = {
  method: 'get',
  url: process.env.URL,
  headers: { 'x-api-key': process.env.KEY },
  maxbodyLength: Infinity,
}

async function connect(e) {
  const response = await axios.request(e);
  return response;
}
export { connect, config } 