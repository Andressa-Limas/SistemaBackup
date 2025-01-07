const fs = require('fs');
const path = require('path');

const dirFrom = './backupsFrom';

if (!fs.existsSync(dirFrom)) {
    fs.mkdirSync(dirFrom);
}

const criarArquivoTeste = (nome, dataCriacao) => {
    const caminhoArquivo = path.join(dirFrom, nome);
    fs.writeFileSync(caminhoArquivo, 'Conteúdo de teste');
    fs.utimesSync(caminhoArquivo, dataCriacao, dataCriacao);
};

criarArquivoTeste('arquivo1.txt', new Date(2025, 0, 1)); 
criarArquivoTeste('arquivo2.txt', new Date(2025, 0, 3)); 
criarArquivoTeste('arquivo3.txt', new Date(2025, 0, 5)); 
