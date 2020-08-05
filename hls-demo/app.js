const express = require('express');
const path = require('path');
const app = express();
const port = 8000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.use(express.static(__dirname + '/'));

app.listen(port, () => {console.log(`Listening on port ${port}...`)});
