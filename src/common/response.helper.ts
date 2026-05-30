export function successResponse<T>(message: string, data?: T) {
    return {
        status: 'success',
        message,
        data: data ?? null,
    };
}

export function failedResponse(message: string, data?: any) {
    return {
        status: 'failed',
        message,
        data: data ?? null,
    };
}
