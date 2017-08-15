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
var sql =  '\
SELECT departments.department_id, departments.department_name, over_head_costs, SUM(product_sales) \
FROM departments \
LEFT JOIN products \
ON departments.department_name = products.department_name \
GROUP BY departments.department_id';

    connection.query(sql, function(err, res) {
        
        // Insantiate and Build the Table 
        var table = new Table({
            head: ['Department ID', 'Department Name', 'Over head costs', 'Product Sales', 'Total Profit']
        });
        res.forEach(function(item) {
            var prodSales;
            if(item['SUM(product_sales)'] === null){
                prodSales = "No Items";
            }else{
                prodSales = item['SUM(product_sales)'].toFixed(2);
            }
            table.push([ item.department_id,
                item.department_name,
                item.over_head_costs,
                prodSales,
                (item['SUM(product_sales)'] - item.over_head_costs).toFixed(2)
            ]);
        });
        //---------------------------------------------------------------------------------------------------

        //Display the user choice
        inquirer.prompt([
            {
                name: "choice",
                message: "Supervisor Menu",
                type: "list",
                choices: ["View Product Sales by Department", "Create New Department", "Exit"]
            },
        ]).then(function(ans){
            
            switch (ans.choice) {
                case "View Product Sales by Department":
                    console.log(table.toString());
                    start();
                    break;
                
                case "Create New Department":
                    createDepartment();
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

function createDepartment(){

    inquirer.prompt([
        {
            name: "name",
            message: "Input Department Name",
            validate: function(input){
                if(input.length > 0) return true;
                else return false;
            }
        },
        {
            name: "costs",
            message: "Input the over-head costs",
            validate: function(input){
                if(isNaN(input)){
                    console.log("Must be a number");
                    return false;
                }else if(input < 0){
                    console.log("Must be > 0");
                    return false;
                }else{
                    return true;
                }
            }
        }
    ]).then(function(ans){
        var post = {
            department_name: ans.name,
            over_head_costs: ans.costs
        }
        connection.query(
            "INSERT INTO departments SET ?",
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

}