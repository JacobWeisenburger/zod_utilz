import { z } from 'zod'
import { safeParseResult } from "./safeParseResult.ts"

export function getErrorMessage ( result: z.SafeParseReturnType<unknown, unknown> ) {
    return safeParseResult( result ).error?.issues[ 0 ].message
}