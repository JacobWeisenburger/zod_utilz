// https://github.com/denoland/dnt/
import { build, emptyDir } from 'dnt'

await emptyDir( './npm' )

// https://deno.land/x/zod_utilz/mod.ts
// https://deno.land/x?query=zod_utilz

await build( {
    entryPoints: [ './mod.ts' ],
    importMap: './import_map.json',
    outDir: './npm',
    shims: { deno: true },
    package: {
        name: 'zod_utilz',
        version: '0.1.6',
        author: 'JacobWeisenburger',
        description: 'Framework agnostic utilities for Zod',
        license: 'MIT',
        // npm: 'https://www.npmjs.com/package/zod_utilz',
        repository: 'https://github.com/JacobWeisenburger/zod_utilz',
        homepage: 'https://github.com/JacobWeisenburger/zod_utilz',
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