const Axios = require('axios');
const Fs = require('fs');
const Config = require('../configuration/config.json');
const https = require('https');

const AsktoDownload = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

Axios({
    url: "https://api.brawlapi.com/v1/brawlers"
}).then(async (Response) => {
    if(Response.status != 200) return;

    const BrawlerIcons = await Fs.readdirSync('./assets/Brawler-Icons').map(File => `${File.replace('.png', '')}`);
    const BrawlerIcons2 = await Fs.readdirSync('./assets/Brawler-Icons-2').map(File => `${File.replace('.png', '')}`);
    const BrawlerPins = await Fs.readdirSync('./assets/Brawler-Pins').map(File => `${File.replace('.png', '')}`);

    let BrawlerIconsFromBrawlify = [];
    await Response.data.list.forEach(m => BrawlerIconsFromBrawlify.push(m.id));

    const NonDuplicates1 = BrawlerIconsFromBrawlify.filter(x => !BrawlerIcons.includes(`${x}`));
    const NonDuplicates2 = BrawlerIconsFromBrawlify.filter(x => !BrawlerIcons2.includes(`${x}`));
    const NonDuplicates3 = BrawlerIconsFromBrawlify.filter(x => !BrawlerPins.includes(`${x}`));

    console.log('Brawler Icons:');
    console.log(NonDuplicates1);
    console.log('Brawler Icons 2:');
    console.log(NonDuplicates2);
    console.log('Brawler Pins:');
    console.log(NonDuplicates3);

    if(NonDuplicates1.length != 0){
        AsktoDownload.question('Would you like to try and download the Brawler Assets? Please respond with Yes or No: ', (YesOrNo) => {
            if(YesOrNo.toLocaleLowerCase() == 'yes'){

                Promise.all(NonDuplicates1.map(async(IconId) => {
                    const ImageURL = Response.data.list.find(Brawler => Brawler.id == IconId).imageUrl2;

                    https.get(ImageURL, function (Response) {
                        if(Response.statusCode != 200) return console.log('Remote server files not found!');
                        
                        const FileLocation = Fs.createWriteStream(`./assets/Brawler-Icons/${IconId}.png`);
                        Response.pipe(FileLocation);

                        // After download finish.
                        FileLocation.on("finish", () => {
                            FileLocation.close();
                            console.log(`Download File Complete: ${IconId}.png`);
                        });
                    });
                }));

                Promise.all(NonDuplicates2.map(async(IconId) => {
                    const ImageURL = Response.data.list.find(Brawler => Brawler.id == IconId).imageUrl;

                    https.get(ImageURL, function (Response) {
                        if(Response.statusCode != 200) return console.log('Remote server files not found!');
                        
                        const FileLocation = Fs.createWriteStream(`./assets/Brawler-Icons-2/${IconId}.png`);
                        Response.pipe(FileLocation);

                        // After download finish.
                        FileLocation.on("finish", () => {
                            FileLocation.close();
                            console.log(`Download File Complete: ${IconId}.png`);
                        });
                    });
                }));

                Promise.all(NonDuplicates3.map(async(IconId) => {
                    const ImageURL = Response.data.list.find(Brawler => Brawler.id == IconId).imageUrl3;

                    https.get(ImageURL, function (Response) {
                        if(Response.statusCode != 200) return console.log('Remote server files not found!');
                        
                        const FileLocation = Fs.createWriteStream(`./assets/Brawler-Pins/${IconId}.png`);
                        Response.pipe(FileLocation);

                        // After download finish.
                        FileLocation.on("finish", () => {
                            FileLocation.close();
                            console.log(`Download File Complete: ${IconId}.png`);
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