const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const pastaDados = path.join(__dirname, "dados");

function caminho(nome){
    return path.join(pastaDados, nome + ".json");
}

app.get("/api/:nome",(req,res)=>{

    const arquivo = caminho(req.params.nome);

    if(!fs.existsSync(arquivo)){
        fs.writeFileSync(arquivo,"[]");
    }

    const dados = fs.readFileSync(arquivo,"utf8");

    res.json(JSON.parse(dados || "[]"));
});

app.post("/api/:nome",(req,res)=>{

    const arquivo = caminho(req.params.nome);

    fs.writeFileSync(
        arquivo,
        JSON.stringify(req.body,null,2),
        "utf8"
    );

    res.json({ok:true});
});

app.listen(PORT,()=>{
    console.log("Servidor rodando:");
    console.log("http://localhost:3000");
});