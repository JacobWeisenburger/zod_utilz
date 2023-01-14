import { z } from 'zod'

export type ErrorCode = z.ZodIssueCode | 'required'

export type ErrorMapMessageBuilderContext = z.ErrorMapCtx & {
    issue: z.ZodIssueOptionalMessage,
    options?: any[] | readonly any[],
}

export type ErrorMapMessage = string

export type ErrorMapMessageBuilder =
    ( dataOrContext: ErrorMapMessageBuilderContext ) => ErrorMapMessage

export type ErrorMapConfig = Partial<Record<ErrorCode, ErrorMapMessage | ErrorMapMessageBuilder>>

// https://gist.github.com/JacobWeisenburger/36cc8fae5c40fca692cb59a60f3afa33

export function makeErrorMap<Config extends ErrorMapConfig> ( config: Config ): {
    config: Config,
    errorMap: z.ZodErrorMap,
} {
    return {
        config,
        errorMap: ( issue, ctx ) => {
            const errorCode: ErrorCode =
                issue.code === 'invalid_type' && ctx.data === undefined
                    ? 'required' : issue.code

            const messageOrBuilder = config[ errorCode ]
            const message = typeof messageOrBuilder === 'function'
                ? messageOrBuilder(
                    getErrorMapMessageBuilderContext( issue, ctx )
                ) : messageOrBuilder

            return message ? { message } : { message: ctx.defaultError }
        }
    }
}

function getErrorMapMessageBuilderContext (
    issue: z.ZodIssueOptionalMessage,
    ctx: z.ErrorMapCtx,
) {
    const options = issue.code === 'invalid_enum_value'
        || issue.code === 'invalid_union_discriminator'
        ? issue.options : undefined

    return { ...ctx, issue, options }
}