// https://github.com/denoland/dnt/
import { build, emptyDir } from 'dnt'

await emptyDir( './npm' )

await build( {
    entryPoints: [ './src/mod.ts' ],
    outDir: './npm',
    shims: { deno: true },
    package: {
        name: 'zod-utils',
        version: '0.0.1',
        author: 'JacobWeisenburger',
        description: 'Framework agnostic utilities for Zod',
        license: 'MIT',
        // npm: 'https://www.npmjs.com/package/zod-utilz',
        repository: 'https://github.com/JacobWeisenburger/zod-utilz',
        homepage: 'https://github.com/JacobWeisenburger/zod-utilz',
    },
} )

try {
    await Deno.copyFile( 'LICENSE', 'npm/LICENSE' )
} catch ( error ) {
    console.error( error )
}

try {
    await Deno.copyFile( 'README.md', 'npm/README.md' )
} catch ( error ) {
    console.error( error )
}