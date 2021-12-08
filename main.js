const puppeteer = require('puppeteer');

const config = require('./config.json');

const dict = require('./dictionary.json');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });

    await page.goto('https://membean.com/login');
    await page.type('#username', config.username);
    await page.type('#password', config.password);
    await page.click('.btn-call-to-action'); //login
    setTimeout(function () {
        page.click('#startTrainingBtn'); //goto proceed n select time page
        setTimeout(async function () {
            console.log(page.url())
            if (page.url() === 'https://membean.com/training_sessions/new') {
                page.click('#Proceed') //start training
            }

            setTimeout(async function () {
                //we are now in wordsland.
                //we need to find what kind of question we are on.
                async function answer() {
                    if (await page.$('#next-btn') !== null) {
                        console.log('learn page')
                        //page is word page - move on.
                        page.click('#next-btn')
                        setTimeout(async function () { answer() }, 1000)

                        //return //should return but debugng...
                    }


                    if (await page.$('#single-question') !== null && await page.$('#word-hint') === null) {

                        console.log('four button question')

                        const question = await page.$eval('.question', el => el.innerText);

                        console.log(question)

                        let word = undefined

                        Object.keys(dict).forEach((element) => {
                            elmnt = element
                            dict[element].forEach(element => {
                                if (element === question) {
                                    word = elmnt
                                }
                            })
                        })

                        console.log(word)

                        if (word === undefined) {
                            page.click('.choice')

                            //now, right here you're going to wait a tiny bit and then get the correct word. add the question to that word.

                        } else {

                            //console.log(await page.$eval('.choice', el => el.innerText))

                            //console.log(await page.$$eval('.choice-word', (element) => element[1]))

                        }

                    }

                    if(await page.$('#single-question') !== null && await page.$('#word-hint') !== null){
                        console.log('input page')

                        const hint = await page.$eval('#word-hint', el => el.innerText);

                        console.log('hint')
                    }


                }

                answer()

            }, 1000)
        }, 1000);
    }, 1500);



    //await browser.close();
})();