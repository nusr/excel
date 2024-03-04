function url() {
  return 'http://localhost:8000';
}
async function action(page) {
  await page.click('button[data-testid="toolbar-paste"]');
}
async function back() {
  // await page.click('[aria-label="Close"]');
}

module.exports = { action, back, url };
// npm i -g memlab
// memlab run --scenario ./memory/test.js
// memlab find-leaks --trace-all-objects
// memlab find-leaks --trace-object-size-above 1000000