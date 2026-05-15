const https = require('https');

const API_KEY = process.env.BIKEDESK_API_KEY;
if (!API_KEY) {
    console.error("Error: BIKEDESK_API_KEY environment variable is missing.");
    process.exit(1);
}

const HOST = 'api.c1st.com';

const get = (path) => new Promise((resolve, reject) => {
    const options = {
        hostname: HOST,
        path: '/api' + path,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + API_KEY,
            'Content-Type': 'application/json'
        }
    };
    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch (e) { resolve({}); }
        });
    });
    req.on('error', reject);
    req.end();
});

async function run() {
    console.log("Fetching /tickettags...");
    const t1 = await get('/tickettags');

    let basisId, proId;

    if (t1.content) {
        console.log(`Found ${t1.content.length} tags.`);
        const relevant = t1.content.filter(t => t.title && t.title.toLowerCase().includes('cykelplus'));
        console.log("Existing CykelPLUS Tags:", JSON.stringify(relevant, null, 2));

        const basisTag = relevant.find(t => t.title === 'CykelPLUS - Basis');
        const proTag = relevant.find(t => t.title === 'CykelPLUS - Pro');

        if (basisTag) basisId = basisTag.id;
        if (proTag) proId = proTag.id;
    }

    // Function to create tag
    const createTag = (title, color) => {
        return new Promise((resolve, reject) => {
            // Use 'label' as per bikedesk.ts. No 'type'.
            const data = JSON.stringify({ content: { label: title, color: color } });

            const options = {
                hostname: HOST,
                path: '/api/tickettags',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + API_KEY,
                    'Content-Type': 'application/json'
                }
            };
            const req = https.request(options, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => resolve(JSON.parse(d)));
            });
            req.write(data);
            req.end();
        });
    };

    if (!basisId) {
        console.log("Creating 'CykelPLUS - Basis'...");
        const res = await createTag('CykelPLUS - Basis', '#3498db');
        console.log("Create Basis Res:", JSON.stringify(res, null, 2));
        if (res.content) basisId = res.content.id;
    }

    if (!proId) {
        console.log("Creating 'CykelPLUS - Pro'...");
        const res = await createTag('CykelPLUS - Pro', '#f1c40f'); // Pro usually Gold/Yellow
        console.log("Create Pro Res:", JSON.stringify(res, null, 2));
        if (res.content) proId = res.content.id;
    }

    console.log(`Final IDs -> Basis: ${basisId}, Pro: ${proId}`);
}

run();
