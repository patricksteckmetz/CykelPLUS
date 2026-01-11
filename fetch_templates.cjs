const https = require('https');

const get = (path) => new Promise((resolve, reject) => {
    const options = {
        hostname: 'api.c1st.com',
        path: path,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer 59dad428d300a6920fb5356bebe52f109162c528fb3418b3f693d16ee9cf97f57b72c498d31f135532fbdfdeebf420ad10761059ae7fcd51a1b02fa9de0325f2'
        }
    };
    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch (e) { console.log(data); resolve({}); }
        });
    });
    req.on('error', reject);
    req.end();
});

async function run() {
    console.log("Fetching all templates...");
    const list = await get('/api/ticket-templates');
    if (list.content) {
        // Look for any fields looking like price in the list itself first
        const priceItem = list.content.find(i => Object.keys(i).some(k => k.toLowerCase().includes('price')));
        if (priceItem) console.log("Found price in list!", priceItem);
        else console.log("No price in list view.");

        // Try getting the first 3 items individually to see if they reveal more info?
        // Actually, let's look for "ticket-template-relations" separately or similar?
        // The user mentioned "TicketTemplateRelation" in the openapi file name queries but valid endpoint wasn't found.
        // Let's try to deduce where prices are stored. Usually in "products" related to the template?

        // Let's try to see if there is a 'productid' on the template?
        console.log("Sample template:", list.content[0]);
    }
}

run();
