process.env.PLAYWRIGHT_BROWSERS_PATH = 0;

const app = require('express')();
const { firefox } = require('playwright');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const cors = require("cors");

const dirTree = require("directory-tree");
const tree = dirTree("./node-modules");

let error;

class Player
{
    constructor(fc, status, name)
    {
        this.fc = fc;
        this.status = status;
        this.name = name;
    }
}

app.use(cors());
app.listen(8080, () => console.log("MKDS online fetcher active: http://localhost:8080"));

let initialized = false;
let page;
let fetching = false;

(async()=>{
//try {
    const browser =  await firefox.launch(/*{executablePath: './node_modules/playwright-core/.local-browsers/firefox-1429/firefox/firefox'}*/);
    page = await browser.newPage();
    console.log("Browser and page initialized")
    initialized = true;
/*} catch(e) { error = e;
let treee = dirTree("./");
console.log(treee);
}*/
})();

app.get('/api', async (req, res) => 
{
    if(initialized && !fetching)
    {
        fetching = true;
        console.log("Fetching players from the Wiimmfi website...");

        try
        {
            await page.goto('https://wiimmfi.de/stats/game/mariokartds');
            await page.waitForLoadState("networkidle");
            const title = await page.title();
        
            if(title == "Just a moment...")
            {
                console.log("Skipping Cloudflare protection...")
                await page.waitForTimeout(3500);
            }
            else
            {
                console.log("Already logged in...")
            }
        
            const dom = new JSDOM(await page.content());
            const rows = dom.window.document.querySelectorAll("#online .tr0, #online .tr1");
        
            let players = [];
            for(let i = 0; i < rows.length; i++)
            {
                let column = rows[i].children;
                let fc = column[2].innerHTML;
                let status = "";
        
                switch(column[6].innerHTML)
                {
                    case 'o':       // In lobby or connecting
                        status = parseInt(column[7].innerHTML);
                        break;
                    case 'oGvS':    // Searching worldwide / regional / rivals
                        status = 2;
                        break;
                    case 'oGv':
                        status = 3; // Playing worldwide / regional / rivals
                        break;
                    case 'oPgC':    // Searching in friends
                        status = 4;
                        break;
                    case 'oPg':     // Playing in friends
                        status = 5;
                        break;
                }
        
                const name = column[10].innerHTML;
                // todo: codePointAt for special DS characters
        
                players.push(new Player(fc, status, name));
            }
        
            players = players.sort((a, b) => a.name.localeCompare(b.name));
            players = players.sort((a, b) => a.status - b.status);
        
            console.log("Players fetched!")
        
            //await page.screenshot({path: 'testresult.png'});
            players.forEach(p => console.log(p));
            
            playersJSON = JSON.stringify(players);
        
            res.status(200).send(playersJSON);    
        }
        catch(e)
        {
            res.status(500).send(e);
        }

        fetching = false;
    }
    else
    {
console.log(tree);
        res.status(503).send("Server busy");
    }
});