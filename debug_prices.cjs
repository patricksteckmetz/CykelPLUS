const https = require('https');

const API_KEY = '59dad428d300a6920fb5356bebe52f109162c528fb3418b3f693d16ee9cf97f57b72c498d31f135532fbdfdeebf420ad10761059ae7fcd51a1b02fa9de0325f2';
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
            } catch (e) { console.log("Junk:", data); resolve({}); }
        });
    });
    req.on('error', reject);
    req.end();
});

async function run() {
    console.log("Fetching templates...");
    const templates = await get('/ticket-templates');
    if (!templates.content) {
        console.log("No templates found or error:", templates);
        return;
    }

    console.log(`Found ${templates.content.length} templates. Scanning ALL for materials...`);

    let foundAny = false;
    for (const t of templates.content) {
        const materials = await get(`/ticket-templates/${t.id}/materials`);
        if (materials.content && materials.content.length > 0) {
            foundAny = true;
            console.log(`\n[MATCH] Template: ${t.label} (ID: ${t.id}) has ${materials.content.length} materials:`);
            materials.content.forEach(m => {
                console.log(`   - Material: ${m.title}, Price: ${m.price}, Derived: ${m.derivedprice}, Amount: ${m.amount}`);
            });
        }
    }

    if (!foundAny) {
        console.log("\nWARNING: No materials found in ANY template via this endpoint.");
    }
}

run();
