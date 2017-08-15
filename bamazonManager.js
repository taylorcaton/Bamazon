var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table-redemption');
var clear = require('clear');
var itemList = [];

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
clear();
function start(){
    connection.query("SELECT * FROM products", function(err, res) {
        
        // Insantiate and Build the Table 
        var table = new Table({
            head: ['Prod#', 'Product Name', 'Department', 'Price', 'qty']
        });

        var tableLow = new Table({
            head: ['Prod#', 'Product Name', 'Department', 'Price', 'qty']
        });

        res.forEach(function(item) {
            table.push([item.id, item.product_name, item.department_name, "$"+item.price.toFixed(2), item.stock_quanity]);
            itemList.push({id: item.id, name: item.product_name, quanity: item.stock_quanity, department: item.department_name});
            if(item.stock_quanity < 5){
                tableLow.push([item.id, item.product_name, item.department_name, item.price, item.stock_quanity]);
            }
        });
        //---------------------------------------------------------------------------------------------------

        //Display the user choice
        inquirer.prompt([
            {
                name: "choice",
                message: "Manager Menu",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
            },
        ]).then(function(ans){
            
            switch (ans.choice) {
                case "View Products for Sale":
                    console.log(table.toString());
                    start();
                    break;
                
                case "View Low Inventory":
                    console.log(tableLow.toString());
                    start();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;
                
                case "Add New Product":
                    addNewProduct();
                    break;
                
                case "Exit":
                    console.log("Bye!")
                    return;
                
                default:
                    break;
            }

        })
    })        
}

function addToInventory(){
    inquirer.prompt([
        {
            name: 'product',
            message: "Which product would you like to add to?",
            type: "list",
            choices: function(){
                var tempList = [];
                itemList.forEach(function(ele){
                    tempList.push(ele.name);
                })
                return tempList;
            }
        },
        {
            name: 'quanity',
            message: 'How many would you like to add?',
            validate: function(input){
                if(isNaN(input)){
                    console.log("Input is not a number")
                     return false //input is not a number
                }else if(input <= 0){
                    console.log("Input must be > 0");
                    return false;
                }else{
                    return true;
                }
            }
        }
    ]).then(function(ans){

        var myID;
        var quanity;
        itemList.forEach(function(ele){
            if(ele.name === ans.product){
                myID = ele.id;
                quanity = ele.quanity;
            }
        })

        var newAmount = parseInt(quanity) + parseInt(ans.quanity);

        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quanity: newAmount
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
                    clear();
                    start();
                }else{
                    return;
                }
            })
              
            }
          )//end of connection query    

    })
}//end of addToInventory()

function addNewProduct(){

    connection.query("SELECT * FROM departments", function(err, res) {
        
        //Build a list of updated departments to choose from

        //departments we know
        var tempList = [];
        itemList.forEach(function(ele){
            if(tempList.indexOf(ele.department) === -1){
                tempList.push(ele.department);
            }
        });
        
        //add depts that don't have items (from the departments table)
        res.forEach(function(element){
            if(tempList.indexOf(element.department_name) === -1){
                tempList.push(element.department_name)
            }
        });

        inquirer.prompt([
            {
                name: 'dept',
                message: 'Which DEPARTMENT will we sell this in?',
                type: "list",
                choices: tempList
            },
            {
                name: 'product',
                message: "What is the NAME of the new product?",
            },
            {
                name: 'price',
                message: 'How much will it COST?',
                validate: function(input){
                    if(isNaN(input)){
                        console.log("Input is not a number")
                        return false //input is not a number
                    }else if(input <= 0){
                        console.log("Input must be > 0");
                        return false;
                    }else{
                        return true;
                    }
                }
            },
            {
                name: 'quanity',
                message: 'How many do we have in our inventory?',
                validate: function(input){
                    if(isNaN(input)){
                        console.log("Input is not a number")
                        return false //input is not a number
                    }else if(input <= 0){
                        console.log("Input must be > 0");
                        return false;
                    }else{
                        return true;
                    }
                }
            }
        ]).then(function(ans){
            
            var price = parseFloat(ans.price).toFixed(2);

            var post = {
                product_name: ans.product,
                department_name: ans.dept,
                price: price,
                stock_quanity: parseInt(ans.quanity)
            }
            connection.query(
                "INSERT INTO products SET ?",
                post,
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
                        clear();
                        start();
                    }else{
                        return;
                    }
                })
                if(err) console.log(err);
                }
            )//end of connection query    

        })
    })
}//end of addNewProduct()

