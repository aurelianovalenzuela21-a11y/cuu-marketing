# Genera el logotipo plano (vectorial) de Norinko Performance en SVG, con el texto convertido a trazos.
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import os, sys
FD = sys.argv[1]
OUT = sys.argv[2]
RED, YEL, WHT, INK = '#D7141A', '#FFC20E', '#FFFFFF', '#141414'

def text_path(fontfile, text, size, x, y, tracking=0):
    f = TTFont(fontfile); gs = f.getGlyphSet(); cmap = f.getBestCmap()
    upm = f['head'].unitsPerEm; s = size/upm
    pen = SVGPathPen(gs); cx = x
    for ch in text:
        g = cmap[ord(ch)]
        tp = TransformPen(pen, (s, 0, 0, -s, cx, y))
        gs[g].draw(tp)
        cx += gs[g].width*s + tracking
    return pen.getCommands(), cx - tracking

def measure(fontfile, text, size, tracking=0):
    return text_path(fontfile, text, size, 0, 0, tracking)[1]

BLACK = os.path.join(FD, 'saira-latin-900-italic.woff2')
XB = os.path.join(FD, 'saira-latin-800-italic.woff2')

def wordmark(nko_color, perf_bg, perf_fg, nori_color=RED, stripes=True, bg=None):
    size = 200
    w_nori = measure(BLACK, 'NORI', size); w_all = measure(BLACK, 'NORINKO', size)
    ox = 175 if stripes else 20
    nori, _ = text_path(BLACK, 'NORI', size, ox, 190)
    nko, _ = text_path(BLACK, 'NKO', size, ox + w_nori, 190)
    # barra PERFORMANCE (paralelogramo)
    bx0, by0, bh = ox + 30, 215, 78
    bx1 = ox + w_all - 8
    perf_size = 58; trk = 14
    pw = measure(XB, 'PERFORMANCE', perf_size, trk)
    px = (bx0 + bx1)/2 - pw/2 + 6
    perf, _ = text_path(XB, 'PERFORMANCE', perf_size, px, by0 + 58, trk)
    sk = 22
    bar = f'M{bx0+sk},{by0} L{bx1+sk},{by0} L{bx1-sk},{by0+bh} L{bx0-sk},{by0+bh} Z'
    W = int(bx1 + sk + 30); H = 330
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">']
    if bg: parts.append(f'<rect width="{W}" height="{H}" fill="{bg}"/>')
    if stripes:
        for i,(c) in enumerate([RED, YEL, nko_color]):
            y = 70 + i*38
            parts.append(f'<path d="M{40+i*14+18},{y} L{130+i*14+18},{y} L{130+i*14},{y+24} L{40+i*14},{y+24} Z" fill="{c}"/>')
    parts += [f'<path d="{nori}" fill="{nori_color}"/>', f'<path d="{nko}" fill="{nko_color}"/>',
              f'<path d="{bar}" fill="{perf_bg}"/>', f'<path d="{perf}" fill="{perf_fg}"/>', '</svg>']
    return '\n'.join(parts)

def isotipo(bg_color=RED, n_color=WHT, stripe=YEL, rounded=True):
    size = 300
    n, wn = text_path(BLACK, 'N', size, 0, 0)
    # centrar la N en 400x400
    x = 200 - wn/2 - 6; y = 262
    n, _ = text_path(BLACK, 'N', size, x, y)
    r = 70 if rounded else 0
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
<rect width="400" height="400" rx="{r}" fill="{bg_color}"/>
<path d="M0,330 L400,282 L400,314 L0,362 Z" fill="{stripe}"/>
<path d="{n}" fill="{n_color}"/>
</svg>'''

os.makedirs(OUT, exist_ok=True)
files = {
 'norinko-logotipo-fondo-oscuro.svg': wordmark(WHT, YEL, INK),
 'norinko-logotipo-fondo-claro.svg': wordmark(INK, YEL, INK),
 'norinko-logotipo-fondo-rojo.svg': wordmark(WHT, YEL, INK, nori_color=WHT, stripes=False),
 'norinko-logotipo-blanco.svg': wordmark(WHT, WHT, RED, nori_color=WHT, stripes=False),
 'norinko-logotipo-negro.svg': wordmark(INK, INK, WHT, nori_color=INK, stripes=False),
 'norinko-isotipo.svg': isotipo(),
 'norinko-isotipo-oscuro.svg': isotipo(bg_color=INK, n_color=WHT, stripe=RED),
}
for k,v in files.items(): open(os.path.join(OUT,k),'w').write(v)
print('ok', list(files))
