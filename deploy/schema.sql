-- ============================================================
-- Brinka Mais Festas — Schema PostgreSQL
-- Execute no seu servidor PostgreSQL
-- ============================================================

-- Tabela de conversas WhatsApp
CREATE TABLE IF NOT EXISTS conversas (
  id          SERIAL PRIMARY KEY,
  numero      VARCHAR(20)  NOT NULL UNIQUE,
  nome        VARCHAR(100),
  ultimo_contato TIMESTAMP DEFAULT NOW(),
  status      VARCHAR(20)  DEFAULT 'ativo',
  criado_em   TIMESTAMP    DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagens (
  id          SERIAL PRIMARY KEY,
  numero      VARCHAR(20)  NOT NULL,
  nome        VARCHAR(100),
  direcao     VARCHAR(10)  NOT NULL CHECK (direcao IN ('entrada', 'saida')),
  conteudo    TEXT         NOT NULL,
  criado_em   TIMESTAMP    DEFAULT NOW()
);

-- Tabela de anotações do atendente
CREATE TABLE IF NOT EXISTS anotacoes (
  id              SERIAL PRIMARY KEY,
  cliente         VARCHAR(100),
  atendente       VARCHAR(100),
  texto           TEXT         NOT NULL,
  hora            VARCHAR(10),
  data_anotacao   VARCHAR(20),
  criado_em       TIMESTAMP    DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id            SERIAL PRIMARY KEY,
  cliente_nome  VARCHAR(100) NOT NULL,
  cliente_tel   VARCHAR(20),
  item          VARCHAR(200),
  data_festa    DATE,
  local_evento  TEXT,
  num_criancas  INTEGER,
  status        VARCHAR(20)  DEFAULT 'pendente' 
                CHECK (status IN ('pendente', 'aguardando', 'confirmado', 'cancelado')),
  obs           TEXT,
  atendente     VARCHAR(100),
  criado_em     TIMESTAMP    DEFAULT NOW(),
  atualizado_em TIMESTAMP    DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_mensagens_numero ON mensagens(numero);
CREATE INDEX IF NOT EXISTS idx_mensagens_criado ON mensagens(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_anotacoes_cliente ON anotacoes(cliente);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(data_festa);

-- View útil: conversas com último contato
CREATE OR REPLACE VIEW v_conversas_resumo AS
SELECT
  numero,
  nome,
  MAX(criado_em) AS ultimo_contato,
  COUNT(*) AS total_mensagens,
  SUM(CASE WHEN direcao = 'entrada' THEN 1 ELSE 0 END) AS nao_respondidas
FROM mensagens
GROUP BY numero, nome
ORDER BY ultimo_contato DESC;

-- Dados de exemplo (opcional)
INSERT INTO pedidos (cliente_nome, cliente_tel, item, data_festa, local_evento, num_criancas, status)
VALUES
  ('Maria Silva',    '11999990001', 'Pula-Pula Castelo',   '2026-05-30', 'Rua das Flores, 123', 15, 'confirmado'),
  ('Carlos Oliveira','11999990002', 'Totó + Piscina',       '2026-06-01', 'Av. Central, 456',    10, 'aguardando'),
  ('Ana Beatriz',    '11999990003', 'Kit Completo',         '2026-06-07', 'Rua dos Pinheiros, 789', 20, 'confirmado'),
  ('João Santos',    '11999990004', 'Cama Elástica',        '2026-06-14', 'Rua Nova, 321',        8,  'pendente')
ON CONFLICT DO NOTHING;
