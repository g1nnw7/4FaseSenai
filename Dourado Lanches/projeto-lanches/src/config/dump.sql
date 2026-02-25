CREATE SCHEMA `dourado_lanches` ;
USE `dourado_lanches` ;

CREATE TABLE `dourado_lanches`.`produto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL,
  `descricao` VARCHAR(255) NULL,
  `valor` DECIMAL(7,2) NULL,
  `ativo` INT NULL,
  `data_cadastro` TIMESTAMP NULL,
  `usuario_cadastro` INT NULL,
  `data_atualizacao` DATETIME NULL,
  `usuario_atualizacao` INT NULL,
  `data_exclusao` DATETIME NULL,
  `usuario_exclusao` INT NULL,
  PRIMARY KEY (`id`));


INSERT INTO `dourado_lanches`.`produto`
(`nome`, `descricao`, `valor`, `ativo`, `data_cadastro`, `usuario_cadastro`, `data_atualizacao`, `usuario_atualizacao`, `data_exclusao`, `usuario_exclusao`)
VALUES
('X-Burger', 'Hambúrguer, queijo, alface, tomate e maionese', 18.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('X-Salada', 'Hambúrguer, queijo, alface, tomate, cebola e maionese', 20.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('X-Bacon', 'Hambúrguer, queijo, bacon crocante e maionese', 24.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('X-Egg', 'Hambúrguer, queijo, ovo, alface e tomate', 22.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('X-Tudo', 'Hambúrguer, queijo, bacon, ovo, presunto, alface, tomate e batata palha', 29.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Cheeseburger Duplo', 'Dois hambúrgueres, cheddar e molho especial', 28.50, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Hot Dog Simples', 'Salsicha, molho, batata palha e ketchup/mostarda', 12.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Hot Dog Completo', '2 salsichas, molho, milho, ervilha, purê, batata palha e vinagrete', 18.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Misto Quente', 'Pão, presunto, queijo e manteiga', 9.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Americano', 'Pão, presunto, queijo, ovo, alface e tomate', 14.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Porção de Batata Frita P', 'Batata frita crocante (porção pequena)', 14.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Porção de Batata Frita G', 'Batata frita crocante (porção grande)', 24.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Onion Rings', 'Anéis de cebola empanados (porção)', 19.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Nuggets (10 un.)', 'Nuggets de frango (10 unidades)', 17.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Coxinha', 'Coxinha de frango com catupiry (unidade)', 7.50, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Pastel de Carne', 'Pastel frito recheado com carne moída (unidade)', 8.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Pastel de Queijo', 'Pastel frito recheado com queijo (unidade)', 8.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Refrigerante Lata 350ml', 'Refrigerante em lata 350ml (sabores variados)', 6.50, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Suco Natural 500ml', 'Suco natural 500ml (laranja/limão/maracujá)', 9.90, 1, NOW(), 1, NULL, NULL, NULL, NULL),
('Água Mineral 500ml', 'Água mineral sem gás 500ml', 4.50, 1, NOW(), 1, NULL, NULL, NULL, NULL);