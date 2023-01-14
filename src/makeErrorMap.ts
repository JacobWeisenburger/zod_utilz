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

/**
Simplifies the process of making a `ZodErrorMap`

### Usage:
```
import { zu } from 'zod_utilz'

const { errorMap } = zu.makeErrorMap( {
    required: 'Custom required message',
    invalid_type: ( { data } ) => `${ data } is an invalid type`,
    invalid_enum_value: ( { data, options } ) =>
        `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
} )

const stringSchema = z.string( { errorMap } )
zu.SPR( stringSchema.safeParse( undefined ) ).error?.issues[ 0 ].message
// Custom required message
zu.SPR( stringSchema.safeParse( 42 ) ).error?.issues[ 0 ].message
// 42 is an invalid type

const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )
zu.SPR( enumSchema.safeParse( 'baz' ) ).error?.issues[ 0 ].message
// baz is not a valid enum value. Valid options: foo | bar
 ```
*/
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