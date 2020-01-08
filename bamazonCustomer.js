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

connection.connect(function (err) {
    if (err) throw err;
    console.log("\n" + "connected as id " + connection.threadId + "\n");
    start()
});

function createTable() {
    return new Table({
        head: ['ITEM_ID', 'PRODUCT_NAME', 'PRICE', 'STOCK_QUANTITY'],
        colWidths: [10, 20, 10, 10]
    })
}

function start(){
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
    
        askForItem(res)
    });
}
// Show All Table Data
let table = createTable()
const createTableRow = data => table.push([data.ITEM_ID, data.PRODUCT_NAME, data.PRICE, data.STOCK_QUANTITY]);

function askForItem(dbData) {
    // Show All Table Data
    table = createTable()
    // Log all results of the SELECT statement    
    dbData.forEach(createTableRow);
    console.log(table.toString());

    inquirer.prompt(questions).then(function ({
        item_id,
        stock_quantity
    }) {
        // var {item_id, stock_quantity} = answers;
        // getProduct(answers);
        var item = findItemById(dbData, parseInt(item_id))
        var {
            STOCK_QUANTITY,
            ITEM_ID,
            PRICE
        } = item;
        console.log(item, item_id, stock_quantity)
        if (!item) {
            console.log("No Item Found")
            askForItem(dbData)
        } else if (STOCK_QUANTITY < stock_quantity) {
            console.log("insufficient quantity!");
            askForItem(dbData)
        } else {
            updateInventory(ITEM_ID, PRICE, stock_quantity)
        }
    })

}

const questions = [{
        name: "item_id",
        message: "What is the id of the product you'd like to buy?"
    },
    {
        name: "stock_quantity",
        message: "how many do you want?"
    }
];

function findItemById(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].ITEM_ID === id) {
            return arr[i]
        }
    }
    return false;
};

function updateInventory(id, price, amount) {
    var str = 'UPDATE PRODUCTS '
    str += 'SET STOCK_QUANTITY = STOCK_QUANTITY - ? '
    str += 'WHERE ITEM_ID = ?'
    var data = [amount, id]

    var totalCost = price * amount;

    connection.query(str, data, function (err, res) {
        if (err) throw err;
        console.log('UPDATED');
        console.log("Your total is...: ", totalCost)
        start()
    })
}


function getProduct(answers) {
    console.log("ANSWERS: ", answers);
    connection.query("SELECT * FROM products WHERE ITEM_ID = ?", [answers.item_id], function (err, res) {
        if (err) throw err;
        console.log("RESPONSE:", res);
        console.log("First Value: ", res[0]);
        const {
            PRICE,
            STOCK_QUANTITY
        } = res[0];
        if (answers.STOCK_QUANTITY < STOCK_QUANTITY)
            console.log("insufficient quantity!");
        else {
            const newQuantity = STOCK_QUANTITY - product_quantity;
            const totalCost = answers.product_quantity * PRICE;
            connection.query("UPDATE PRODUCTS SET ? WHERE ? ",
                [{
                        newQuantity
                    },
                    {
                        ITEM_ID
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log('UPDATED');
                    console.log("Your total is...: ", totalCost)

                })

        };
        connection.end();
    })

    inquirer.prompt(questions).then(answers => getProduct(answers));
}







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