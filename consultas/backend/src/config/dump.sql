CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER'
);
CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_consulta VARCHAR, 
    hora_consulta VARCHAR UNIQUE,
    status VARCHAR(20) DEFAULT 'PENDENTE'
);

PORT=3000
JWT_SECRET="MATHIAS123"
DATABASE_URL="postgresql://postgres:senai@localhost:5432/clinica"