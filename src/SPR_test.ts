import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertObjectMatch } from 'std/testing/asserts.ts'

Deno.test( 'README Example', () => {
    const schema = z.object( { foo: z.string() } )
    const result = zu.SPR( schema.safeParse( { foo: 42 } ) )
    const fooDataOrErrors = result.data?.foo ?? result.error?.format().foo?._errors

    assertObjectMatch(
        { fooDataOrErrors },
        { fooDataOrErrors: [ 'Expected string, received number' ] }
    )
} )