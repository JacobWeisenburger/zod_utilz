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
    | z.ZodAny
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
 * @example
 * import { zu } from 'zod_utilz'
 * const bigintSchema = zu.coerce( z.bigint() )
 * bigintSchema.parse( '42' ) // 42n
 * bigintSchema.parse( '42n' ) // 42n
 * zu.SPR( bigintSchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message
 * // 'Expected bigint, received string'
 * 
 * @example
 * import { zu } from 'zod_utilz'
 * const booleanSchema = zu.coerce( z.boolean() )
 * 
 * // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
 * // only exception to normal boolean coercion rules
 * booleanSchema.parse( 'false' ) // false
 * 
 * // https://developer.mozilla.org/en-US/docs/Glossary/Falsy
 * // falsy => false
 * booleanSchema.parse( false ) // false
 * booleanSchema.parse( 0 ) // false
 * booleanSchema.parse( -0 ) // false
 * booleanSchema.parse( 0n ) // false
 * booleanSchema.parse( '' ) // false
 * booleanSchema.parse( null ) // false
 * booleanSchema.parse( undefined ) // false
 * booleanSchema.parse( NaN ) // false
 * 
 * // truthy => true
 * booleanSchema.parse( 'foo' ) // true
 * booleanSchema.parse( 42 ) // true
 * booleanSchema.parse( [] ) // true
 * booleanSchema.parse( {} ) // true
 * 
 * @example
 * import { zu } from 'zod_utilz'
 * const numberArraySchema = zu.coerce( z.number().array() )
 * 
 * // if the value is not an array, it is coerced to an array with one coerced item
 * numberArraySchema.parse( 42 ) // [ 42 ]
 * numberArraySchema.parse( '42' ) // [ 42 ]
 * 
 * // if the value is an array, it coerces each item in the array
 * numberArraySchema.parse( [] ) // []
 * numberArraySchema.parse( [ '42', 42 ] ) // [ 42, 42 ]
 * 
 * zu.SPR( numberArraySchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message
 * // 'Expected number, received nan'
 */
export function coerce<Schema extends AllowedZodTypes> ( schema: Schema ) {
    return z.any()
        .transform<z.infer<Schema>>( getTransformer( schema ) )
        .pipe( schema ) as z.ZodPipeline<z.ZodEffects<z.ZodAny, z.infer<Schema>, any>, Schema>
}

function getTransformer<Schema extends AllowedZodTypes> ( schema: Schema ) {
    if ( schema instanceof z.ZodAny ) return ( value: any ) => value
    if ( schema instanceof z.ZodString ) return toString
    if ( schema instanceof z.ZodNumber ) return toNumber
    if ( schema instanceof z.ZodBoolean ) return toBoolean
    if ( schema instanceof z.ZodBigInt ) return toBigInt
    if ( schema instanceof z.ZodArray ) return toArray( schema )

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

function toArray<Schema extends z.ZodArray<z.ZodTypeAny>> ( schema: Schema ) {
    const itemTransformer = getTransformer( schema._def.type )
    return ( value: z.input<Schema> ): z.output<Schema>[] => {
        if ( Array.isArray( value ) ) return value.map( itemTransformer )
        return [ value ].map( itemTransformer )
    }
}