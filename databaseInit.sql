DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  stock_quanity INT(10) DEFAULT 0,
  product_sales DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Dress" ,"Clothing", 39.99, 600);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Leggings","Clothing",9.99,3000);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Seabreeze Candle (With a lil bit of coconut)","Home Accents",17.99,4000);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Wooden Duck Door Stop","Home Accents",24.99,800);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Nintendo Switch","Electronics", 299.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Super Nintendo Classic","Electronics",79.99,3);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Science Diet Dog Food for Dachshunds","Pet Supplies", 17.99, 2000);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Bully Sticks","Pet Supplies", 19.99, 300);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Oriental Rug","Furniture", 865.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Leather Recliner","Furniture",599.99,50);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs INT(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
	VALUES 
		("Clothing", 2000),
        ("Home Accents", 1000),
        ("Electronics", 5000),
        ("Pet Supplies", 1000),
        ("Furniture", 3000);



SELECT * from departments;
SELECT * from products;