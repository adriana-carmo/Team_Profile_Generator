const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");


const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Create objects for each team member (using the correct classes as blueprints!)
const teamMembers = [];

// Write code to use inquirer to gather information about the development team members
const questions = [
    {   type: "input",
        message:"What is your name?",
        name: "name",
        validate: answer => {
            if (answer !== "" && answer.length >= 3 ) {
                return true
            }
            return "Please, fill in your full name.";
        }
    },
    {   type: "input",
        message:"What is your ID number?",
        name: "ID",
        validate: answer => {
            if (answer !== "" && !isNaN(answer)) {
                return true
            }
            return "Please, fill only with numbers.";
        }
    },
    {
        type: "input",
        message: "What is your email address?",
        name: "email",
        validate: answer => {
            const pass = answer.match(
                /\S+@\S+\.\S+/
            );
            if (pass) {
                return true;
            }
            return "Please enter a valid email address";
        }
    },
    {   
        type: "list",
        message:"Please, select your employee role:",
        choices: ["Engineer",
                "Intern",
                "Manager"
                ],
        name: "role",
        validate: answer => {
            if (answer !== "" && answer.length == 0) {
                return true
            }
            return "Please, select the employee role.";
        }
    },
    //employee type = manager
    {   
        type: "input",
        message:"If you are a manager, please fill in your Manager's office number? Otherwise, write NONE.",
        name: "office",
        validate: answer => {
            if (answer !== "" && answer.length > 1 ) {
                return true
            }
            return "Required field.";
        }
    },
    //employee type = intern
    {   type: "input",
        message:"If you are an intern, please fill in the name of the university you are studying at? Otherwise, write NONE.",
        name: "school",
        validate: answer => {
            if (answer !== "" && answer.length >= 3 ) {
                return true
            }
            return "TRequired field.";
        }
    },
    //employee type = engineer
    {   
        type: "input",
        message:"If you are an engineer, please fill in your GitHub profile? Otherwise, write NONE.",
        name: "github",
        validate: answer => {
            if (answer !== "" && answer.length >= 3 ) {
                return true
            }
            return "Required field.";
        }
    },
    {
        type: "confirm",
        message:"Would you like to add another team member?",
        name: "newMembers"
    }
 ];

 function init() {
    try{
        inquirer.prompt(questions)
        .then((response) => {
            
            switch(response.role){
                case "Manager":
                    const manager = new Manager(response.name, response.ID, response.email, response.office);
                    teamMembers.push(manager);
                    break;
                case "Intern":
                    const intern = new Intern(response.name, response.ID, response.email, response.school);
                    teamMembers.push(intern);
                    break;
                case "Engineer":
                    const engineer = new Engineer(response.name, response.ID, response.email, response.github);
                    teamMembers.push(engineer);
                    break;
            }
            
           (response.newMembers) ? init() : buildTeam();
           
        })
    }
    catch(err){
        //show the error
        console.log(err);
    }
}

// function call to initialize program
init();


// function to create a file named `team.html` in the `output` folder. 
function buildTeam() {

    // check if the `output` folder exists and create it if it does not.
    if(!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFileSync(outputPath, render(teamMembers), "utf8");

}
