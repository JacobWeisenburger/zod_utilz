import { expect, test } from 'bun:test'
import { z } from 'zod'
import { zu } from '.'

const schema = z.object( {
    manyStrings: zu.coerce( z.string().array().min( 1 ) ),
    manyNumbers: zu.coerce( z.number().array().min( 1 ) ),
    oneStringInArray: zu.coerce( z.string().array().length( 1 ) ),
    oneNumberInArray: zu.coerce( z.number().array().length( 1 ) ),
    stringMin1: z.string().min( 1 ),
    posNumber: z.number().positive(),
    range: z.number().min( 0 ).max( 5 ),
    boolean: z.boolean(),
    true: z.literal( true ),
    false: z.literal( false ),
    null: z.null(),
    date: z.coerce.date(),
    plainDate: z.string().refine(
        value => /\d{4}-\d{2}-\d{2}/.test( value ),
        value => ( { message: `Invalid plain date: ${ value }` } ),
    ),
    tuple: z.tuple( [ z.string(), z.number() ] ),
    object: z.object( {
        foo: z.string(),
        bar: z.number(),
    } ),
} )

const searchParamsSchema = zu.useURLSearchParams( schema )

test( 'useURLSearchParams happy path', () => {

    const searchParams = new URLSearchParams( {
        oneStringInArray: 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!',
        oneNumberInArray: '42',
        boolean: 'true',
        true: 'true',
        false: 'false',
        stringMin1: 'foo',
        posNumber: '42.42',
        range: '4',
        null: 'null',
        date: '2023-01-01',
        plainDate: '2023-01-01',
        tuple: '["foo",42]',
        object: '{"foo":"foo","bar":42}',
    } )

    searchParams.append( 'manyStrings', 'hello' )
    searchParams.append( 'manyStrings', 'world' )
    searchParams.append( 'manyNumbers', '123' )
    searchParams.append( 'manyNumbers', '456' )

    const result = zu.SPR( searchParamsSchema.safeParse( searchParams ) )

    expect( result.data ).toMatchObject( {
        manyStrings: [ 'hello', 'world' ],
        manyNumbers: [ 123, 456 ],
        oneStringInArray: [ 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!' ],
        oneNumberInArray: [ 42 ],
        stringMin1: 'foo',
        posNumber: 42.42,
        range: 4,
        boolean: true,
        true: true,
        false: false,
        null: null,
        date: new Date( '2023-01-01' ),
        plainDate: '2023-01-01',
        tuple: [ 'foo', 42 ],
        object: { foo: 'foo', bar: 42 }
    } )
} )

test( 'useURLSearchParams sad path', () => {

    const searchParams = new URLSearchParams( {
        manyStrings: 'hello',
        manyNumbers: '123',
        oneStringInArray: 'Leeeeeeeeeroyyyyyyy',
        oneNumberInArray: 'foo',
        boolean: 'foo',
        true: 'foo',
        false: 'foo',
        stringMin1: '',
        posNumber: '-42',
        range: '6',
        null: 'undefined',
        date: '0000-00-00',
        plainDate: '0000-00-00',
        tuple: '[42,"foo"]',
        object: '{"foo":42,"bar":"foo"}',
    } )

    searchParams.append( 'oneStringInArray', 'Jenkiiiiiins!' )

    const result = zu.SPR( searchParamsSchema.safeParse( searchParams ) )

    expect( result.error?.flatten() ).toMatchObject(
        {
            formErrors: [],
            fieldErrors: {
                oneStringInArray: [ 'Array must contain exactly 1 element(s)' ],
                oneNumberInArray: [ 'Expected number, received nan' ],
                stringMin1: [ 'String must contain at least 1 character(s)' ],
                posNumber: [ 'Number must be greater than 0' ],
                range: [ 'Number must be less than or equal to 5' ],
                boolean: [ 'Expected boolean, received string' ],
                true: [ 'Invalid literal value, expected true' ],
                false: [ 'Invalid literal value, expected false' ],
                null: [ 'Expected null, received string' ],
                date: [ 'Invalid date' ],
                tuple: [ 'Expected string, received number', 'Expected number, received string' ],
                object: [ 'Expected string, received number', 'Expected number, received string' ]
            }
        } as any
    )
} )

test( 'passthrough', () => {
    const objSchema = z.object( {
        string: z.string(),
        number: z.number(),
        boolean: z.boolean(),
    } ).passthrough()

    const schema = zu.useURLSearchParams( objSchema )

    expect(
        zu.SPR( schema.safeParse(
            new URLSearchParams( {
                string: 'foo',
                number: '42',
                boolean: 'false',
                extraKey: 'extraValue',
            } )
        ) ).data
    ).toMatchObject(
        {
            string: 'foo',
            number: 42,
            boolean: false,
            extraKey: 'extraValue'
        } as any
    )
} )

test( 'strict', () => {
    const objSchema = z.object( {} ).strict()
    const schema = zu.useURLSearchParams( objSchema )
    expect(
        zu.SPR( schema.safeParse(
            new URLSearchParams( {
                extraKey: 'extraValue',
            } )
        ) ).error?.flatten().formErrors
    ).toMatchObject(
        [ "Unrecognized key(s) in object: 'extraKey'" ]
    )
}
)

test( 'README Example', () => {
    const schema = zu.useURLSearchParams(
        z.object( {
            string: z.string(),
            number: z.number(),
            boolean: z.boolean(),
        } )
    )

    expect(
        zu.SPR( schema.safeParse(
            new URLSearchParams( {
                string: 'foo',
                number: '42',
                boolean: 'false',
            } )
        ) ).data
    ).toMatchObject(
        { string: 'foo', number: 42, boolean: false }
    )

    expect(
        zu.SPR( schema.safeParse(
            new URLSearchParams( {
                string: '42',
                number: 'false',
                boolean: 'foo',
            } )
        ) ).error?.flatten().fieldErrors
    ).toMatchObject(
        {
            string: [ 'Expected string, received number' ],
            number: [ 'Expected number, received boolean' ],
            boolean: [ 'Expected boolean, received string' ],
        } as any
    )
} )

test( 'README Example', () => {
    const schema = zu.useFormData(
        z.object( {
            string: z.string(),
            number: z.number(),
            boolean: z.boolean(),
            file: z.instanceof( File ),
        } )
    )

    {
        const file = new File( [], 'filename.ext' )
        const formData = new FormData()
        formData.append( 'string', 'foo' )
        formData.append( 'number', '42' )
        formData.append( 'boolean', 'false' )
        formData.append( 'file', file )

        expect(
            zu.SPR( schema.safeParse( formData ) ).data
        ).toMatchObject(
            { string: 'foo', number: 42, boolean: false, file }
        )
    }

    {
        const formData = new FormData()
        formData.append( 'string', '42' )
        formData.append( 'number', 'false' )
        formData.append( 'boolean', 'foo' )
        formData.append( 'file', 'filename.ext' )

        expect(
            zu.SPR( schema.safeParse( formData ) ).error?.flatten().fieldErrors
        ).toMatchObject(
            {
                string: [ 'Expected string, received number' ],
                number: [ 'Expected number, received boolean' ],
                boolean: [ 'Expected boolean, received string' ],
                file: [ 'Input not instance of File' ],
            } as any
        )
    }
} )