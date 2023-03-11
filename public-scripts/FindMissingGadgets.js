const Axios = require('axios');
const Fs = require('fs');
const Config = require('../configuration/config.json');
const https = require('https');

const AsktoDownload = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

Axios({
    url: "https://bsproxy.royaleapi.dev/v1/brawlers",
    headers: {
        "Authorization": "Bearer " + Config.Token
    }
}).then(async (Response) => {
    if(Response.status != 200) return;

    const GadgetIcons = await Fs.readdirSync('./assets/Gadgets').map(File => `${File.replace('.png', '')}`);
    const GadgetCirlceIcons = await Fs.readdirSync('./assets/Gadgets-Circles').map(File => `${File.replace('.png', '')}`);

    let GadgetsFromGame = [];
    await Response.data.items.map(Brawler => Brawler.gadgets).forEach(m => m.forEach(e => GadgetsFromGame.push(e.id)));

    const NonDuplicates1 = await GadgetsFromGame.filter(x => !GadgetIcons.includes(`${x}`));
    const NonDuplicates2 = await GadgetsFromGame.filter(x => !GadgetCirlceIcons.includes(`${x}`));

    console.log('Normal Gadgets:');
    console.log(NonDuplicates1);
    console.log('Circle Gadgets:');
    console.log(NonDuplicates2);

    if(NonDuplicates1.length != 0){
        AsktoDownload.question('Would you like to try and download the Gadgets? Please respond with Yes or No: ', (YesOrNo) => {
            if(YesOrNo.toLocaleLowerCase() == 'yes'){

                Promise.all(NonDuplicates1.map(async(Gadgets) => {
                    https.get(`https://cdn.brawlstats.com/gadgets/${Gadgets}.png`, function (Response) {
                        if(Response.statusCode != 200) return;

                        const FileLocation = Fs.createWriteStream(`./assets/Gadgets/${Gadgets}.png`);
                        Response.pipe(FileLocation);

                        // After download finish.
                        FileLocation.on("finish", () => {
                            FileLocation.close();
                            console.log(`Download File Complete: ${Gadgets}.png`);
                        });
                    });
                })).then(Response => {
                    AsktoDownload.close();
                });
            } else if (YesOrNo.toLowerCase() == 'no'){
                console.log('File download is skipped.');

                AsktoDownload.close();
            };
          });
    }  else {
        console.log('No files to download!');
    };
});