var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table-redemption');
var clear = require('clear');
var idList = [];

const receipt = require('receipt');
receipt.config.currency = '$'; // The currency symbol to use in output.
receipt.config.width = 50;     // The amount of characters used to give the output a "width".
receipt.config.ruler = '=';    // The character used for ruler output.

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1234",
  database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
    start();
  });

function start(){
    clear();
    connection.query("SELECT * FROM products", function(err, res) {
        
        // Insantiate and Build the Table 
        var table = new Table({
            head: ['Prod#', 'Product Name', 'Department', 'Price', 'qty']
        });

        res.forEach(function(item) {
            table.push([item.id, item.product_name, item.department_name, "$"+item.price.toFixed(2), item.stock_quanity]);
            idList.push(item.id);
        });

        console.log(table.toString());
        //---------------------------------------------------------------------------------------------------

        //Display the user choice
        inquirer.prompt([
            {
                name: "productNum",
                message: "Input the product Number",
                validate: function(input){
                    
                    if(idList.indexOf(parseInt(input)) >= 0 && input.indexOf(".") < 0){ //Is it in the product list?
                        return true;
                    }else{
                        console.log("\nMust be a number in the product list\n");
                        return false;
                    }
                }
            },
            {
                name: "quanity",
                message: "How many?",
                validate: function(input){
                    if(input > 0){
                        return true;
                    }else{
                        console.log("Must be > 0")
                        return false;
                    }
                }
            }
        ]).then(function(ans){
            productAvailable(ans.productNum, ans.quanity);
        })
    })        

}

function productAvailable(myID, myQuanity){
    connection.query("SELECT * FROM products WHERE ?", 
    {
        id: myID
    },
    function(err, res) {
        if(res[0].stock_quanity > 0 && res[0].stock_quanity >= myQuanity) {
            console.log(`${res[0].product_name} is available\n`);
            
            printReceipt(res[0].product_name, res[0].price, myQuanity);
            updateDatabase(myID, myQuanity, res[0].stock_quanity, res[0].price, res[0].product_sales);
            
        }else{
            console.log(`Not enough stock!: ${res[0].stock_quanity} ${res[0].product_name}`);
            console.log(`You asked for ${myQuanity}`);
            inquirer.prompt([
                {
                    name: "choice",
                    message: "Start Over?",
                    type: "list",
                    choices: ["Yes", "No (Exit)"]
                }
            ]).then(function(ans){
                if(ans.choice === "Yes"){
                    start();
                }else{
                    return;
                }
            })
        } 

    });
}//end of productAvailable()

function updateDatabase(myID, myQuanity, currentQuanity, price, currentSales){
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quanity: (currentQuanity - myQuanity),
            product_sales: currentSales+(myQuanity * price)
          },
          {
            id: myID
          }
        ],
        function(err, res) {
          inquirer.prompt([
            {
                name: "choice",
                message: "Start Over?",
                type: "list",
                choices: ["Yes", "No (Exit)"]
            }
        ]).then(function(ans){
            if(ans.choice === "Yes"){
                start();
            }else{
                return;
            }
        })
          
        }
      )    
} //End of update database()


function printReceipt(item, price, quanity){
    
    var displayPrice = price * 100;
    const output = receipt.create([
        { type: 'text', value: [
            'BAMAZON',
            '315 Olive st.',
            'taylorcaton@bamazon.com',
            'www.bamazon.com'
        ], align: 'center' },
        { type: 'empty' },
        { type: 'table', lines: [
            { item: item, qty: quanity, cost: displayPrice },
        ] },
        { type: 'empty' },
        { type: 'properties', lines: [
            { name: 'CLT Tax (7.25%)', value: '$'+((price * quanity) * .0725).toFixed(2) },
            { name: 'Total amount (excl. CLT Tax)', value: '$'+(price * quanity).toFixed(2) },
            { name: 'Total amount (incl. CLT Tax)', value: '$'+((price * quanity) * 1.0725).toFixed(2) }
        ] },
        { type: 'empty' },
        { type: 'text', value: 'Come back soon!', align: 'center', padding: 5 }
    ]);
     
    console.log(output);
}