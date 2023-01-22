import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertEquals } from 'std/testing/asserts.ts'

Deno.test( {
    name: 'useURLSearchParams',
    async fn ( t ) {
        const schema = zu.useURLSearchParams(
            z.object( {
                manyStrings: z.string().array().min( 2 ),
                manyNumbers: z.number().array().min( 2 ),
                oneStringInArray: z.string().array().length( 1 ),
                oneNumberInArray: z.number().array().length( 1 ),
                stringMin1: z.string().min( 1 ),
                posNumber: z.number().positive(),
                range: z.number().min( 0 ).max( 5 ),
                boolean: z.boolean(),
                true: z.literal( true ),
                false: z.literal( false ),
                null: z.null(),
                enum: z.enum( [ 'foo', 'bar' ] ),
                date: z.date(),
                plainDate: z.string().refine(
                    value => /\d{4}-\d{2}-\d{2}/.test( value ),
                    value => ( { message: `Invalid plain date: ${ value }` } ),
                ),
                tuple: z.tuple( [ z.string(), z.number() ] ),
                numberArray: z.number().array(),
                object: z.object( {
                    foo: z.string(),
                    bar: z.number(),
                } ),
            } )
        )

        await t.step( {
            name: 'happy path',
            fn () {
                const params = new URLSearchParams( {
                    oneStringInArray: 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!',
                    oneNumberInArray: '42',
                    boolean: 'true',
                    true: 'true',
                    false: 'false',
                    stringMin1: 'foo',
                    posNumber: '42.42',
                    range: '4',
                    null: 'null',
                    enum: 'foo',
                    date: '2023-01-01',
                    plainDate: '2023-01-01',
                    tuple: '["foo",42]',
                    numberArray: '["1",2,"3"]',
                    object: '{"foo":"foo","bar":42}',
                } )

                params.append( 'manyStrings', 'hello' )
                params.append( 'manyStrings', 'world' )
                params.append( 'manyNumbers', '123' )
                params.append( 'manyNumbers', '456' )

                assertEquals(
                    zu.dataOr( e => e.flatten().fieldErrors )( schema.safeParse( params ) ),
                    {
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
                        enum: 'foo',
                        date: new Date( '2023-01-01' ),
                        plainDate: '2023-01-01',
                        tuple: [ 'foo', 42 ],
                        numberArray: [ 1, 2, 3 ],
                        object: { foo: 'foo', bar: 42 }
                    }
                )
            }
        } )

        await t.step( {
            name: 'sad path',
            fn () {
                const params = new URLSearchParams( {
                    manyStrings: '123',
                    manyNumbers: 'hello',
                    oneStringInArray: 'Leeeeeeeeeroyyyyyyy',
                    oneNumberInArray: 'foo',
                    true: '0',
                    false: 'foo',
                    stringMin1: '',
                    posNumber: '-42',
                    range: '6',
                    null: 'undefined',
                    enum: 'baz',
                    date: '0000-00-00',
                    plainDate: '0000-00-00',
                    tuple: '[42,"foo"]',
                    object: '{"foo":42,"bar":"foo"}',
                } )

                params.append( 'oneStringInArray', 'Jenkiiiiiins!' )

                assertEquals(
                    zu.dataOr( e => e.flatten().fieldErrors )( schema.safeParse( params ) ),
                    {
                        manyStrings: [ 'Array must contain at least 2 element(s)' ],
                        manyNumbers: [
                            'Array must contain at least 2 element(s)',
                            'Expected number, received nan',
                        ],
                        oneStringInArray: [ 'Array must contain exactly 1 element(s)' ],
                        oneNumberInArray: [ 'Expected number, received nan' ],
                        stringMin1: [ 'String must contain at least 1 character(s)' ],
                        posNumber: [ 'Number must be greater than 0' ],
                        range: [ 'Number must be less than or equal to 5' ],
                        true: [ 'Invalid literal value, expected true' ],
                        false: [ 'Invalid literal value, expected false' ],
                        null: [ 'Expected null, received string' ],
                        numberArray: [ 'Expected number, received nan' ],
                        enum: [ `Invalid enum value. Expected 'foo' | 'bar', received 'baz'` ],
                        date: [ 'Invalid date' ],
                        tuple: [ 'Expected number, received nan' ],
                        object: [ 'Expected number, received nan' ]
                    } as any
                )
            }
        } )
    }
} )

Deno.test( {
    name: 'passthrough',
    fn () {
        const schema = zu.useURLSearchParams(
            z.object( {
                string: z.string(),
                number: z.number(),
                boolean: z.boolean(),
            } ).passthrough()
        )

        assertEquals(
            zu.SPR( schema.safeParse(
                new URLSearchParams( {
                    string: 'foo',
                    number: '42',
                    boolean: 'false',
                    extraKey: 'extraValue',
                } )
            ) ).data,
            {
                string: 'foo',
                number: 42,
                boolean: false,
                extraKey: 'extraValue'
            } as any
        )
    }
} )

Deno.test( {
    name: 'strict',
    fn () {
        const schema = zu.useURLSearchParams(
            z.object( {} ).strict()
        )
        assertEquals(
            zu.SPR( schema.safeParse(
                new URLSearchParams( {
                    extraKey: 'extraValue',
                } )
            ) ).error?.flatten().formErrors,
            [ "Unrecognized key(s) in object: 'extraKey'" ]
        )
    }
} )

