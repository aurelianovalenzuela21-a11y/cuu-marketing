# Genera el HTML de cada pieza del lanzamiento (posts 4:5 e historias 9:16).
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
WA = '656 127 8916'
BASE_CSS = """
*{margin:0;padding:0;box-sizing:border-box}
body{width:%(w)dpx;height:%(h)dpx;overflow:hidden;position:relative;font-family:'Barlow',sans-serif;color:#fff;background:#141414}
.disp{font-family:'Saira';font-style:italic;font-weight:900;text-transform:uppercase;letter-spacing:-.01em;line-height:.95}
.photo{position:absolute;inset:0;background-size:cover;background-position:center}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,.95) 0%%,rgba(10,10,10,.7) 34%%,rgba(10,10,10,0) 56%%,rgba(10,10,10,.1) 70%%,rgba(10,10,10,.85) 100%%)}
.top{position:absolute;left:72px;right:72px;top:64px;display:flex;justify-content:space-between;align-items:center}
.top img{height:92px}
.handle{font-family:'Saira';font-style:italic;font-weight:800;font-size:22px;letter-spacing:.06em;color:rgba(255,255,255,.85)}
.kicker{display:inline-flex;align-items:center;gap:14px;font-family:'Saira';font-style:italic;font-weight:800;font-size:24px;letter-spacing:.16em;text-transform:uppercase;color:#FFC20E}
.kicker i{width:46px;height:10px;background:linear-gradient(90deg,#D7141A 0 50%%,#FFC20E 50%%);transform:skewX(-24deg)}
.title{font-size:104px;margin-top:22px}
.title .y{color:#FFC20E}.title .r{color:#D7141A}
.sub{font-size:30px;line-height:1.35;color:rgba(255,255,255,.88);margin-top:22px;max-width:860px;font-weight:500}
.head{position:absolute;left:72px;right:72px;top:170px}
.foot{position:absolute;left:72px;right:72px;bottom:64px;display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
.pill{white-space:nowrap;flex-shrink:0;display:inline-flex;align-items:center;gap:14px;background:#D7141A;color:#fff;font-family:'Saira';font-style:italic;font-weight:900;font-size:30px;text-transform:uppercase;padding:18px 34px;clip-path:polygon(14px 0,100%% 0,calc(100%% - 14px) 100%%,0 100%%)}
.pill.y{background:#FFC20E;color:#141414}
.chips{display:flex;flex-wrap:wrap;gap:10px;flex:1;min-width:0}
.chip{font-family:'Saira';font-style:italic;font-weight:800;font-size:21px;text-transform:uppercase;padding:9px 16px;background:rgba(20,20,20,.75);border-left:6px solid #FFC20E}
.stripe{position:absolute;left:0;right:0;bottom:0;height:14px;background:linear-gradient(90deg,#D7141A 0 70%%,#FFC20E 70%%)}
"""
WA_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.8a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 1 1 8.37 4.63m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.4z"/></svg>'

def page(w, h, body, extra_css=''):
    return f"""<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="fonts.css"><style>{BASE_CSS % {'w': w, 'h': h}}{extra_css}</style></head><body>{body}</body></html>"""

def top(logo='logo-h.png'):
    return f'<div class="top"><img src="{logo}"><span class="handle">@norinko_performance</span></div>'

def photo_post(img, kicker, title, sub, chips=None, cta='Cotizar', pos='center'):
    chips_html = '<div class="chips">' + ''.join(f'<span class="chip">{c}</span>' for c in chips) + '</div>' if chips else '<span></span>'
    return page(1080, 1350, f"""
<div class="photo" style="background-image:url(../fotos/{img});background-position:{pos}"></div><div class="shade"></div>
{top()}
<div class="head"><div class="kicker"><i></i>{kicker}</div><div class="disp title">{title}</div><div class="sub">{sub}</div></div>
<div class="foot">{chips_html}<span class="pill">{WA_SVG}{cta}</span></div>
<div class="stripe"></div>""")

posts = {}
posts['01-lanzamiento'] = page(1080, 1350, f"""
<div class="photo" style="background-image:url(../fotos/garage-centro.jpg)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 44%,rgba(10,10,10,.25),rgba(10,10,10,.85) 70%)"></div>
<div style="position:absolute;left:0;right:0;top:120px;text-align:center"><div class="kicker" style="justify-content:center"><i></i>Ya abrimos en Cd. Juárez<i style="transform:skewX(-24deg) scaleX(-1)"></i></div></div>
<img src="emblema.png" style="position:absolute;left:50%;top:250px;transform:translateX(-50%);width:900px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.6))">
<div style="position:absolute;left:0;right:0;top:790px;text-align:center"><div class="disp" style="font-size:112px">Tu carro,<br><span style="color:#FFC20E">a otro nivel.</span></div></div>
<div style="position:absolute;left:0;right:0;bottom:70px;display:flex;justify-content:center"><span class="pill">{WA_SVG}WhatsApp {WA}</span></div>
<div class="stripe"></div>""")

