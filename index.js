const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const { haiku } = require('./generatorNames');
const { content } = require('./text');

app.use(bodyParser.json());
app.use(cors());

const users = getDefaultUsers();
const posts = users.map(generatePosts);

function getDefaultUsers(size = 10) {
    return Array.from({ length: size }).map(() => {
        const id = randomBytes(6).toString('hex');
        const username = haiku();
        const age = Math.floor(Math.random() * 100 + 1);
        const level = Math.floor(Math.random() * 100);

        return {
            id,
            username,
            age,
            level
        };
    });
}

function generatePosts(user) {
    const id = randomBytes(6).toString('hex');
    const userId = user.id;
    const titles = haiku();
    const title = titles.replace(/\ .+/g, '');
    const subTitle = titles.replace(/.+\ /g, '');

    return {
        title,
        subTitle,
        userId,
        id,
        content
    };
}

app.get('/users', (_, res) => {
    res.send(users);
});

app.get('/users/:id', (_, res, next, id) => {
    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).send({ message: `Not found user with id=${id}`, error: true });
    }
    res.send(user);
});

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.get('/posts/:id', (req, res, next, id) => {
    const post = posts.find(user => user.id === id);

    if (!post) {
        return res.status(404).send({ message: `Not found post with id=${id}`, error: true });
    }
    res.send(post);
});


app.listen(8080, () => {
    console.log('Run on 8080 port');
});

