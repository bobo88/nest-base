import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        errors = responseObj.errors || [];
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 认证相关的错误处理
    if (status === HttpStatus.UNAUTHORIZED) {
      message = '认证失败，请重新登录';
    }

    if (status === HttpStatus.FORBIDDEN) {
      message = '权限不足，无法访问该资源';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errors.length > 0 && { errors }),
    };

    // 生产环境隐藏详细错误信息
    if (process.env.NODE_ENV === 'production' && status >= 500) {
      errorResponse.message = '服务器内部错误';
    }

    response.status(status).json(errorResponse);
  }
}