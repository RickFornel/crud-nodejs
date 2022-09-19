const express = require("express");

const { randomUUID } = require('crypto');
//const { request } = require("http");
const fs = require("fs");
const app = express();

app.use(express.json());

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err){
        console.log(err);
    } else{
        products = JSON.parse(data);
    }
});

/**
 * POST => inserir ------ BODY => enviar dados para aplicação
 * GET => buscar
 * PUT => alterar
 * DELETE => deletar
 * 
 * PARAMS => /cadastrar/29834582937589
 * QUERY => /cadastrar?1894719874910738917&value=2890345092
 */

app.post("/obter", (request, response) => {
        const { name, price } = request.body;

        const product = {
            name,
            price,
            id: randomUUID(),
        };

        products.push(product);

        createProductFile();

        return response.json(product);
    }
);

app.get("/obter", (request, response) => {
    return response.json(products);
});

app.get("/obter/:id", (request, response) => {
    const {id } = request.params;
    const product = products.find(product => product.id === id);
    return response.json(product)
});

app.put("/obter/:id", (request, response) => {
    const {id } = request.params;
    const { name, price } = request.body;

    const productIndex = products.findIndex((product) => product.id === id);

    products[productIndex] = {
        ...products[productIndex],
        name,
        price,
    };

    createProductFile();

    return response.json({
        message: "Alteração feita com sucesso"
    });
});

app.delete("/obter/:id", (request, response) => {
    const {id } = request.params;
    const productIndex = products.findIndex((product) => product.id === id);

    products.splice(productIndex, 1);

    createProductFile();

    return response.json({
        message: "Produto removido com sucesso"
    });

 });

 function createProductFile(){
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if (err){
            console.log(err);
        } else{
            console.log("Produto inserido");
        }
    });
 };


app.listen(4002, () => console.log("Servidor esta rodando na porta 4002"));