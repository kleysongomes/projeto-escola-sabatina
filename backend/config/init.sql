-- Cria a tabela de igrejas PRIMEIRO, pois os usuários dependem dela.
CREATE TABLE IF NOT EXISTS igrejas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  cidade VARCHAR(255),
  estado VARCHAR(100),
  pais VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cria a tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    pais VARCHAR(100),
    estado VARCHAR(100),
    cidade VARCHAR(100),
    pontos_totais INT DEFAULT 0,
    data_criacao TIMESTAMPTZ DEFAULT NOW(),
    is_admin BOOLEAN NOT NULL DEFAULT false,
    igreja_id INT,
    refresh_token TEXT,
    politica_privacidade_aceita_em TIMESTAMPTZ,
    tema VARCHAR(20) NOT NULL DEFAULT 'light',
    CONSTRAINT fk_igreja
      FOREIGN KEY(igreja_id) 
      REFERENCES igrejas(id)
      ON DELETE SET NULL
);

-- Cria a tabela de reviews
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

-- Cria a tabela de ligação para likes
CREATE TABLE IF NOT EXISTS review_likes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  review_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_review FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  UNIQUE(user_id, review_id)
);

-- Cria a tabela de ligação para reports
CREATE TABLE IF NOT EXISTS review_reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  review_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_review FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  UNIQUE(user_id, review_id)
);

-- Cria a tabela para os reports de bugs
CREATE TABLE IF NOT EXISTS bug_reports (
  id SERIAL PRIMARY KEY,
  user_id INT,
  description TEXT NOT NULL,
  page_url VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'aberto',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ADICIONADO: Cria a tabela para as propagandas
CREATE TABLE IF NOT EXISTS propagandas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_url TEXT NOT NULL,
    link_url TEXT,
    target_pais VARCHAR(100),
    target_estado VARCHAR(100),
    target_cidade VARCHAR(100),
    target_igreja_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_igreja_target
        FOREIGN KEY(target_igreja_id)
        REFERENCES igrejas(id)
        ON DELETE SET NULL
);