services = [('01','Restauración de clásicos'),('02','Pintura y carrocería'),('03','Tapicería'),('04','Iluminación automotriz'),('05','Accesorios'),('06','Refacciones'),('07','Quemacocos'),('08','Suspensiones')]
rows = ''.join(f'<div class="srv"><span class="n">{n}</span><span class="t">{t}</span></div>' for n,t in services)
posts['02-servicios'] = page(1080, 1350, f"""
<div style="position:absolute;inset:0;background:#D7141A"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(115deg,transparent 0 80px,rgba(0,0,0,.05) 80px 82px)"></div>
{top('logo-h-rojo.png')}
<div class="head" style="top:170px"><div class="kicker" style="color:#fff"><i style="background:linear-gradient(90deg,#fff 0 50%,#FFC20E 50%)"></i>Servicios</div><div class="disp title" style="font-size:84px">Todo para tu carro,<br><span style="color:#FFC20E">en un solo taller.</span></div></div>
<div class="list">{rows}</div>
<div class="foot" style="justify-content:flex-end"><span class="pill y">{WA_SVG}{WA}</span></div>
<div class="stripe" style="background:linear-gradient(90deg,#141414 0 70%,#FFC20E 70%)"></div>""",
""".list{position:absolute;left:72px;right:72px;top:560px;display:grid;grid-template-columns:1fr 1fr;gap:18px 26px}
.srv{display:flex;align-items:center;gap:18px;background:#fff;color:#141414;padding:20px 22px;min-height:104px;border-radius:10px;border-left:8px solid #FFC20E}
.srv .n{font-family:'Saira';font-style:italic;font-weight:900;font-size:34px;color:#D7141A;min-width:52px}
.srv .t{font-family:'Saira';font-style:italic;font-weight:800;font-size:28px;text-transform:uppercase;line-height:1.05}""")

posts['03-quemacocos'] = photo_post('quemacocos.jpg', 'Quemacocos', 'Cielo abierto,<br><span class="y">sin filtraciones.</span>', 'Te lo vendemos, lo adaptamos aunque tu carro no lo traiga de fábrica y reparamos el que ya tienes.', ['Venta','Adaptación','Reparación'])
posts['04-restauracion'] = photo_post('restauracion.jpg', 'Restauración de clásicos', 'Respetamos<br><span class="y">la historia.</span>', 'Y mejoramos todo lo demás: mecánica, eléctrico, cromos y detalles originales.', ['Mecánica','Eléctrico','Cromos'], pos='40% center')
posts['05-pintura'] = photo_post('pintura.jpg', 'Pintura y carrocería', 'Brillo<br><span class="y">de agencia.</span>', 'Hojalatería, corrección de óxido y golpes, pintura completa o por pieza e igualación de color.', ['Hojalatería','Pintura','Pulido'])
posts['06-tapiceria'] = photo_post('tapiceria.jpg', 'Tapicería', 'Hecho a mano,<br><span class="y">a tu medida.</span>', 'Asientos, cielos, alfombras, paneles y volantes en piel, vinil o tela.', ['Piel','Vinil','Tela'])
posts['07-iluminacion'] = photo_post('iluminacion.jpg', 'Iluminación automotriz', 'Que te vean<br><span class="y">llegar.</span>', 'Faros LED y proyectores, halos, calaveras, neblineros y luz ambiental. Instalación limpia y segura.', ['LED','Halos','Proyectores'])
posts['08-suspension'] = photo_post('suspension.jpg', 'Suspensiones', 'La postura<br><span class="y">perfecta.</span>', 'Amortiguadores, bajadas, coilovers, suspensión de aire y levantamientos.', ['Coilovers','Air ride','Lift'])

