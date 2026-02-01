// 统一API响应格式
export class ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
  timestamp: string;

  constructor(code: number, message: string, data: T | null) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'success'): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  static error(message: string, code = 500): ApiResponse<null> {
    return new ApiResponse(code, message, null);
  }

  static badRequest(message: string): ApiResponse<null> {
    return new ApiResponse(400, message, null);
  }

  static unauthorized(message = '未授权'): ApiResponse<null> {
    return new ApiResponse(401, message, null);
  }

  static notFound(message = '资源不存在'): ApiResponse<null> {
    return new ApiResponse(404, message, null);
  }
}
