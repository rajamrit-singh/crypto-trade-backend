const http = require('http');
const config = require('../../config');

const getCoins = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.coinranking.com',
            path: '/v2/coins',
            method: 'GET',
            headers: {
                'x-access-token': config.apiKey,
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                data = JSON.parse(data);
                if (data.status === 'fail') {
                    console.log('hre');
                    reject(data.code);
                }
                const coins = data?.data?.coins;
                resolve(coins);
            });
        });

        req.on('error', error => {
            console.log(error);
            reject(error); 
        });

        req.end();
    });
};

const getCoin = (uuid) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.coinranking.com',
            path: `/v2/coin/${uuid}`,
            method: 'GET',
            headers: {
                'x-access-token': config.apiKey,
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                data = JSON.parse(data);
                if (data.status === 'fail') {
                    console.log('hre');
                    reject(data.code);
                }
                const coin = data?.data?.coin;
                resolve(coin);
            });
        });

        req.on('error', error => {
            console.log(error);
            reject(error); 
        });

        req.end();
    });
};

module.exports = {
    getCoins,
    getCoin
}