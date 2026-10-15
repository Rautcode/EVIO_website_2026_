const fs = require('fs');
const https = require('https');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'assets', 'images');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const imagesToDownload = {
    // ServiceDetail
    'service-1.jpg': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2000&auto=format&fit=crop',
    'service-2.jpg': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop',
    'service-3.jpg': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=2000&auto=format&fit=crop',
    'service-4.jpg': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
    'service-5.jpg': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop',
    'service-6.jpg': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop',
    
    // Projects
    'project-1.jpg': 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?q=80&w=2000&auto=format&fit=crop',
    'project-2.jpg': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop',
    'project-3.jpg': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=2000&auto=format&fit=crop',
    'project-4.jpg': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
    'project-5.jpg': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2000&auto=format&fit=crop',
    'project-6.jpg': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop',
    'project-7.jpg': 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=2000&auto=format&fit=crop',
    'project-8.jpg': 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2000&auto=format&fit=crop',
    'project-9.jpg': 'https://images.unsplash.com/photo-1580983546591-23ca7bce5e82?q=80&w=2000&auto=format&fit=crop',
    
    // Life at Evio / Culture
    'culture-1.jpg': 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop',
    'culture-2.jpg': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop',
    'culture-3.jpg': 'https://images.unsplash.com/photo-1540747913346-19e32fc3e6ed?q=80&w=800&auto=format&fit=crop',
    'culture-4.jpg': 'https://images.unsplash.com/photo-1582236528751-bb0cf55589e5?q=80&w=600&auto=format&fit=crop',
    'culture-5.jpg': 'https://images.unsplash.com/photo-1543364132-72049d58bb61?q=80&w=600&auto=format&fit=crop',
    'culture-6.jpg': 'https://images.unsplash.com/photo-1601002340277-c93d8b5ebef0?q=80&w=600&auto=format&fit=crop',
    'culture-7.jpg': 'https://images.unsplash.com/photo-1602161730006-25ccdf5cbf23?q=80&w=600&auto=format&fit=crop',
    'culture-8.jpg': 'https://images.unsplash.com/photo-1634591784992-fd1fb5a5601c?q=80&w=600&auto=format&fit=crop',
    
    // Heroes
    'life-hero.jpg': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop',
    'csr-hero.jpg': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop',
    'contact-hero.jpg': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop',
    
    // About Us
    'about-history-1.jpg': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000',
    'about-history-2.jpg': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=2000',
    'about-history-3.jpg': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000',
    
    // Home / Feature
    'home-about-teaser.jpg': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000',
    'home-project-1.jpg': 'https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?auto=format&fit=crop&q=80&w=2070',
    'home-project-2.jpg': 'https://images.unsplash.com/photo-1573309463567-5bd1cc4eb581?auto=format&fit=crop&q=80&w=2070',
    'home-project-3.jpg': 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=2070',
    'home-hero-poster.jpg': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
};

const downloadImage = (filename, url) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(targetDir, filename);
        if (fs.existsSync(filePath)) {
            console.log(`Skipping ${filename} (already exists)`);
            return resolve();
        }
        
        https.get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                // handle redirect
                return downloadImage(filename, res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
            }
            const fileStream = fs.createWriteStream(filePath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', reject);
    });
};

const run = async () => {
    console.log("Downloading placeholder images...");
    const entries = Object.entries(imagesToDownload);
    for (const [filename, url] of entries) {
        try {
            await downloadImage(filename, url);
        } catch (e) {
            console.error(e.message);
        }
    }
    console.log("Done!");
};

run();
