import type { ApiResponse } from '@/types/api';

/**
 * Standard API error codes
 */
export enum ErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  USER_EXISTS = 'USER_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  API_KEY_NOT_FOUND = 'API_KEY_NOT_FOUND',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
  API_KEY_EXPIRED = 'API_KEY_EXPIRED',
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(
  data?: T,
  message: string = 'Success',
  statusCode: number = 200
): { response: ApiResponse<T>; statusCode: number } {
  return {
    response: {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: generateRequestId(),
      },
    },
    statusCode,
  };
}

/**
 * Create an error API response
 */
export function createErrorResponse<T = any>(
  code: ErrorCode,
  message: string,
  details?: any,
  statusCode: number = 400
): { response: ApiResponse<T>; statusCode: number } {
  return {
    response: {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: generateRequestId(),
      },
    },
    statusCode,
  };
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert application error code to HTTP status code
 */
export function getStatusCodeForErrorCode(code: ErrorCode): number {
  const statusMap: Record<ErrorCode, number> = {
    [ErrorCode.INVALID_REQUEST]: 400,
    [ErrorCode.UNAUTHORIZED]: 401,
    [ErrorCode.FORBIDDEN]: 403,
    [ErrorCode.NOT_FOUND]: 404,
    [ErrorCode.CONFLICT]: 409,
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
    [ErrorCode.INTERNAL_ERROR]: 500,
    [ErrorCode.INVALID_EMAIL]: 400,
    [ErrorCode.INVALID_PASSWORD]: 400,
    [ErrorCode.USER_EXISTS]: 409,
    [ErrorCode.USER_NOT_FOUND]: 404,
    [ErrorCode.INVALID_CREDENTIALS]: 401,
    [ErrorCode.SESSION_EXPIRED]: 401,
    [ErrorCode.API_KEY_NOT_FOUND]: 404,
    [ErrorCode.API_KEY_REVOKED]: 403,
    [ErrorCode.API_KEY_EXPIRED]: 403,
  };
  return statusMap[code] || 500;
}

/**
 * Create a response with the correct status code
 */
export function createResponse<T>(
  data?: T,
  message: string = 'Success',
  statusCode: number = 200,
  success: boolean = true
): Response {
  const responseData = success
    ? createSuccessResponse(data, message, statusCode)
    : createErrorResponse<T>(ErrorCode.INTERNAL_ERROR, message, undefined, statusCode);

  return new Response(JSON.stringify(responseData.response), {
    status: responseData.statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create an error response with a standard Response object
 */
export function createErrorResponseObj(
  code: ErrorCode,
  message: string,
  details?: any
): Response {
  const { response, statusCode } = createErrorResponse(code, message, details);
  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
