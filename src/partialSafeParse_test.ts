import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertEquals, assertObjectMatch } from 'std/testing/asserts.ts'

Deno.test( 'partialSafeParse', async t => {
    const userSchema = z.object( { name: z.string(), age: z.number() } )

    await t.step( `successType: 'full'`, () => {
        const result = zu.partialSafeParse( userSchema, { name: 'foo', age: 42 } )
        assertObjectMatch(
            result,
            {
                successType: 'full',
                data: { name: 'foo', age: 42 },
                validData: { name: 'foo', age: 42 },
                invalidData: {},
            }
        )

        assertEquals(
            result.error,
            undefined
        )
    } )

    await t.step( `successType: 'partial': { name: null, age: 42 }`, () => {
        const result = zu.partialSafeParse( userSchema, { name: null, age: 42 } )
        assertObjectMatch(
            result,
            {
                successType: 'partial',
                validData: { age: 42 },
                invalidData: { name: null },
            }
        )
        assertEquals(
            result.error?.flatten().fieldErrors ?? {},
            {
                name: [ 'Expected string, received null' ],
            }
        )
    } )

    await t.step( `successType: 'partial': { name: null }`, () => {
        const result = zu.partialSafeParse( userSchema, { name: null } )
        assertObjectMatch(
            result,
            {
                successType: 'partial',
                validData: {},
                invalidData: { name: null },
            }
        )
        assertEquals(
            result.error?.flatten().fieldErrors ?? {},
            {
                name: [ 'Expected string, received null' ],
                age: [ 'Required' ],
            }
        )
    } )

    await t.step( `successType: 'partial': {}`, () => {
        const result = zu.partialSafeParse( userSchema, {} )
        assertObjectMatch(
            result,
            {
                successType: 'partial',
                validData: {},
                invalidData: {},
            }
        )
        assertEquals(
            result.error?.flatten().fieldErrors ?? {},
            {
                name: [ 'Required' ],
                age: [ 'Required' ],
            }
        )
    } )

    await t.step( `successType: 'none'`, () => {
        const result = zu.partialSafeParse( userSchema, null )
        assertObjectMatch(
            result,
            {
                successType: 'none',
                validData: {},
                invalidData: {},
            }
        )
        assertEquals(
            result.error?.flatten().formErrors ?? [],
            [ 'Expected object, received null' ]
        )
    } )

    await t.step( `Readme Example`, () => {
        const userSchema = z.object( { name: z.string(), age: z.number() } )
        const result = zu.partialSafeParse( userSchema, { name: null, age: 42 } )
        assertObjectMatch(
            result,
            {
                successType: 'partial',
                validData: { age: 42 },
                invalidData: { name: null },
            }
        )
        assertEquals(
            result.error?.flatten().fieldErrors ?? {},
            {
                name: [ 'Expected string, received null' ],
            }
        )
    } )

} )