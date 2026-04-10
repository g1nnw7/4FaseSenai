CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'Ativo', -- 'Ativo', 'Rascunho', 'Esgotado'
    estoque INT DEFAULT 0,
    preco DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER'
);


PORT=3000
JWT_SECRET="MATHIAS123"
DATABASE_URL="postgresql://postgres:senai@localhost:5432/rappa"