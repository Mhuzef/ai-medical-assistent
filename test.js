const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

        console.log("Navigating...");
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

        console.log("Adding debug event listeners...");
        // Expose a function to see form values
        console.log("Switching to signup tab...");
        await page.click('[data-auth-tab="signup"]');

        console.log("Filling signup form...");
        await page.type('#signup-name', 'Test User');
        await page.type('#signup-id', 'test@test.com');
        await page.type('#signup-pass', '123456');
        await page.type('#signup-confirm', '123456');

        console.log("Submitting signup form...");
        await page.click('#signup-submit-btn');

        await new Promise(r => setTimeout(r, 2000));

        console.log("Current user in localStorage:");
        const currentUser = await page.evaluate(() => localStorage.getItem('currentUser'));
        console.log(currentUser);

        console.log("Logging out...");
        const logoutBtnVisible = await page.evaluate(() => {
            const btn = document.getElementById('logout-btn');
            if (btn && btn.style.display !== 'none') {
                btn.click();
                return true;
            }
            return false;
        });
        console.log("Logout button clicked:", logoutBtnVisible);
        await new Promise(r => setTimeout(r, 1000));

        console.log("Attempting login...");
        await page.type('#login-id', 'test@test.com');
        await page.type('#login-pass', '123456');
        await page.click('#login-submit-btn');

        await new Promise(r => setTimeout(r, 2000));

        const currentUserAfterLogin = await page.evaluate(() => localStorage.getItem('currentUser'));
        console.log("User after login:", currentUserAfterLogin);

        const loginErrorHtml = await page.evaluate(() => document.getElementById('login-main-error').outerHTML);
        console.log("Login error text:", loginErrorHtml);

        const loginIdError = await page.evaluate(() => document.getElementById('login-id').className);
        console.log("Login ID class:", loginIdError);
        const loginPassError = await page.evaluate(() => document.getElementById('login-pass').className);
        console.log("Login Pass class:", loginPassError);

        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
