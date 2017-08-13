DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price FLOAT(10) NULL DEFAULT 0.0,
  stock_quanity INT(10) DEFAULT 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Dress" ,"Clothing", 39.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Leggings","Clothing",9.99,5);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Seabreeze Candle (With a lil bit of coconut)","Home Accents",17.99,3);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Wooden Duck Door Stop","Home Accents",24.99,3);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Nintendo Switch","Electronics", 299.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Super Nintendo Classic","Electronics",79.99,3);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Science Diet Dog Food for Dachshunds","Pet Supplies", 17.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Bully Sticks","Pet Supplies", 19.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Oriental Rug","Furniture", 865.99, 4);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Leather Recliner","Furniture",599.99,8);

SELECT * from products;