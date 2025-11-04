-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema blog_bd
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema blog_bd
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `blog_bd` DEFAULT CHARACTER SET utf8 ;
USE `blog_bd` ;

-- -----------------------------------------------------
-- Table `blog_bd`.`Usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `blog_bd`.`Usuario` ;

CREATE TABLE IF NOT EXISTS `blog_bd`.`Usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `nome_usuário` VARCHAR(15) NOT NULL,
  `senha` VARCHAR(15) NOT NULL,
  `email` VARCHAR(260) NOT NULL,
  `Quanti_post` INT NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE INDEX `nome_usuário_UNIQUE` (`nome_usuário` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `blog_bd`.`Postagem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `blog_bd`.`Postagem` ;

CREATE TABLE IF NOT EXISTS `blog_bd`.`Postagem` (
  `idPostagem` INT NOT NULL AUTO_INCREMENT,
  `Titulo` VARCHAR(20) NOT NULL,
  `Comentário` VARCHAR(280) NOT NULL,
  `Categoria` VARCHAR(45) NOT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idPostagem`),
  INDEX `idUsuário_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `idUsuário`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `blog_bd`.`Usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `blog_bd`.`Comentario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `blog_bd`.`Comentario` ;

CREATE TABLE IF NOT EXISTS `blog_bd`.`Comentario` (
  `idComentario` INT NOT NULL,
  `Resposta` VARCHAR(280) NOT NULL,
  `idUsuario` INT NOT NULL,
  `idPostagem` INT NOT NULL,
  PRIMARY KEY (`idComentario`),
  INDEX `idUsuario_idx` (`idUsuario` ASC) VISIBLE,
  INDEX `idPostagem_idx` (`idPostagem` ASC) VISIBLE,
  CONSTRAINT `idUsuario`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `blog_bd`.`Usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `idPostagem`
    FOREIGN KEY (`idPostagem`)
    REFERENCES `blog_bd`.`Postagem` (`idPostagem`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
