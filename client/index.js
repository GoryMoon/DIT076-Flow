import { join } from 'path';
import express from 'express';
import history from 'express-history-api-fallback';

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

const app = express();
const root = join(__dirname, '../../');

app.use(express.static(root));
app.use(history('index.html', { root }));

const server = app.listen(3000, () => console.log('Example app listening on port 3000!'));
export default server;