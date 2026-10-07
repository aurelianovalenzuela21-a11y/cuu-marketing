const { chromium } = require(process.argv[2] + '/playwright');
const [,, , query, outDir, mode] = process.argv;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('err:', e.message));
  await p.goto('http://localhost:8765/scene.html?' + query);
  await p.waitForSelector('body[data-ready="1"]', { timeout: 120000 });
  const times = mode === 'test' ? [0, 1, 2.5, 4] : [...Array(180).keys()].map(i => i / 30);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => window.renderAt(t), times[i]);
    await p.screenshot({ path: `${outDir}/${mode === 'test' ? 'test_' + times[i] : 'f' + String(i).padStart(4, '0')}.png` });
  }
  await b.close();
})();
