import { $ } from 'bun'
import { rm, cp } from 'node:fs/promises'
import * as Path from 'node:path'

// https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages
// https://dev.to/astagi/publish-to-npm-using-github-actions-23fn

const logError = ( ctx?: object ) => ( { message }: Error ) => {
    const data = { message, ...ctx }
    console.error( 'Error:', JSON.stringify( data, null, 2 ) )
}

const root = Path.join( import.meta.dir, '..' )
const dist = Path.join( root, 'dist' )
const tempSubDir = root.split( 'software' )[ 1 ]
const publishFromDir = Path.join( '/mnt/c/software/temp', tempSubDir, 'dist' )

await Promise.resolve()
    .then( () => console.log( 'Publishing...' ) )

    .then( async () => {
        await rm( publishFromDir, { recursive: true } )
            .then( () => console.log( 'publishFromDir: deleted' ) )
            .catch( logError( { publishFromDir } ) )
    } )

    .then( async () => {
        const section = 'publishFromDir: moved all files'
        await cp( dist, publishFromDir, { recursive: true } )
            .then( () => console.log( section ) )
            .catch( logError( { section, dist, publishFromDir } ) )
    } )

    .then( async () => {
        const section = 'npm publish'
        await $`cd ${ publishFromDir } && npm publish --access public`
            .then( () => console.log( 'npm publish: ran' ) )
            .catch( logError( { section } ) )
    } )

    .then( async () => {
        await rm( publishFromDir, { recursive: true } )
            .then( () => console.log( 'publishFromDir: deleted' ) )
            .catch( logError( { publishFromDir } ) )
    } )

    .then( () => console.log( 'Publish: done' ) )
    .catch( logError( { path: import.meta.path } ) )