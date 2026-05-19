const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const pastaDados = path.join(__dirname, "dados");

if (!fs.existsSync(pastaDados)) {
    fs.mkdirSync(pastaDados, { recursive: true });
}

function caminho(nome) {
    return path.join(pastaDados, nome + ".json");
}

/* API GET */
app.get("/api/:nome", (req, res) => {
    try {
        const arquivo = caminho(req.params.nome);

        if (!fs.existsSync(arquivo)) {
            fs.writeFileSync(arquivo, "[]", "utf8");
        }

        const dados = fs.readFileSync(arquivo, "utf8");
        res.json(JSON.parse(dados || "[]"));

    } catch (erro) {
        console.error("ERRO GET:", erro);
        res.status(500).json({ erro: "Erro ao ler banco de dados" });
    }
});

/* API POST */
app.post("/api/:nome", (req, res) => {
    try {
        const arquivo = caminho(req.params.nome);

        fs.writeFileSync(
            arquivo,
            JSON.stringify(req.body, null, 2),
            "utf8"
        );

        res.json({ ok: true });

    } catch (erro) {
        console.error("ERRO POST:", erro);
        res.status(500).json({ erro: "Erro ao salvar banco de dados" });
    }
});

/* PÁGINA INICIAL */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

/* PÁGINAS HTML */
app.get("/paginas/:arquivo", (req, res) => {
    res.sendFile(path.join(__dirname, "paginas", req.params.arquivo));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log("Servidor rodando na porta:", PORT);
    });
}

module.exports = app;