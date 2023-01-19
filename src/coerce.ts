import { z } from 'zod'

// https://developer.mozilla.org/en-US/docs/Glossary/Primitive
// string
// number
// bigint
// boolean
// undefined
// symbol
// null

type AllowedZodTypes =
    | z.ZodString
    | z.ZodNumber
    | z.ZodBoolean
    | z.ZodBigInt
    // | z.ZodDate // TODO
    | z.ZodArray<z.ZodTypeAny>
// | z.ZodObject<z.ZodRawShape> // TODO

/**
 * Treats coercion errors like normal zod errors. Prevents throwing errors when using `safeParse`.
 * 
 * ### Usage:
 * ```
 * import { zu } from 'zod_utilz'
 * const schema = zu.coerce( z.bigint() )
 * zu.SPR( schema.safeParse( '42' ) ).data
 * // 42n
 * zu.SPR( schema.safeParse( 'foo' ) ).error?.issues[ 0 ].message
 * // 'Expected bigint, received string'
 * ```
 */
export function coerce<Schema extends AllowedZodTypes> ( schema: Schema ) {
    return z.any()
        .transform<z.infer<Schema>>( getTransformer( schema ) )
        .pipe( schema ) as z.ZodPipeline<z.ZodEffects<z.ZodAny, z.infer<Schema>, any>, Schema>
}

function getTransformer<Schema extends AllowedZodTypes> ( schema: Schema ) {
    if ( schema instanceof z.ZodString ) return toString
    if ( schema instanceof z.ZodNumber ) return toNumber
    if ( schema instanceof z.ZodBoolean ) return toBoolean
    if ( schema instanceof z.ZodBigInt ) return toBigInt
    if ( schema instanceof z.ZodArray ) return toArray

    throw new Error( `${ schema!.constructor.name } is not supported by zu.coerce` )
}

function toString ( value: any ): string {
    if ( typeof value === 'string' ) return value

    try {
        const newValue = JSON.stringify( value )
        if ( newValue == undefined ) throw 'JSON.stringify returned undefined'
        return newValue
    } catch ( error ) { }
    try {
        return String( value )
    } catch ( error ) { }

    return value
}

function toNumber ( value: any ): number {
    if ( typeof value === 'number' ) return value
    if ( typeof value === 'object' ) return NaN
    if ( value == null ) return NaN

    try {
        return Number( value )
    } catch ( error ) { }

    return NaN
}

function toBigInt ( value: any ): bigint {
    if ( typeof value === 'bigint' ) return value

    if ( typeof value === 'string' && value.endsWith( 'n' ) ) {
        try {
            const parsed = BigInt( value.slice( 0, -1 ) )
            if ( value == `${ parsed.toString() }n` ) return parsed
        } catch { }
    }

    try { return BigInt( toNumber( value ) ) }
    catch ( error ) { }

    return value
}

function toBoolean ( value: any ): boolean {
    if ( typeof value === 'boolean' ) return value

    try {
        return Boolean( JSON.parse( value ) )
    } catch ( error ) { }
    try {
        return Boolean( value )
    } catch ( error ) { }

    return false
}

function toArray<T> ( value: T ): T[] {
    if ( Array.isArray( value ) ) return value
    return [ value ]
}

// function coerceToArray<
//     Schema extends z.ZodArray<z.ZodTypeAny>
// > ( schema: Schema ) {
//     return z.union( [
//         z.any().array(),
//         z.any().transform( x => [ x ] ),
//     ] ).pipe( schema )
// }