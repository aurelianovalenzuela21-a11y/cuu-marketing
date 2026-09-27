# Logo secundario (concepto C): versiones de color con transparencia y lockup horizontal.
import numpy as np
from PIL import Image
SRC = 'fuentes/conceptos/concepto-C-minimal.jpg'
OUT = 'marca/logo-secundario/'
im = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
H, W = im.shape[:2]
V = im.max(2)
alpha = np.clip((V - 18) / (200 - 18), 0, 1)
alpha[:, 2025:] = 0; alpha[2025:, :] = 0
col = np.where(alpha[..., None] > 0.02, im / np.maximum(V[..., None], 1) * 255, 0)  # color normalizado
r, g, b = col[..., 0], col[..., 1], col[..., 2]
is_white = (np.minimum(np.minimum(r, g), b) > 175)
is_yellow = (~is_white) & (r > 180) & (g > 110) & (b < 130)
is_red = (~is_white) & (~is_yellow)
yy = np.arange(H)[:, None] * np.ones((1, W))
perf_zone = (yy >= 1300) & (yy <= 1390)

RED = np.array([215, 20, 26]); YEL = np.array([255, 194, 14]); WHT = np.array([255, 255, 255]); INK = np.array([20, 20, 20])

def paint(white, red, yellow, perf=None):
    out = np.zeros((H, W, 3), np.float32)
    out[is_white] = white; out[is_red] = red; out[is_yellow] = yellow
    if perf is not None:
        out[perf_zone & is_yellow] = perf
    return out

def save(rgb, name, box):
    a = (alpha * 255).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb.clip(0, 255).astype(np.uint8), a]), 'RGBA').crop(box)
    img.save(OUT + name, optimize=True)
    return img

versions = {
    'oscuro': paint(WHT, RED, YEL),
    'claro':  paint(INK, RED, YEL, perf=RED),
    'rojo':   paint(WHT, YEL, YEL, perf=WHT),
    'blanco': paint(WHT, WHT, WHT),
    'negro':  paint(INK, INK, INK),
}
STACK = (300, 640, 1750, 1400)          # logo vertical completo
ICON = (600, 660, 1450, 1040)           # solo la N
TEXT = (330, 1100, 1720, 1385)          # NORINKO + PERFORMANCE
for k, rgb in versions.items():
    save(rgb, f'norinko-logo-vertical-{k}.png', STACK)
    icon = save(rgb, f'norinko-isotipo-{k}.png', ICON)
    text = Image.fromarray(np.dstack([rgb.clip(0,255).astype(np.uint8), (alpha*255).astype(np.uint8)]), 'RGBA').crop(TEXT)
    # lockup horizontal: N a la izquierda, texto a la derecha
    ih = int(text.height * 1.05); iw = int(icon.width * ih / icon.height)
    icon_s = icon.resize((iw, ih), Image.LANCZOS)
    gap = 50
    lock = Image.new('RGBA', (iw + gap + text.width, max(ih, text.height)), (0, 0, 0, 0))
    lock.paste(icon_s, (0, (lock.height - ih) // 2), icon_s)
    lock.paste(text, (iw + gap, (lock.height - text.height) // 2), text)
    lock.save(OUT + f'norinko-logo-horizontal-{k}.png', optimize=True)
print('ok')
