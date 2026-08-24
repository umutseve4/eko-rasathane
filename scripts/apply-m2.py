from pathlib import Path

def replace(path, old, new):
    p=Path(path); text=p.read_text(); assert old in text, f'missing marker in {path}: {old[:80]}'; p.write_text(text.replace(old,new,1))

replace('core.mjs', " if(p.length===2&&p[0]==='sinif'", " if(p.length===1&&p[0]==='program')return {name:'program'};\n if(p.length===2&&p[0]==='sinif'")
replace('app.js', "import {parseRoute,coursesForGrade,courseProgress,migrateState} from './core.mjs';", "import {parseRoute,coursesForGrade,courseProgress,migrateState} from './core.mjs';\nimport {programPage} from './program.mjs';")
replace('app.js', "function home(){", "function program(){programPage({app,setCrumbs,esc})}\nfunction home(){")
replace('app.js', "</section><section class=\"manifest\">", "</section><p><a class=\"primary\" href=\"#/program\">2025–2026 akademik programını aç →</a></p><section class=\"manifest\">")
replace('app.js', "<span>5. yarıyıl · güz</span>", "<span>Doğrulanmış dersler</span>")
replace('app.js', "Aktif BUÜ eğitim planıyla satır satır eşleştirme sürüyor.", "Kanonik müfredat ilişkileri ve dönemsel program kayıtları ayrı kaynak katmanlarında yayımlanır.")
replace('app.js', "({home,grade:", "({home,program,grade:")
replace('index.html', '<link rel="stylesheet" href="./styles.css">', '<link rel="stylesheet" href="./styles.css">\n  <link rel="stylesheet" href="./program.css">')
replace('index.html', '<div class="header-actions">', '<div class="header-actions"><a href="#/program">Program</a>')
replace('package.json', '"version": "0.3.0"', '"version": "0.4.0"')
replace('package.json', 'node --check academic-catalog.mjs', 'node --check academic-catalog.mjs && node --check offerings.mjs && node --check program.mjs && node --check data/timetable.mjs')
replace('tests/core.test.mjs', "assert.deepEqual(parseRoute('#/'),{name:'home'});", "assert.deepEqual(parseRoute('#/'),{name:'home'});assert.deepEqual(parseRoute('#/program'),{name:'program'});")
replace('tests/core.test.mjs', "['#/sinif/9'", "['#/program/','#/program/foo','#/program%2Ffoo','#/sinif/9'")
readme=Path('README.md').read_text()
if '#/program' not in readme: Path('README.md').write_text(readme+'\n\n## Akademik program (M2)\n\n`#/program`, resmî 2025–2026 güz ve bahar programlarından çıkarılan 164 EKO kaydını (108 I. öğretim, 56 II. öğretim) gösterir. Basılı alanlar değiştirilmez; kanonik katalogla uzlaştırma sonucu her kayıtta açıkça saklanır.\n')
road=Path('ROADMAP.md').read_text()
if 'M2 akademik program dikey dilimi' not in road: Path('ROADMAP.md').write_text(road+'\n\n- [x] M2 akademik program dikey dilimi: 164 provenance-preserving Offering, açık uzlaştırma statüleri ve `#/program` görünümü.\n')
