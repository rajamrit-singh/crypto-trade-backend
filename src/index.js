const express = require('express')
const app = express()
const coinsRouter = require('./routers/coinsRouter'); 
const port = process.env.PORT || 3000
const usersRouter = require('./routers/usersRouter');
app.use(express.json())

app.use(coinsRouter);
app.use(usersRouter);
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
