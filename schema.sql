CREATE DATABASE bamazon;

CREATE TABLE PRODUCTS(
ITEM_ID INTEGER (100) NOT NULL,
PRODUCT_NAME VARCHAR (20) NOT NULL,
DEPARTMENT_NAME VARCHAR (10) NOT NULL,
PRICE DECIMAL (6,2) NOT NULL,
STOCK_QUANTITY INTEGER (100) NOT NULL,
PRIMARY KEY (ITEM_ID)
);