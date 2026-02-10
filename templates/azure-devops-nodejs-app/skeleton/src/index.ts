/**
 * ${{ values.name }}
 * ${{ values.description }}
 */

import http from 'http';

interface AppConfig {
  name: string;
  version: string;
  environment: string;
  port: number;
}

function getConfig(): AppConfig {
  return {
    name: '${{ values.name }}',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
  };
}

function createServer(config: AppConfig): http.Server {
  return http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy' }));
      return;
    }

    if (req.url === '/ready') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ready' }));
      return;
    }

    if (req.url === '/api') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        name: config.name,
        version: config.version,
        environment: config.environment,
        message: 'Hello from ${{ values.name }}!',
      }));
      return;
    }

    // Serve HTML for browser
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      text-align: center;
      max-width: 500px;
    }
    h1 { color: #1a202c; margin-bottom: 0.5rem; font-size: 2rem; }
    .version { color: #718096; margin-bottom: 1.5rem; }
    .message { color: #4a5568; font-size: 1.25rem; margin-bottom: 1.5rem; }
    .env-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      background: ${config.environment === 'production' ? '#c6f6d5' : '#fef3c7'};
      color: ${config.environment === 'production' ? '#276749' : '#92400e'};
    }
    .links { margin-top: 2rem; }
    .links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 0.5rem;
    }
    .links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${config.name}</h1>
    <p class="version">v${config.version}</p>
    <p class="message">Hello from ${{ values.name }}!</p>
    <span class="env-badge">${config.environment}</span>
    <div class="links">
      <a href="/api">API</a> |
      <a href="/health">Health</a> |
      <a href="/ready">Ready</a>
    </div>
  </div>
</body>
</html>
    `);
  });
}

function main(): void {
  const config = getConfig();
  const server = createServer(config);

  server.listen(config.port, () => {
    console.log(`Starting ${config.name} v${config.version}`);
    console.log(`Environment: ${config.environment}`);
    console.log(`Server listening on port ${config.port}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

// Export for testing
export { getConfig, createServer, AppConfig };

// Run if executed directly
if (require.main === module) {
  main();
}
