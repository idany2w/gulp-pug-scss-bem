const fs = require('fs');
const readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Введите название страницы ", function(name) {
    if (fs.existsSync(`./app/pages/${name}.pug`)) {
        console.error('страница уже существует')
        rl.close();
    } else{
        fs.writeFileSync(`./app/pages/${name}.pug`, `extends base.pug

        block content 
            //- content here`);
        rl.close();
    }
});