steps = [('01','Diagnóstico','Revisamos tu carro y lo que buscas.'),('02','Cotización','Por escrito, desglosada y sin sorpresas.'),('03','Manos a la obra','Avances en fotos y video por WhatsApp.'),('04','Entrega','Prueba en calle y garantía por escrito.')]
st = ''.join(f'<div class="st"><span class="n">{n}</span><div><div class="t">{t}</div><div class="d">{d}</div></div></div>' for n,t,d in steps)
posts['09-cotiza'] = page(1080, 1350, f"""
<div style="position:absolute;inset:0;background:#FFC20E"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(115deg,transparent 0 80px,rgba(0,0,0,.04) 80px 82px)"></div>
<div class="top"><img src="logo-h-claro.png"><span class="handle" style="color:#141414">@norinko_performance</span></div>
<div class="head"><div class="kicker" style="color:#141414"><i></i>Así trabajamos</div><div class="disp title" style="color:#141414;font-size:100px">De la idea<br><span style="color:#D7141A">a la calle.</span></div></div>
<div class="steps">{st}</div>
<div style="position:absolute;left:72px;right:72px;bottom:70px;background:#141414;color:#fff;padding:30px 36px;display:flex;align-items:center;justify-content:space-between;clip-path:polygon(18px 0,100% 0,calc(100% - 18px) 100%,0 100%)">
<div><div class="disp" style="font-size:40px;color:#FFC20E">Cotiza gratis hoy</div><div style="font-size:24px;margin-top:6px;color:rgba(255,255,255,.8)">Ciudad Juárez, Chihuahua</div></div>
<div class="disp" style="font-size:52px;display:flex;align-items:center;gap:14px"><span style="color:#25D366">{WA_SVG.replace('34','48')}</span>{WA}</div></div>""",
""".steps{position:absolute;left:72px;right:72px;top:450px;display:grid;gap:18px}
.st{display:flex;align-items:center;gap:26px;background:#fff;color:#141414;padding:22px 28px;border-radius:10px}
.st .n{font-family:'Saira';font-style:italic;font-weight:900;font-size:48px;color:#fff;background:#D7141A;width:96px;height:96px;display:grid;place-items:center;border-radius:50%;flex-shrink:0}
.st .t{font-family:'Saira';font-style:italic;font-weight:900;font-size:36px;text-transform:uppercase}
.st .d{font-size:26px;color:#55555C;margin-top:2px}""")

# Historias 9:16
stories = {}
stories['h1-lanzamiento'] = page(1080, 1920, f"""
<div class="photo" style="background-image:url(../fotos/garage-centro.jpg)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,.85),rgba(10,10,10,.35) 40%,rgba(10,10,10,.9) 80%)"></div>
<div style="position:absolute;left:0;right:0;top:230px;text-align:center"><div class="kicker" style="justify-content:center;font-size:30px"><i></i>Ya abrimos</div><div class="disp" style="font-size:120px;margin-top:20px">Ciudad<br><span style="color:#FFC20E">Juárez</span></div></div>
<img src="emblema.png" style="position:absolute;left:50%;top:760px;transform:translateX(-50%);width:920px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.6))">
<div style="position:absolute;left:0;right:0;top:1330px;text-align:center;font-family:'Saira';font-style:italic;font-weight:800;font-size:34px;text-transform:uppercase;letter-spacing:.06em;line-height:1.5">Restauración · Pintura · Tapicería<br>Quemacocos · Luces · Suspensiones</div>
<div style="position:absolute;left:0;right:0;bottom:250px;display:flex;justify-content:center"><span class="pill" style="font-size:40px;padding:24px 44px">{WA_SVG}{WA}</span></div>
<div class="stripe"></div>""")
stories['h2-quemacocos'] = page(1080, 1920, f"""
<div class="photo" style="background-image:url(../fotos/quemacocos.jpg)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,.9),rgba(10,10,10,.2) 38%,rgba(10,10,10,.2) 62%,rgba(10,10,10,.92))"></div>
<div style="position:absolute;left:80px;right:80px;top:220px"><div class="kicker" style="font-size:30px"><i></i>Quemacocos</div><div class="disp" style="font-size:118px;margin-top:20px">¿Tu carro<br><span style="color:#FFC20E">no lo trae?</span></div><div class="sub" style="font-size:38px">Te lo adaptamos.</div></div>
<div style="position:absolute;left:80px;right:80px;bottom:260px"><div class="chips" style="margin-bottom:34px"><span class="chip" style="font-size:32px">Venta</span><span class="chip" style="font-size:32px">Adaptación</span><span class="chip" style="font-size:32px">Reparación</span></div><span class="pill" style="font-size:40px;padding:24px 44px">{WA_SVG}Cotiza: {WA}</span></div>
<div class="stripe"></div>""")

for k,v in posts.items(): open(os.path.join(HERE, f'post-{k}.html'),'w').write(v)
for k,v in stories.items(): open(os.path.join(HERE, f'historia-{k}.html'),'w').write(v)
print(len(posts), len(stories))
