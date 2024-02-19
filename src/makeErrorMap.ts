import { z } from 'zod'

export const ExtraErrorCode = z.util.arrayToEnum( [
    'required',
] )

type RequiredIssue = z.ZodIssueBase & {
    code: typeof ExtraErrorCode.required
    expected: z.ZodParsedType
    received: 'undefined'
}

type ExtraErrorCode = keyof typeof ExtraErrorCode

export type ErrorCode = ExtraErrorCode | z.ZodIssueCode

type Issue<Code extends ErrorCode> =
    Code extends RequiredIssue[ 'code' ]
    ? RequiredIssue
    : Code extends z.ZodIssueCode
    ? z.ZodIssueOptionalMessage & { code: Code }
    : never

export type ErrorMapMessageBuilderContext<Code extends ErrorCode> =
    z.ErrorMapCtx & Issue<Code>

export type ErrorMapMessage = string

export type ErrorMapMessageBuilder<Code extends ErrorCode> =
    ( context: ErrorMapMessageBuilderContext<Code> ) => ErrorMapMessage

export type ErrorMapConfig = {
    [ Code in ErrorCode ]?: ErrorMapMessage | ErrorMapMessageBuilder<Code>
}
// type ErrorMapConfigRecord = Record<ErrorCode, ErrorMapMessage | ErrorMapMessageBuilder>
// export type ErrorMapConfig = Partial<ErrorMapConfigRecord>

/**
 * Simplifies the process of making a `ZodErrorMap`
 * 
 * ### Usage:
 * ```
 * import { zu } from 'zod_utilz'
 * const errorMap = zu.makeErrorMap( {
 *     required: 'Custom required message',
 *     invalid_type: ( { data } ) => `${ data } is an invalid type`,
 *     too_big: ( { maximum } ) => `Maximum length is ${ maximum }`,
 *     invalid_enum_value: ( { data, options } ) =>
 *         `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
 * } )
 * 
 * const stringSchema = z.string( { errorMap } ).max( 32 )
 * 
 * zu.SPR( stringSchema.safeParse( undefined ) ).error?.issues[ 0 ].message
 * // Custom required message
 * 
 * zu.SPR( stringSchema.safeParse( 42 ) ).error?.issues[ 0 ].message
 * // 42 is an invalid type
 * 
 * zu.SPR( stringSchema.safeParse(
 *     'this string is over the maximum length'
 * ) ).error?.issues[ 0 ].message
 * // Maximum length is 32
 * 
 * const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )
 * 
 * zu.SPR( enumSchema.safeParse( 'baz' ) ).error?.issues[ 0 ].message
 * // baz is not a valid enum value. Valid options: foo | bar
 * ```
 */
export function makeErrorMap ( config: ErrorMapConfig ): z.ZodErrorMap {
    return ( issue, ctx ) => {
        const errorCode: ErrorCode =
            issue.code === 'invalid_type' && ctx.data === undefined
                ? 'required' : issue.code

        const messageOrBuilder = config[ errorCode ]
        const context = { ...ctx, ...issue, code: errorCode }

        const message = typeof messageOrBuilder === 'function'
            /* @ts-ignore */
            // TODO figure out how to deal with:
            // Expression produces a union type that is too complex to represent.
            ? messageOrBuilder( context )
            : messageOrBuilder

        return message ? { message } : { message: ctx.defaultError }
    }
}