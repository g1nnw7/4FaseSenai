create database prova_db;
use prova_db;

CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `cpf` DECIMAL(7,2) NULL,
  `senha` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));