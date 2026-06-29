CREATE TABLE configuracoes_usuario (
    id SERIAL PRIMARY KEY,
	cpf VARCHAR(14) UNIQUE NOT NULL,           
    nome VARCHAR(255) NOT NULL,                     
    email VARCHAR(255) UNIQUE NOT NULL,
	tamanho_fonte VARCHAR(50) DEFAULT 'grande',          
    tema_interface VARCHAR(50) DEFAULT 'simplificada', 
    comando_voz BOOLEAN DEFAULT true,               
    contato_emergencia TEXT                             
);

CREATE INDEX idx_configuracoes_cpf ON configuracoes_usuario(cpf);

INSERT INTO configuracoes_usuario (cpf, nome, email, tamanho_fonte, tema_interface, comandos_voz, contato_emergencia)
VALUES 
('122.955.569-29', 'Helena da Silva Martins','helena_s_martins@estudante.sesisenai.org.br','extra-grande','simplificada', true,'Filho Thomás: (48) 98486-3364')