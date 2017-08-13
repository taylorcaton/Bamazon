var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table-redemption');

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

    connection.query("SELECT * FROM products", function(err, res) {
        
        // Insantiate and Build the Table 
        var table = new Table({
            head: ['Prod#', 'Product Name', 'Department', 'Price', 'qty']
        });

        res.forEach(function(item) {
            table.push([item.id, item.product_name, item.department_name, item.price, item.stock_quanity]);
        });

        console.log(table.toString());
        //---------------------------------------------------------------------------------------------------

        //Display the user choice
        inquirer.prompt([
            {
                name: "productNum",
                message: "Input the product Number"
            },
            {
                name: "quanity",
                message: "How many?"
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
        console.log(`${myQuanity} vs ${res[0].stock_quanity}`)
        if(res[0].stock_quanity > 0 && res[0].stock_quanity >= myQuanity) {
            console.log(`${res[0].product_name} is available`);
            updateDatabase(myID, myQuanity, res[0].stock_quanity);
        }else{
            console.log(`There are: ${res[0].stock_quanity} ${res[0].product_name}`);
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
}

function updateDatabase(myID, myQuanity, currentQuanity){
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quanity: (currentQuanity - myQuanity)
          },
          {
            id: myID
          }
        ],
        function(err, res) {
          console.log(res.affectedRows + " products updated!\n");
          start();
        }
      )
    
      console.log(query.sql);
}
