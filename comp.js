const puppeteer = require('puppeteer');
const json = require('json')
const chrome = require('chrome-cookies-secure')


const url = 'https://gleam.io/LbqWK/win-a-surface-pro-x-signature-keyboard-and-slim-pen-from-windows-central';

const getCookies = (callback) => {
    chrome.getCookies(url, 'puppeteer', function(err, cookies) {
        if (err) {
            console.log(err, 'error');
            return
        }
        callback(cookies);
    }, 'Default') 
}

async function asyncGetCookies(args){
    return new Promise((resolve)=>{
        getCookies(resolve)
    });
}



class PageElement {
    constructor(elements, type, input){
        this.elements = elements;
        this.type = type;
        this.input = input;
    }   
}

class Competition {
    constructor(url, methods){
        this.url = url;
        this.methods = methods;
    }
}

async function checkIsVisitable(entryOption){
    const textElement = await entryOption.$('.text.user-links.entry-method-title.ng-scope');
    const text = await textElement.evaluate(element => element.innerText);
    const splitText = text.split(" ");
    if (splitText[0] === "Visit"){
        return true;
    } else {
        return false;
    }
}



async function handleGleam(page) {
    console.log('hi')
    const gleamEmailButtonElement = await page.$(".entry-content .click-blocks .email-background.popup-window");
    await gleamEmailButtonElement.click();
    await page.waitFor(10000);
}

(async (url) => {

    const cookies = await asyncGetCookies();
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    //let compUrl = 'https://gleam.io/LbqWK/win-a-surface-pro-x-signature-keyboard-and-slim-pen-from-windows-central';
    let compUrl = 'https://gleam.io/d2Whx/msi-optix-mpg27cq2-qhd-curved-gaming-monitor'
    console.log('CHROME COOKIES:')
    console.log(cookies)
    cookies.push({
        name: '_gfpc',
        value: 't',
        domain: 'gleam.io',
        path: '/'
    });
    console.log('BEFORE SET COOKIES:')
    console.log((await page.cookies(compUrl)));
   
    console.log('SET COOKIES:')
    await page.setCookie(...cookies);
    await page.goto(compUrl, {waitUntil : ['load', 'domcontentloaded']});
    console.log((await page.cookies(compUrl)));
    const gleamEmailButtonElement = await page.$(".entry-content .click-blocks .email-background.popup-window");
    await gleamEmailButtonElement.click();
    const gleamFullNameElement = await page.$('.contestant-form-group .form-wrapper input[name="name"');
    await gleamFullNameElement.type('H sddfid yet')
    const gleamEmailElement = await page.$('.contestant-form-group .form-wrapper input[name="email"');
    await gleamEmailElement.type('lmsaaoi@gmail.com')
    await page.waitForSelector('[ng-click="setContestant()"]', {visible: true})
    const gleamSaveElementList = await page.$('[ng-click="setContestant()"]');
    await page.waitFor(1000)
    await gleamSaveElementList.click();
    await page.waitFor(1000);
    await page.waitForSelector('.entry-content.ng-scope');
    const entryContent = await page.$$('.entry-content.ng-scope div[id][ng-class]');
    for (let i = 0; i < entryContent.length; i++) {
        if (await checkIsVisitable(entryContent[i])){
            let entryAnchor = await entryContent[i].$('a.enter-link');
            await entryAnchor.click();
            let visitLink = await entryContent[i].$('form div.form-compact__content a');
            await visitLink.click(),
            await page.waitFor(5000);
            let pages = await browser.pages();
            await pages[pages.length - 1].close();
            let continueButton = await entryContent[i].$('form div.form-actions a')
            if (continueButton) {
                await continueButton.click()
            }
            await page.waitFor(10000);



        }

    }
    await page.waitFor(10000)


    /*    await page.goto('https://www.ozbargain.com.au/competition');


    const competitionSelector = '.node-competition'
    const compLinkSelector =  '.via a';
    const entrySelector = '[title="Entry methods]';

    //Extract competition info from page
    const competitions = await page.evaluate(() => {
        const comps = Array.from(document.querySelectorAll('.node-competition'));
        return comps.map(comp => {
            const href = comp.querySelector('.via a').getAttribute('href');
            console.log(href)
            const url = `https:\/\/www.ozbargain.com.au${href}`;
            const methods = comp.querySelector('[title="Entry methods"]').innerText.split(", ");
            return {"url": url, "methods": methods};
        });
    });


    console.log(competitions)
    for (let i = 0; i < competitions.length; i++){
        await page.goto(competitions[i].url, {waitUntil : ['load', 'domcontentloaded']});
        await page.waitForNavigation();
        if (competitions[i].methods.includes('gleam')){
            await handleGleam(page);
        }
    }

/*
    let input_list = []
    let submit_list = []


    await page.goto('https://www.harpercollins.com.au/herstory/', { waitUntil : ['load', 'domcontentloaded']});

    const first_name_selector = "form input[name='first_name' i], form input[name='first-name' i], form input[name='firstname' i], form input[name='fname' i], form input[name='first' i], form input[placeholder='First Name' i]";
    const last_name_selector = "form input[name='last_name' i], form input[name='last-name' i], form input[name='lastname' i], form input[name='lname' i], form input[name='last' i], form input[placeholder='Last Name' i]";
    const email_selector = "form input[type='email'], form input[name='email' i]";
    const submit_selector = "form input[type='submit']";

//making the call to use querySelectorAll rather than just singular querySelector because sometimes
//there are multiple forms (sign up banners) and its easier just to submit everything

//there are common sites: viralsweep, ones that use gleam

//Extract input elements and create PageElement objects

    try {
        const first_name_elements = await page.$$(first_name_selector);
        console.log(first_name_elements)
        if (first_name_elements.length > 0){
            console.log("HELLO")
            const first_name = new PageElement(first_name_elements, "text", "first name yeet");
            input_list.push(first_name);
        }
    } catch (e) {
        console.error(e);
    }



    try {
        const last_name_elements = await page.$$(last_name_selector);
        if (last_name_elements.length > 0){
            const last_name = new PageElement(last_name_elements, "text", "last name yeet");
            input_list.push(last_name);
        }
    } catch (e) {
        console.error(e);
    }



    try {
        const email_elements = await page.$$(email_selector);
        if (email_elements.length > 0){
            const email = new PageElement(email_elements, "text", "fakeemail@gmail.com");
            input_list.push(email);
        }
    } catch (e) {
        console.error(e);
    }



//fill input elements
    for (let i = 0; i < input_list.length; i++){
        let ies = input_list[i];
        for (let j = 0; j < ies.elements.length; j++){
            try {
                await ies.elements[j].type(ies.input);
            } catch (e) {
                console.error(e);
            }
        }
    }


    try {
        await page.evaluate((submit_selector) => {
            document.querySelectorAll(submit_selector).forEach(function(element) {
                element.click();
                console.log('clicking')
            });
        }, submit_selector);
    } catch (e) {
        console.error(e);
    }  

    await page.waitFor(15000);

    */






await browser.close();
})();
