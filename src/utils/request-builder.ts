/**
 * Request Builder Utility
 * Provides helper functions for building SuperTest requests with common configurations
 *
 * Behavior automatically adapts based on src/config/template.config.ts
 */

import request, { Test } from 'supertest';
import { getConfig } from '../config/environments';
import {
  TEMPLATE_CONFIG,
  ARCHITECTURE,
  ServiceName,
} from '../config/template.config';

/**
 * Create a SuperTest request instance with base configuration
 *
 * Generated request files automatically pass the correct service name for MICROSERVICES.
 * For SINGLE architecture, parameter can be omitted and defaults to the only service.
 *
 * @param serviceName - Optional service name from TEMPLATE_CONFIG.services
 * @returns SuperTest instance configured for the specified service
 *
 * @example
 * // SINGLE architecture (no parameter needed):
 * createRequest().get('/users')
 * 
 * // MICROSERVICES architecture (parameter injected by generator):
 * createRequest(TEMPLATE_CONFIG.services.PAYMENTS).get('/transactions')
 */
export const createRequest = (serviceName?: ServiceName) => {
  const config = getConfig();
  const services = (config as any).services;

  if (!services) {
    throw new Error(
      `Services not configured in environment file\n` +
        `Ensure your environment config includes the services object`
    );
  }

  // If no serviceName provided, default to first service
  if (!serviceName) {
    const firstServiceKey = Object.keys(TEMPLATE_CONFIG.services)[0] as keyof typeof TEMPLATE_CONFIG.services;
    serviceName = TEMPLATE_CONFIG.services[firstServiceKey];
  }

  if (!services[serviceName]) {
    const availableServices = Object.keys(services).join(', ');
    throw new Error(
      `Service "${serviceName}" not configured in environment\n` +
        `Available services: ${availableServices}\n` +
        `Check your .env file for the corresponding URL variable`
    );
  }

  return request(services[serviceName]);
};

/**
 * Add authentication header to request
 * @param req - SuperTest request instance
 * @param token - Authentication token
 */
export const withAuth = (req: Test, token: string): Test => {
  return req.set('Authorization', `Bearer ${token}`);
};

/**
 * Add API key header to request
 * @param req - SuperTest request instance
 * @param apiKey - API key
 * @param headerName - Header name for API key (default: 'x-api-key')
 */
export const withApiKey = (req: Test, apiKey: string, headerName: string = 'x-api-key'): Test => {
  return req.set(headerName, apiKey);
};

/**
 * Add custom headers to request
 * @param req - SuperTest request instance
 * @param headers - Headers object
 */
export const withHeaders = (req: Test, headers: Record<string, string>): Test => {
  Object.entries(headers).forEach(([key, value]) => {
    req.set(key, value);
  });
  return req;
};

/**
 * Add query parameters to request
 * @param req - SuperTest request instance
 * @param params - Query parameters object
 */
export const withQueryParams = (req: Test, params: Record<string, any>): Test => {
  return req.query(params);
};

/**
 * Helper to build a GET request with common setup
 * 
 * @param path - Request path
 * @param token - Optional authentication token
 * @param serviceName - Optional service name (defaults to first service)
 */
export const buildGetRequest = (path: string, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).get(path);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a POST request with common setup
 * 
 * @param path - Request path
 * @param body - Request body
 * @param token - Optional authentication token
 * @param serviceName - Optional service name (defaults to first service)
 */
export const buildPostRequest = (path: string, body: any, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).post(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a PUT request with common setup
 * 
 * @param path - Request path
 * @param body - Request body
 * @param token - Optional authentication token
 * @param serviceName - Optional service name (defaults to first service)
 */
export const buildPutRequest = (path: string, body: any, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).put(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a PATCH request with common setup
 * 
 * @param path - Request path
 * @param body - Request body
 * @param token - Optional authentication token
 * @param serviceName - Optional service name (defaults to first service)
 */
export const buildPatchRequest = (path: string, body: any, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).patch(path).send(body);
  return token ? withAuth(req, token) : req;
};

/**
 * Helper to build a DELETE request with common setup
 * 
 * @param path - Request path
 * @param token - Optional authentication token
 * @param serviceName - Optional service name (defaults to first service)
 */
export const buildDeleteRequest = (path: string, token?: string, serviceName?: ServiceName): Test => {
  const req = createRequest(serviceName).delete(path);
  return token ? withAuth(req, token) : req;
};
