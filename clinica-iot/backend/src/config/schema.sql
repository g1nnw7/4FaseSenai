-- ============================================================
-- RAPPA CLINIC - Schema do Banco de Dados
-- ============================================================

CREATE DATABASE rappa_clinic;

\c rappa_clinic;

-- Tabela de usuários (USER e DOCTOR)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'DOCTOR')),
    status VARCHAR(15) DEFAULT NULL CHECK (status IN ('disponivel', 'em_consulta', 'indisponivel')),
    especialidade VARCHAR(100) DEFAULT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Status só faz sentido para DOCTOR
-- A aplicação garante isso na lógica, mas podemos adicionar constraint:
-- ALTER TABLE usuarios ADD CONSTRAINT chk_status_doctor CHECK (role = 'DOCTOR' OR status IS NULL);

-- Tabela de consultas
CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    medico_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_hora TIMESTAMP NOT NULL,
    duracao_minutos INTEGER NOT NULL DEFAULT 30,
    motivo VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'concluida', 'cancelada')),
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_consultas_paciente ON consultas(paciente_id);
CREATE INDEX idx_consultas_medico ON consultas(medico_id);
CREATE INDEX idx_consultas_data_hora ON consultas(data_hora);
CREATE INDEX idx_usuarios_role ON usuarios(role);

-- ============================================================
-- DADOS INICIAIS (Seeds)
-- ============================================================

-- Senha padrão para seeds: "senha123" (bcrypt hash)
-- Gere com: bcrypt.hash('senha123', 10)
-- Usando hash pré-gerado para facilitar o seed inicial:

INSERT INTO usuarios (nome, email, senha, role, status, especialidade) VALUES
('Dr. Marcus Rappa', 'marcus@rappa.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', 'disponivel', 'Clínica Geral'),
('Dra. Ana Oliveira', 'ana@rappa.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', 'disponivel', 'Cardiologia'),
('Dr. Pedro Costa', 'pedro@rappa.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', 'indisponivel', 'Neurologia'),
('João Silva', 'joao@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', NULL, NULL),
('Maria Santos', 'maria@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', NULL, NULL);

-- Nota: O hash acima corresponde à senha "password" do faker/mockjs
-- Para produção, gere hashes reais com bcrypt

-- Trigger para atualizar 'atualizado_em' automaticamente
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_consultas_atualizado_em
    BEFORE UPDATE ON consultas
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em();