const { program } = require('commander');
const http = require('http');
const fs = require('fs');


program
    .requiredOption('-h, --host', 'Address of server')
    .requiredOption('-p, --port', 'Server port')
    .requiredOption('-c, --cache', 'Directory path stores cashed data');

program.parse(process.argv);

const options = program.opts();

// options.host
const requestListener = function (req, res){
    res.write(200);
    res.end('My not first server');
}

const server = http.createServer(requestListener);

const host = options.host;
const port = options.port;


server.listen(port, host, () =>{    
    console.log(`server is running on http://${host}:${port}`)
});