CREATE SCHEMA dourado_lanches;

USE dourado_lanches;

CREATE TABLE `dourado_lanches`.`produto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `valor` DECIMAL(7,2) NULL,
  `descricao` VARCHAR(255) NULL,
  `ativo` INT NULL,
  PRIMARY KEY (`id`));
  
INSERT INTO `dourado_lanches`.`produto` (`nome`, `valor`, `descricao`, `ativo`) VALUES
('X-Burguer', 18.90, 'Hamburguer, queijo, alface e tomate', 1),
('X-Salada', 20.50, 'Hamburguer, queijo, alface, tomate e maionese', 1),
('X-Bacon', 22.00, 'Hamburguer, queijo e bacon crocante', 1),
('X-Tudo', 28.90, 'Hamburguer, queijo, presunto, bacon, ovo e salada', 1),
('Hamburguer Simples', 15.00, 'Pao, hamburguer e molho especial', 1),
('Cheeseburguer Duplo', 25.50, 'Dois hamburgueres e queijo cheddar', 1),
('Batata Frita Pequena', 10.00, 'Porcao pequena de batata frita', 1),
('Batata Frita Media', 15.00, 'Porcao media de batata frita', 1),
('Batata Frita Grande', 20.00, 'Porcao grande de batata frita', 1),
('Refrigerante Lata', 6.00, 'Refrigerante lata 350ml', 1),
('Refrigerante 2L', 12.00, 'Refrigerante garrafa 2 litros', 1),
('Suco Natural Laranja', 8.50, 'Suco natural de laranja 300ml', 1),
('Suco Natural Abacaxi', 9.00, 'Suco natural de abacaxi 300ml', 1),
('Milkshake Chocolate', 14.00, 'Milkshake sabor chocolate 400ml', 1),
('Milkshake Morango', 14.00, 'Milkshake sabor morango 400ml', 1),
('Hot Dog Simples', 12.00, 'Pao, salsicha, molho e batata palha', 1),
('Hot Dog Especial', 16.50, 'Pao, duas salsichas, queijo e bacon', 1),
('Combo X-Burguer', 29.90, 'X-Burguer, batata media e refrigerante lata', 1),
('Combo X-Salada', 31.90, 'X-Salada, batata media e refrigerante lata', 1),
('Agua Mineral', 4.00, 'Agua mineral sem gas 500ml', 1);