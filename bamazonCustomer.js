const mysql = require('mysql')
const Table = require('cli-table')
const inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("\n" + "connected as id " + connection.threadId + "\n");
    
  });

  // Show All Table Data
const table = new Table({
    head: ['ITEM_ID', 'PRODUCT_NAME','PRICE'],
    colWidths: [10, 20, 10]
})

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    const createTable = data => table.push([data.ITEM_ID, data.PRODUCT_NAME, data.PRICE]);

    res.forEach(createTable);

    console.log(table.toString());
});

  const questions = [
    {
        name: "item_id",
        message: "What is the id of the product you'd like to buy?"
    },
    {
        name: "product_quantity",
        message: "how many do you want?"
    }
];

function getProduct(answers) {
    console.log("USER ANSWERS: ", answers);
    connection.query("SELECT * FROM products AS foundProduct where item_id = ?", [answers.item_id], function(err, res) {
        if (err) throw err;
        console.log("FOUND PRODUCT: ", res[0]);
        const {PRICE, STOCK_QUANTITY } = res[0];

        if (answers.STOCK_QUANTITY < STOCK_QUANTITY)
            console.log("insufficient quantity!");
        else 
        connection.query("UPDATE table PRODUCTS SET STOCK_QUANTITY = STOCK_QUANTITY - '${answers.PRODUCT_quantity} WHERE id = '${stock_quantity}'",function(err, res){
            if(err) throw err;
            
            //do i need a connection.query(SELECT answers.PRODUCT_NAME, asnwers.product_quantity* price)?
            console.log("Your total is...: ", product_quantity * PRICE)
            
            
            connection.end();
        })
    });
    }

inquirer.prompt(questions).then(answers => getProduct(answers));








// Mikes thoughts

/*

        if (err) throw err;
        console.log("FOUND PRODUCT: ", res[0]);
        const { PRICE, STOCK_QUANTITY } = res[0];

        if (answers.product_quantity > STOCK_QUANTITY) 
            return console.log("Insufficient quantity!")
        else
            connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${answers.product_quantity} WHERE item_id = ${answers.product_id}`, function (err, res){
                if(err) throw err;
                console.log("Your cost was: ", answers.product_quantity * PRICE)
            })

        connection.end();
*/
// ForEach explanation

    /*
        .forEach is the same as:

        function forEach(functionToRunOnEveryItemInArray) {
            for (let i=0; i < array.length; i++) {
                functionToRunOnEveryItemInArray(array[i]);
            }
        }

        
        const console = {
            log: (takeWhatevsImGiven) => Show(takeWhatevsImGiven)
        }

        res.forEach(console.log);
    */