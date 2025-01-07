const fs = require('fs');
const path = require('path');


const dirFrom = './backupsFrom';
const dirTo = './backupsTo';
const logFrom = './backupsFrom.log';
const logTo = './backupsTo.log';

function listarArquivos(diretorio) {
    try {
        const arquivos = fs.readdirSync(diretorio);
        return arquivos.map((arquivo) => {
            const caminhoArquivo = path.join(diretorio, arquivo);
            const stats = fs.statSync(caminhoArquivo);
            return {
                nome: arquivo,
                tamanho: stats.size,
                criadoEm: stats.ctime, 
                modificadoEm: stats.mtime,
                caminho: caminhoArquivo,
            };
        });
    } catch (error) {
        console.error(`Erro ao listar arquivos no diretório ${diretorio}:`, error.message);
        return [];
    }
}

function salvarLog(dados, arquivoLog) {
    try {
        const conteudo = dados.map(
            (item) =>
                `Nome: ${item.nome} | Tamanho: ${item.tamanho} bytes | Criado em: ${item.criadoEm} | Modificado em: ${item.modificadoEm}`
        ).join('\n');
        fs.writeFileSync(arquivoLog, conteudo, 'utf8');
    } catch (error) {
        console.error(`Erro ao salvar log no arquivo ${arquivoLog}:`, error.message);
    }
}

function processarArquivos() {
    try {
        const arquivos = listarArquivos(dirFrom);
        salvarLog(arquivos, logFrom);

        const dataAtual = new Date();
        const limiteDias = 3;

        const arquivosMovidos = [];
        const arquivosRemovidos = [];

        arquivos.forEach((arquivo) => {
            const diffDias = (dataAtual - new Date(arquivo.criadoEm)) / (1000 * 60 * 60 * 24);

            if (diffDias > limiteDias) {
                try {
                    fs.unlinkSync(arquivo.caminho);
                    arquivosRemovidos.push(arquivo);
                } catch (error) {
                    console.error(`Erro ao remover arquivo ${arquivo.nome}:`, error.message);
                }
            } else {
                try {
                    const destino = path.join(dirTo, arquivo.nome);
                    fs.copyFileSync(arquivo.caminho, destino); 
                    arquivosMovidos.push(arquivo);
                } catch (error) {
                    console.error(`Erro ao copiar arquivo ${arquivo.nome}:`, error.message);
                }
            }
        });

        salvarLog(arquivosMovidos, logTo);

        console.log(`Processamento concluído:
        - Arquivos movidos: ${arquivosMovidos.length}
        - Arquivos removidos: ${arquivosRemovidos.length}`);
    } catch (error) {
        console.error('Erro no processamento dos arquivos:', error.message);
    }
}

function garantirDiretorios(diretorios) {
    try {
        diretorios.forEach((dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Diretório criado: ${dir}`);
            }
        });
    } catch (error) {
        console.error('Erro ao garantir diretórios:', error.message);
    }
}

try {
    garantirDiretorios([dirFrom, dirTo]);
    processarArquivos();
} catch (error) {
    console.error('Erro inesperado na execução:', error.message);
}
