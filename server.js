const http = require('http');
const httpProxy = require('http-proxy');

// Your backend servers (Web01 and Web02 on Render)
const servers = [
  'https://web01-aime.onrender.com',
  'https://web02-aime.onrender.com'
];

let current = 0;

// Create proxy
const proxy = httpProxy.createProxyServer({});

// Create server
const server = http.createServer((req, res) => {
  // Pick backend in round-robin
  const target = servers[current];
  current = (current + 1) % servers.length;

  proxy.web(req, res, { target }, (err) => {
    res.writeHead(502);
    res.end('Bad gateway: ' + err.message);
  });
});

// Listen on the port provided by Render
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
