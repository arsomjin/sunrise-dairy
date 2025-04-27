const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 192, name: 'logo192.png' },
    { size: 512, name: 'logo512.png' }
];

async function generateCircularLogos() {
    const inputPath = path.resolve(__dirname, '../src/assets/logo-new/roongaroon-dairy.jpg');
    const publicDir = path.resolve(__dirname, '../public');

    // Ensure input file exists
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Input file not found: ${inputPath}`);
    }

    for (const { size, name } of sizes) {
        console.log(`Generating ${name} (${size}x${size})`);

        const outputPath = path.join(publicDir, name);

        await sharp(inputPath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .composite([{
                input: Buffer.from(
                    `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="black"/></svg>`
                ),
                blend: 'dest-in'
            }])
            .png()
            .toFile(outputPath);
    }

    // Generate favicon.ico from the 32x32 version
    const favicon32Path = path.join(publicDir, 'favicon-32x32.png');
    await sharp(favicon32Path)
        .toFormat('ico')
        .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('All logos generated successfully!');
}

generateCircularLogos().catch(console.error);