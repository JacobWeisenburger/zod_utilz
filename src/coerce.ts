import { z } from 'zod'

/**
Treats coercion errors like normal zod errors. Prevents throwing errors when using `safeParse`.

@example
import { zu } from 'zod_utilz'
const bigintSchema = zu.coerce( z.bigint() )
bigintSchema.parse( '42' ) // 42n
bigintSchema.parse( '42n' ) // 42n
zu.SPR( bigintSchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message
// 'Expected bigint, received string'

@example
import { zu } from 'zod_utilz'
const booleanSchema = zu.coerce( z.boolean() )

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
// only exception to normal boolean coercion rules
booleanSchema.parse( 'false' ) // false

// https://developer.mozilla.org/en-US/docs/Glossary/Falsy
// falsy => false
booleanSchema.parse( false ) // false
booleanSchema.parse( 0 ) // false
booleanSchema.parse( -0 ) // false
booleanSchema.parse( 0n ) // false
booleanSchema.parse( '' ) // false
booleanSchema.parse( null ) // false
booleanSchema.parse( undefined ) // false
booleanSchema.parse( NaN ) // false

// truthy => true
booleanSchema.parse( 'foo' ) // true
booleanSchema.parse( 42 ) // true
booleanSchema.parse( [] ) // true
booleanSchema.parse( {} ) // true

@example
import { zu } from 'zod_utilz'
const numberArraySchema = zu.coerce( z.number().array() )

// if the value is not an array, it is coerced to an array with one coerced item
numberArraySchema.parse( 42 ) // [ 42 ]
numberArraySchema.parse( '42' ) // [ 42 ]

// if the value is an array, it coerces each item in the array
numberArraySchema.parse( [] ) // []
numberArraySchema.parse( [ '42', 42 ] ) // [ 42, 42 ]

zu.SPR( numberArraySchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message
// 'Expected number, received nan'
*/
export function coerce<Schema extends z.ZodTypeAny> ( schema: Schema ) {
    return z.any()
        .transform<z.infer<Schema>>( getTransformer( schema ) )
        .pipe( schema ) as z.ZodPipeline<z.ZodEffects<z.ZodAny, z.infer<Schema>, any>, Schema>
}

export function getTransformer<Schema extends z.ZodTypeAny> ( schema: Schema ) {
    if ( schema instanceof z.ZodNull ) return toNull
    if ( schema instanceof z.ZodLiteral ) return toLiteral( schema._def.value )
    if ( schema instanceof z.ZodString ) return toString
    if ( schema instanceof z.ZodEnum ) return toString
    if ( schema instanceof z.ZodNumber ) return toNumber
    if ( schema instanceof z.ZodBoolean ) return toBoolean
    if ( schema instanceof z.ZodBigInt ) return toBigInt
    if ( schema instanceof z.ZodDate ) return toDate
    if ( schema instanceof z.ZodArray ) return toArray( schema )
    if ( schema instanceof z.ZodTuple ) return toTuple( schema as any )
    if ( schema instanceof z.ZodObject ) return toObject( schema )

    if ( schema instanceof z.ZodOptional )
        return getTransformer( schema._def.innerType )

    return noop
}

const noop = ( x: any ) => x

/* TODO write tests */
function toNull ( value: any ) {
    try {
        if ( typeof value == 'string' )
            return JSON.parse( value )
    } catch { }

    return value
}

/* TODO write tests */
const toLiteral = ( defValue: any ) => ( value: any ) => {
    switch ( typeof defValue ) {
        case 'number': return toNumber( value )
        case 'bigint': return toBigInt( value )
        case 'boolean': return toBoolean( value )
    }

    return value
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
    } catch { }
    try {
        return Boolean( value )
    } catch { }

    return false
}

function toDate ( value: any ): Date {
    if ( value instanceof Date ) return value

    try {
        return new Date( value )
    } catch { }

    return value
}

/* TODO write tests for JSON array */
function toArray<Schema extends z.ZodArray<z.ZodTypeAny>> ( schema: Schema ) {
    const itemTransformer = getTransformer( schema._def.type )
    return ( value: z.input<Schema> ): z.output<Schema>[] => {
        if ( typeof value == 'string' ) {
            try {
                value = JSON.parse( value )
            } catch { }
        }

        if ( Array.isArray( value ) ) return value.map( itemTransformer )
        return [ value ].map( itemTransformer )
    }
}

/* TODO write tests */
function toTuple<Schema extends z.ZodTuple> ( schema: Schema ) {
    const itemTransformers = schema._def.items.map( getTransformer )
    return ( value: z.input<Schema> ): z.output<Schema> => {
        if ( typeof value == 'string' ) {
            try {
                value = JSON.parse( value )
            } catch { }
        }

        if ( Array.isArray( value ) )
            return value.map( ( item, index ) => itemTransformers[ index ]( item ) ) as any
        return [ value ].map( ( item, index ) => itemTransformers[ index ]( item ) ) as any
    }
}

function toObject<
    Schema extends z.ZodObject<z.ZodRawShape, z.UnknownKeysParam>
> ( schema: Schema ) {
    return ( value: z.input<Schema> ): z.output<Schema> => {
        if ( typeof value == 'string' ) {
            try {
                value = JSON.parse( value )
            } catch { }
        }

        if ( typeof value !== 'object' ) return value

        const { unknownKeys } = schema._def
        const keys = unknownKeys == 'strip'
            ? Object.keys( schema.shape )
            : Object.keys( value )
        return Object.fromEntries(
            keys.map( key => {
                const propSchema = schema.shape[ key ] ?? z.any()
                const propTransformer = getTransformer( propSchema )
                return [ key, propTransformer( value[ key ] ) ]
            } )
        )
    }
}

