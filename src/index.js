const express = require('express');
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

const customers = [];

app.post("/account", (req, res) => {
    const {cpf, name} = req.body;

    const customersAlreadyExists = customers.some(
        (customers) => customers.cpf === cpf
    );

    if(customersAlreadyExists) {
        res.status(400).json({ error: "Customer already exists!" });
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })
    console.log(customers);
    res.status(201).send();
})

app.listen(3333, () => {
    console.log("Servidor iniciado com sucesso!")
});