const express = require('express');
const path = require('path');
const app = express();
const port = 8000

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", `http://localhost:${port}`); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

// app.use(express.static(__dirname + 'sdk-components'));
// app.use(express.static(__dirname + 'src'));
app.use(express.static(__dirname + '/'));

app.listen(port, () => {console.log(`Listening on port ${port}...`)});
