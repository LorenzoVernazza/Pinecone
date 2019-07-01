process.on('message', ({ level, value }) => {
    // process.send(level + ' ' + value + '\n');
    process.stdout.write(level + ' ' + value + '\n');
});