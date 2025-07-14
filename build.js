const esbuild = require('esbuild');
const path = require('path');

async function build() {
    console.log('Building renderer process code...');
    
    try {
        await esbuild.build({
            entryPoints: ['src/ui/timer/timer.js'],
            bundle: true,
            outfile: 'src/ui/timer/timer-bundle.js',
            platform: 'browser',
            target: 'chrome120',
            sourcemap: true,
            loader: {
                '.js': 'js',
                '.css': 'css'
            },
            external: ['electron']
        });
        
        console.log('✅ Renderer build successful!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();