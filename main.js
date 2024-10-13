const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');

program
  .requiredOption('-h, --host <host>', 'Адреса сервера')
  .requiredOption('-p, --port <port>', 'Порт сервера')
  .requiredOption('-c, --cache <cache>', 'Шлях до кешу')
  .parse(process.argv);

const options = program.opts();

const server = http.createServer(async (req, res) => {
    const urlParts = req.url.split('/');
    const httpCode = urlParts[1];
    const imagePath = path.join(options.cache, `${httpCode}.jpg`);

    switch (req.method) {
        case 'GET':
            try {
                const image = await fs.readFile(imagePath);
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(image);
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            }
            break;

        case 'PUT':
            let body = [];
            req.on('data', chunk => body.push(chunk)).on('end', async () => {
                body = Buffer.concat(body);
                try {
                    await fs.writeFile(imagePath, body);
                    res.writeHead(201, { 'Content-Type': 'text/plain' });
                    res.end('Image saved');
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error saving image');
                }
            });
            break;

        case 'DELETE':
            try {
                await fs.unlink(imagePath);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Image deleted');
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            }
            break;

        default:
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method not allowed');
            break;
    }
});

server.listen(options.port, options.host, () => {
    console.log(`Server running at http://${options.host}:${options.port}/`);
});
