import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertObjectMatch } from 'std/testing/asserts.ts'
import { partialSafeParse } from './partialSafeParse.ts'

Deno.test( 'partialSafeParse', () => {
    const userSchema = z.object( { name: z.string(), age: z.number() } )

    // assertObjectMatch(
    //     partialSafeParse( userSchema, { name: 'foo', age: 42 } ),
    //     { success: true, data: { name: 'foo', age: 42 } }
    // )

    // assertObjectMatch(
    //     partialSafeParse( userSchema, { name: null, age: 42 } ),
    //     {
    //         success: 'partial',
    //         validData: { age: 42 },
    //         invalidData: { name: null },
    //         fieldErrors: { name: [ 'Expected string, received null' ] }
    //     }
    // )

    // assertObjectMatch(
    //     partialSafeParse( userSchema, { name: null } ),
    //     {
    //         success: 'partial',
    //         validData: {},
    //         invalidData: { name: null },
    //         fieldErrors: {
    //             name: [ 'Expected string, received null' ],
    //             age: [ 'Required' ]
    //         }
    //     }
    // )

    // assertObjectMatch(
    //     partialSafeParse( userSchema, {} ),
    //     {
    //         success: 'partial',
    //         validData: {},
    //         invalidData: {},
    //         fieldErrors: { name: [ 'Required' ], age: [ 'Required' ] }
    //     }
    // )

    console.log( partialSafeParse( userSchema, null ). )
    // console.log( partialSafeParse( userSchema, null ).error?.format()._errors )

    // assertObjectMatch(
    //     zu.SPR( partialSafeParse( userSchema, null ) ).error?.format(),
    //     userSchema.safeParse( null )
    // )
} )