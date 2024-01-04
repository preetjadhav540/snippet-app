const express = require('express');

const mongo = require('./mongo');

const app = express();

const cors = require('cors');

const options = { exposedHeaders: ['Authorization'] };

app.use(cors(options));

const PORT = 8888;

app.use(express.json());

const users = require('./api/users/users.routes');
const snippets = require('./api/snippets/snippets.routes');
const bookmarks = require('./api/bookmarks/bookmarks.routes');


app.use('/users', users);
app.use('/snippets', snippets);
app.use('/bookmarks', bookmarks);

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await mongo.connectDB();
});