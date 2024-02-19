import { expect, test } from 'bun:test'
import { z } from 'zod'
import { zu } from '.'

test( 'README Example', () => {
    const schema = z.object( { foo: z.string() } )
    const result = zu.SPR( schema.safeParse( { foo: 42 } ) )
    const fooDataOrErrors = result.data?.foo ?? result.error?.format().foo?._errors

    expect( { fooDataOrErrors } )
        .toMatchObject( { fooDataOrErrors: [ 'Expected string, received number' ] } )
} )