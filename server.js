const express = require('express');
const app = express();
const port = 3000;
const posts = require('./data/posts');
const postsRouter = require('./routers/posts');

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

app.use('/api/posts', postsRouter);





