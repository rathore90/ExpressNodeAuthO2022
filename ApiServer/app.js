const express = require('express');
const app  = express();

app.get('/public', (req, res) => {
    res.json({
        type: "public"
    })
})

app.listen(5000);