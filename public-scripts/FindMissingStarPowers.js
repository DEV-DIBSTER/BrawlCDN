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

    const StarPowerIcons = await Fs.readdirSync('./assets/StarPowers').map(File => `${File.replace('.png', '')}`);
    const StarPowesCirlceIcons = await Fs.readdirSync('./assets/StarPowers-Circles').map(File => `${File.replace('.png', '')}`);

    let StarPowersFromGame = [];
    await Response.data.items.map(Brawler => Brawler.starPowers).forEach(m => m.forEach(e => StarPowersFromGame.push(e.id)));

    const NonDuplicates1 = StarPowersFromGame.filter(x => !StarPowerIcons.includes(`${x}`));
    const NonDuplicates2 = StarPowersFromGame.filter(x => !StarPowesCirlceIcons.includes(`${x}`));

    console.log('Normal Star Powers:');
    console.log(NonDuplicates1);
    console.log('Circle Star Powers:');
    console.log(NonDuplicates2);

    if(NonDuplicates1.length != 0){

        AsktoDownload.question('Would you like to try and download the StarPowers? Please respond with Yes or No: ', (YesOrNo) => {
            if(YesOrNo.toLocaleLowerCase() == 'yes'){

                Promise.all(NonDuplicates1.map(async(StarPowers) => {

                    https.get(`https://cdn.brawlstats.com/star-powers/${StarPowers}.png`, function (Response) {
                        if(Response.statusCode != 200) return console.log('Remote server files not found!');
                        
                        const FileLocation = Fs.createWriteStream(`./assets/StarPowers/${StarPowers}.png`);
                        Response.pipe(FileLocation);

                        // After download finish.
                        FileLocation.on("finish", () => {
                            FileLocation.close();
                            console.log(`Download File Complete: ${StarPowers}.png`);
                        });
                    });
                }));
            } else if (YesOrNo.toLowerCase() == 'no'){
                console.log('File download is skipped.');
            };
          });
    } else {
        console.log('No files to download!');
    };
});