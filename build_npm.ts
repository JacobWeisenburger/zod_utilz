// https://github.com/denoland/dnt/
import { build, emptyDir } from 'dnt'

await emptyDir( './npm' )

await build( {
    entryPoints: [ './mod.ts' ],
    importMap: './import_map.json',
    outDir: './npm',
    shims: { deno: true },
    mappings: {
        'https://deno.land/x/zod@v3.20.2/mod.ts': {
            name: 'zod',
            version: '^3.20.2',
            peerDependency: true,
        }
    },
    package: {
        name: 'zod_utilz',
        version: '0.3.1',
        author: 'JacobWeisenburger',
        description: 'Framework agnostic utilities for Zod',
        license: 'MIT',
        npm: 'https://www.npmjs.com/package/zod_utilz',
        deno: 'https://deno.land/x/zod_utilz',
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