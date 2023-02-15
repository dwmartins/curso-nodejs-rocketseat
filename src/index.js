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
   
    res.status(201).send();
});

app.get("/statement", (req, res) => {
    const { cpf } = req.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer) {
        res.status(400).json({error: "Customer not found"});
    }

    res.json(customer.statement);
})

app.listen(3333, () => {
    console.log("Servidor iniciado com sucesso!")
});