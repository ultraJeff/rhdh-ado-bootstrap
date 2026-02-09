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

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: config.name,
      version: config.version,
      environment: config.environment,
      message: 'Hello from ${{ values.name }}!',
    }));
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
