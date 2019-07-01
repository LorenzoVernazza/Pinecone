const fs = require('fs');

const prints = 10000;
const executions = 10;
const value = 'some testing string';

console.log('Starting...');
const start = Date.now();
function run() {
    for (let i = 0; i < prints; i++) {
        process.stdout.write(value + '\n');
    }
}

for (let i = 0; i < executions; i++) {
    run();
}
const end = Date.now();
console.log('Elapsed:', end - start); 

fs.appendFileSync('none.txt', (end - start) + '\n');
