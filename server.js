const http = require('http');
const httpProxy = require('http-proxy');

const servers = [
  'https://web01-aime.onrender.com',
  'https://web02-aime.onrender.com'
];

let current = 0;
const maxConn = 256;
let activeConnections = 0;

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: false,
  timeout: 50000,
});

const server = http.createServer((req, res) => {
  if (activeConnections >= maxConn) {
    res.writeHead(503);
    return res.end('503 Service Unavailable: max connections reached');
  }

  const target = servers[current];
  current = (current + 1) % servers.length;

  activeConnections++;
  proxy.web(req, res, { target }, (err) => {
    activeConnections--;
    res.writeHead(502);
    res.end('502 Bad Gateway: ' + err.message);
  });

  res.on('finish', () => {
    activeConnections--;
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
