import { getConfig } from './index';

describe('${{ values.name }}', () => {
  describe('getConfig', () => {
    it('should return app configuration', () => {
      const config = getConfig();
      
      expect(config).toBeDefined();
      expect(config.name).toBe('${{ values.name }}');
      expect(config.version).toBe('1.0.0');
    });

    it('should default to development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;
      
      const config = getConfig();
      expect(config.environment).toBe('development');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should use NODE_ENV when set', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const config = getConfig();
      expect(config.environment).toBe('production');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should default to port 3000', () => {
      const originalPort = process.env.PORT;
      delete process.env.PORT;
      
      const config = getConfig();
      expect(config.port).toBe(3000);
      
      process.env.PORT = originalPort;
    });

    it('should use PORT when set', () => {
      const originalPort = process.env.PORT;
      process.env.PORT = '8080';
      
      const config = getConfig();
      expect(config.port).toBe(8080);
      
      process.env.PORT = originalPort;
    });
  });
});
