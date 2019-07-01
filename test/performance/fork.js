const fs = require('fs');

const prints = 10000;
const executions = 10;
const value = 'some testing string';
const child = require('child_process').fork('./test/performance/fork_child', [], {
    stdio: ['ipc', 1, 1]
});

console.log('Starting...');
const start = Date.now();
async function run() {
    for (let i = 0; i < prints; i++) {
        child.send({ level: 'info', value });
    }
}
child.unref();
// child.on('message', (value) => {
//     process.stdout.write(value);
// });

for (let i = 0; i < executions; i++) {
    run();
}

const end = Date.now();

process.on('beforeExit', () => {
    child.kill();
    const end2 = Date.now();
    console.log('Elapsed:', end - start); 
    console.log('Elapsed 2:', end2 - start);
    fs.appendFileSync('fork.txt', (end - start) + ' ' + (end2 - start) + '\n');
});
