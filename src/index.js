const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.json([{mensagem: "Hello World!"}]);
})

app.listen(3333, () => {
    console.log("Servidor iniciado com sucesso!")
});