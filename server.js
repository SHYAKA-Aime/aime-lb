const http = require("http");

const servers = [
  "https://web01-aime.onrender.com/",
  "https://web02-aime.onrender.com/"
];

let current = 0;

const server = http.createServer((req, res) => {
  // Select server using round-robin
  const target = servers[current];
  current = (current + 1) % servers.length;

  // Show a loading page and redirect after a short delay
  const loadingPage = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting...</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            background: #f5f5f5;
            padding-top: 15%;
          }
          .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          p { margin-top: 20px; color: #333; }
        </style>
        <meta http-equiv="refresh" content="1; url=${target}">
      </head>
      <body>
        <div class="loader"></div>
        <p>Please wait... redirecting you to the app.</p>
      </body>
    </html>
  `;

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(loadingPage);
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Load balancer running...");
});
