const ExpressJS = require('express');
const Configuration = require('./configuration/config.json');
const Execute = require('child_process').exec;

const App = ExpressJS();

/*Thanks to Tweenky from BrawlMatic for this backend Code.*/

App.use((Request, Response, Next) => {
    Response.set('Cache-Control', `max-age=${Configuration.CacheTime}`);
    Next();
});

App.use(ExpressJS.static('assets'));

App.get('*', (Request, Response) => {
    Response.status(404).end();
});

App.post('*', (Request, Response) => {
    Response.status(404).end();
});

setInterval(() => {
        Execute(`git pull`, (error, stdout) => {
            let response = (error || stdout);
            if (!error) {
                if (response.includes("Already up to date.")) {
                    //console.log('Bot already up to date. No changes since last pull.');
                } else {
                    setTimeout(() => {
                        process.exit();
                    }, 1000);
                };
            };
        });
}, 30 * 1000);


App.listen(Configuration.Port, () => {
    console.log(`Brawl Stars CDN is online and operating. Online at port ${Configuration.Port}.`);
});
