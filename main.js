const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');

// Налаштування параметрів командного рядка
program
  .requiredOption('-h, --host <host>', 'Адреса сервера')
  .requiredOption('-p, --port <port>', 'Порт сервера')
  .requiredOption('-c, --cache <cache>', 'Шлях до кешу')
  .parse(process.argv);

const options = program.opts();

// Створення веб-сервера
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Сервер працює!');
});

// Запуск сервера
server.listen(options.port, options.host, () => {
    console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});
