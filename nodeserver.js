
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  

const app = express();
const PORT = 5500;

app.use(cors()); 
app.use(bodyParser.json());

let socposts = [];

app.get('/socposts', (req, res) => {
    res.json(socposts);
});

app.post('/socposts', (req, res) => {
    const newUsrPosts = req.body;
    socposts.push(newUsrPosts);
    res.json(newUsrPosts);
});

app.put('/socposts/:id', (req, res) => {
    const id = req.params.id;
    const updatedUsrPosts = req.body;
    socposts[id] = updatedUsrPosts;
    res.json(updatedUsrPosts);
});

app.delete('/socposts/:id', (req, res) => {
    const id = req.params.id;
    const deletedUsrPosts = socposts[id];
    socposts.splice(id, 1);
    res.json(deletedUsrPosts);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
