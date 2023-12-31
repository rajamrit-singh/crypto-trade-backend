const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const cors = require('cors');

const coinsRouter = require('./routers/coinsRouter'); 
const usersRouter = require('./routers/usersRouter');
const transactionsRouter = require('./routers/transactionsRouter');
const userCoinsRouter = require('./routers/userCoinsRouter');
app.use(express.json());

app.use(cors());
app.use(coinsRouter);
app.use(usersRouter);
app.use(transactionsRouter);
app.use(userCoinsRouter);
app.listen(port, () => {
  console.log('server is up on port ' + port)
})

// app.get('/', (req, res) => {
//     pool.query('SELECT * FROM Users', async (err, result) => {
//       if (err) {
//         console.error('Error executing query', err);
//         res.status(500).send('An error occurred');
//       } else {
//         console.log(result.rows);
//         res.send('Yolo')
//       }
//     });
//   });
