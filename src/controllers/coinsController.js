const axios = require('axios');
const config = require('../../config');

const getCoins = (limit = 50, page, uuids = []) => {
  const offset = (page - 1) * limit;
  const uuidsQuery = uuids.map(uuid => `uuids[]=${encodeURIComponent(uuid)}`).join('&');
  const queryParams = `limit=${limit}&offset=${offset}&${uuidsQuery}`;
  const url = `https://api.coinranking.com/v2/coins?${queryParams}`;
  
  return axios
    .get(url, {
      headers: {
        'x-access-token': config.apiKey,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.status === 'fail') {
        return Promise.reject(data.code);
      }
      const coins = data?.data?.coins;
      return coins;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
};

const getCoin = (uuid) => {
  const url = `https://api.coinranking.com/v2/coin/${uuid}`;

  return axios
    .get(url, {
      headers: {
        'x-access-token': config.apiKey,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.status === 'fail') {
        return Promise.reject(data.code);
      }
      const coin = data?.data?.coin;
      return coin;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
};

const getStats = () => {
  const url = 'https://api.coinranking.com/v2/stats';

  return axios
    .get(url, {
      headers: {
        'x-access-token': config.apiKey,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.status === 'fail') {
        return Promise.reject(data.code);
      }
      const stats = data?.data;
      return stats;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
};

module.exports = {
  getCoins,
  getCoin,
  getStats,
};
