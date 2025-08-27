-- A cláusula "IF NOT EXISTS" garante que o comando só será executado
-- se a tabela ainda não existir. Isso evita erros se você iniciar
-- o servidor várias vezes.

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    pais VARCHAR(100),
    estado VARCHAR(100),
    cidade VARCHAR(100),
    pontos_totais INT DEFAULT 0,
    data_criacao TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    indice_licao VARCHAR(100) NOT NULL,
    conteudo TEXT NOT NULL,
    quantidade_caracteres INT NOT NULL,
    pontos_ganhos INT NOT NULL,
    data_criacao TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_usuario
        FOREIGN KEY(id_usuario) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);