import { z } from 'zod'

export function safeParseResult ( result: z.SafeParseReturnType<unknown, unknown> ) {
    return result.success
        ? { ...result, error: undefined }
        : { ...result, data: undefined }
}