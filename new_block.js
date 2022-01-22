const fs = require('fs');
const readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Введите название блока ", function(name) {
    if (fs.existsSync(`./app/blocks/${name}`)) {
        console.error('Блок уже существует')
        rl.close();
    } else{
        fs.mkdirSync(`./app/blocks/${name}`);
        fs.writeFileSync(`./app/blocks/${name}/${name}.js`, `console.log("${name}")`);
        fs.writeFileSync(`./app/blocks/${name}/${name}.scss`, `@import "../../assets/styles/_block_dependencies";\n\n.${name}{\n\t$b: &;\n}`);
        fs.writeFileSync(`./app/blocks/${name}/${name}.pug`, `mixin(data)\n\t.${name}`);
        rl.close();
    }
});


