const ExpressJS = require('express');
const Configuration = require('./configuration/config.json');

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

App.listen(Configuration.Port, () => {
    console.log(`Brawl Stars CDN is online and operating. Online at port ${Configuration.Port}.`);
});