Deno.test( {
    name: 'README Example: useURLSearchParams',
    async fn ( t ) {
        const schema = zu.useURLSearchParams(
            z.object( {
                string: z.string(),
                number: z.number(),
                boolean: z.boolean(),
                manyStrings: z.string().array().min( 2 ),
                manyNumbers: z.number().array().min( 2 ),
                oneStringInArray: z.string().array().length( 1 ),
                oneNumberInArray: z.number().array().length( 1 ),
            } )
        )

        await t.step( {
            name: 'happy path',
            fn () {
                const params = new URLSearchParams( {
                    string: 'foo',
                    number: '42',
                    boolean: 'false',
                    oneStringInArray: 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!',
                    oneNumberInArray: '42',
                } )

                params.append( 'manyStrings', 'hello' )
                params.append( 'manyStrings', 'world' )
                params.append( 'manyNumbers', '123' )
                params.append( 'manyNumbers', '456' )

                assertEquals(
                    zu.dataOr( e => e.flatten().fieldErrors )( schema.safeParse( params ) ),
                    {
                        string: 'foo',
                        number: 42,
                        boolean: false,
                        manyStrings: [ 'hello', 'world' ],
                        manyNumbers: [ 123, 456 ],
                        oneStringInArray: [ 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!' ],
                        oneNumberInArray: [ 42 ],
                    }
                )
            }
        } )

        await t.step( {
            name: 'sad path',
            fn () {
                const params = new URLSearchParams( {
                    number: 'false',
                    oneStringInArray: 'Leeeeeeeeeroyyyyyyy',
                    oneNumberInArray: '123',
                    manyStrings: 'hello',
                    manyNumbers: '123',
                } )

                params.append( 'oneStringInArray', 'Jenkiiiiiins!' )
                params.append( 'oneNumberInArray', '456' )

                assertEquals(
                    zu.SPR( schema.safeParse( params ) ).error?.flatten().fieldErrors,
                    {
                        number: [ 'Expected number, received nan' ],
                        manyStrings: [ 'Array must contain at least 2 element(s)' ],
                        manyNumbers: [ 'Array must contain at least 2 element(s)' ],
                        oneStringInArray: [ 'Array must contain exactly 1 element(s)' ],
                        oneNumberInArray: [ 'Array must contain exactly 1 element(s)' ],
                    } as any
                )
            }
        } )
    }
} )

// Deno.test( {
//     name: 'README Example: useFormData',
//     async fn ( t ) {
//         const schema = zu.useFormData(
//             z.object( {
//                 string: z.string(),
//                 number: z.number(),
//                 boolean: z.boolean(),
//                 file: z.instanceof( File ),
//                 manyStrings: z.string().array().min( 2 ),
//                 manyNumbers: z.number().array().min( 2 ),
//                 oneStringInArray: z.string().array().length( 1 ),
//                 oneNumberInArray: z.number().array().length( 1 ),
//             } )
//         )

//         await t.step( {
//             name: 'happy path',
//             fn () {
//                 const file = new File( [], 'filename.ext' )
//                 const formData = new FormData()
//                 formData.append( 'string', 'foo' )
//                 formData.append( 'number', '42' )
//                 formData.append( 'boolean', 'false' )
//                 formData.append( 'file', file )
//                 formData.append( 'oneStringInArray', 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!' )
//                 formData.append( 'oneNumberInArray', '42' )
//                 formData.append( 'manyStrings', 'hello' )
//                 formData.append( 'manyStrings', 'world' )
//                 formData.append( 'manyNumbers', '123' )
//                 formData.append( 'manyNumbers', '456' )

//                 assertEquals(
//                     zu.SPR( schema.safeParse( formData ) ).data,
//                     {
//                         string: 'foo',
//                         number: 42,
//                         boolean: false,
//                         file,
//                         manyStrings: [ 'hello', 'world' ],
//                         manyNumbers: [ 123, 456 ],
//                         oneStringInArray: [ 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!' ],
//                         oneNumberInArray: [ 42 ],
//                     }
//                 )
//             }
//         } )

//         await t.step( {
//             name: 'sad path',
//             fn () {
//                 const formData = new FormData()
//                 formData.append( 'string', '42' )
//                 formData.append( 'number', 'false' )
//                 formData.append( 'boolean', 'foo' )
//                 formData.append( 'file', 'filename.ext' )
//                 formData.append( 'oneStringInArray', 'Leeeeeeeeeroyyyyyyy' )
//                 formData.append( 'oneStringInArray', 'Jenkiiiiiins!' )
//                 formData.append( 'oneNumberInArray', 'foo' )
//                 formData.append( 'manyStrings', '123' )
//                 formData.append( 'manyNumbers', 'hello' )

//                 assertEquals(
//                     zu.SPR( schema.safeParse( formData ) ).error?.flatten().fieldErrors,
//                     {
//                         string: [ 'Expected string, received number' ],
//                         number: [ 'Expected number, received boolean' ],
//                         boolean: [ 'Expected boolean, received string' ],
//                         file: [ 'Input not instance of File' ],
//                         manyStrings: [ 'Array must contain at least 2 element(s)' ],
//                         manyNumbers: [
//                             'Array must contain at least 2 element(s)',
//                             'Expected number, received nan',
//                         ],
//                         oneStringInArray: [ 'Array must contain exactly 1 element(s)' ],
//                         oneNumberInArray: [ 'Expected number, received nan' ],
//                     } as any
//                 )
//             }
//         } )
//     }
// } )