const express = require('express');
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

const customers = [];

function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer) {
        res.status(400).json({error: "Customer not found"});
    }

    req.customer = customer;

    next();
}

function getBalance(statement) {
   const balance = statement.reduce((acc, operation) => {
        if(operation.type === 'credit') {
            return acc + operation.amount;
        }else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
};

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

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req;
    res.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
    const { description, amount } = req.body;

    const { customer } = req;

    const statementOperation = {
        description,
        amount,
        create_at: new Date(),
        type: "Credit"
    };

    customer.statement.push(statementOperation);

    res.status(201).json([{status: "Deposito realizado com sucesso!"}]);
});


app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
    const { amount } = req.body;
    const { customer } = req;

    const balance = getBalance(customer.statement);

    if(balance < amount) {
        res.status(400).json({error: "Insufficient funds!"});
    };

    const statementOperation = {
        amount,
        create_at: new Date(),
        type: "debit"
    };

    customer.statement.push(statementOperation);

    res.status(201).json({status: "Saque realizado com sucesso!"});
});

app.listen(3333, () => {
    console.log("Servidor iniciado com sucesso!")
});