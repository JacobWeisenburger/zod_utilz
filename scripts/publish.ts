import { $ } from 'bun'
import * as Path from 'node:path'

// https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages
// https://dev.to/astagi/publish-to-npm-using-github-actions-23fn

const logError = ( ctx?: object ) => ( { message }: Error ) => {
    const data = { message, ...ctx }
    console.error( 'Error:', JSON.stringify( data, null, 2 ) )
}

const root = Path.join( import.meta.dir, '..' )
const dist = Path.join( root, 'dist' )

await Promise.resolve()
    .then( () => console.log( 'Publishing...' ) )

    .then( async () => {
        const section = 'npm publish'
        await $`cd ${ dist } && npm publish --access public`
            .then( () => console.log( 'npm publish: ran' ) )
            .catch( logError( { section } ) )
    } )

    .then( () => console.log( 'Publish: done' ) )
    .catch( logError( { path: import.meta.path } ) )