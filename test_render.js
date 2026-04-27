const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

// We need to inject the mock __SITE_CONFIG__ into the window so that the script can execute it
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

setTimeout(() => {
  const previousWorkGrid = dom.window.document.getElementById('previous-work-grid');
  const section = dom.window.document.getElementById('previous-work');
  console.log("Section display style:", section.style.display);
  console.log("Grid HTML inside previous work:", previousWorkGrid.innerHTML);
}, 2000);
