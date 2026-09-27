# Logo definitivo (estilo del logo original, solo "NORINKO PERFORMANCE"):
# recorte con transparencia, versión plana, monocromos, ícono "N" y foto de perfil.
import numpy as np, cv2
from PIL import Image, ImageDraw
OUT = 'marca/logo/'

def matte(path, lo=9, hi=23):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    V = im.max(2)
    a = np.clip((V - lo) / (hi - lo), 0, 1)
    m = (a > 0.5).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros(n, bool); keep[1:] = st[1:, cv2.CC_STAT_AREA] > 400
    a = a * keep[lab]
    a = cv2.GaussianBlur(a, (0, 0), 0.6)
    ys, xs = np.nonzero(a > 0.05); pad = 24
    box = (max(xs.min()-pad, 0), max(ys.min()-pad, 0), min(xs.max()+pad, im.shape[1]), min(ys.max()+pad, im.shape[0]))
    rgba = np.dstack([im, a * 255]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA').crop(box), im[box[1]:box[3], box[0]:box[2]]

A, A_rgb = matte('fuentes/conceptos-v3/v3-A-brillo.jpg')
B, B_rgb = matte('fuentes/conceptos-v3/v3-B-plano.jpg')
A.save(OUT + 'norinko-logo.png', optimize=True)
B.save(OUT + 'norinko-logo-plano.png', optimize=True)
print('A', A.size, 'B', B.size)

# monocromos a partir de la versión plana: solo las letras (píxeles claros/saturados)
b = np.asarray(B).astype(np.float32)
Vb = b[..., :3].max(2); letters = np.clip((Vb - 90) / 50, 0, 1) * (b[..., 3] / 255)
for name, col in [('blanco', (255, 255, 255)), ('negro', (20, 20, 20)), ('rojo', (215, 20, 26))]:
    arr = np.zeros((*letters.shape, 4), np.uint8); arr[..., :3] = col; arr[..., 3] = (letters * 255).astype(np.uint8)
    Image.fromarray(arr, 'RGBA').save(OUT + f'norinko-logo-mono-{name}.png', optimize=True)

# sobre negro (alta resolución)
def on_bg(logo, W, H, color, fill=0.86):
    bg = Image.new('RGBA', (W, H), color)
    s = min(W * fill / logo.width, H * fill / logo.height)
    l = logo.resize((round(logo.width * s), round(logo.height * s)), Image.LANCZOS)
    bg.paste(l, ((W - l.width) // 2, (H - l.height) // 2), l); return bg
on_bg(A, 3000, 1500, (0, 0, 0, 255)).convert('RGB').save(OUT + 'norinko-logo-fondo-negro.jpg', quality=95)
on_bg(A, 3000, 1500, (255, 255, 255, 255)).convert('RGB').save(OUT + 'norinko-logo-fondo-blanco.jpg', quality=95)

# ícono "N": componente roja más a la izquierda + su contorno
a_np = np.asarray(A).astype(np.float32); rgb = a_np[..., :3]
red = ((rgb[..., 0] > 120) & (rgb[..., 1] < 90) & (rgb[..., 2] < 90)).astype(np.uint8)
n, lab, st, cen = cv2.connectedComponentsWithStats(red, 8)
big = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 2000]
first = min(big, key=lambda i: st[i, cv2.CC_STAT_LEFT])
Nmask = (lab == first).astype(np.uint8)
Nmask = cv2.dilate(Nmask, np.ones((61, 61), np.uint8))
alphaN = (a_np[..., 3] / 255) * Nmask
iconN = np.dstack([rgb, alphaN * 255]).clip(0, 255).astype(np.uint8)
ys, xs = np.nonzero(alphaN > 0.05)
N = Image.fromarray(iconN, 'RGBA').crop((xs.min()-8, ys.min()-8, xs.max()+8, ys.max()+8))
N.save(OUT + 'norinko-icono-N.png', optimize=True)
print('N', N.size)

def app_icon(size, bg=(20, 20, 20), r=0.22):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0)); m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size-1, size-1), radius=int(size*r), fill=255)
    img.paste(Image.new('RGBA', (size, size), bg + (255,)), (0, 0), m)
    s = size * 0.78 / max(N.size); n2 = N.resize((round(N.width*s), round(N.height*s)), Image.LANCZOS)
    img.paste(n2, ((size-n2.width)//2, (size-n2.height)//2), n2); return img
app_icon(1024).save(OUT + 'norinko-icono-app.png', optimize=True)

# foto de perfil 1080: fondo carbón con brillo rojo sutil y el logo centrado dentro del círculo
S = 1080
yy, xx = np.mgrid[0:S, 0:S]; d = np.hypot(xx - S/2, yy - S/2) / (S/2)
base = np.zeros((S, S, 3), np.float32) + np.array([16, 16, 18])
glow = np.clip(1 - d / 0.95, 0, 1) ** 1.6
base += glow[..., None] * np.array([120, 10, 14]) * 0.55
stripes = ((xx * 0.42 + yy) % 90 < 2) * 0.05
base = base * (1 + stripes[..., None])
prof = Image.fromarray(base.clip(0, 255).astype(np.uint8), 'RGB').convert('RGBA')
s = 900 / A.width; l = A.resize((900, round(A.height * s)), Image.LANCZOS)
prof.paste(l, ((S - l.width)//2, (S - l.height)//2 + 6), l)
# franja inferior roja/amarilla dentro del círculo
dr = ImageDraw.Draw(prof)
prof = prof.convert('RGB'); prof.save('perfil/norinko-perfil-1080.png', optimize=True); prof.save('perfil/norinko-perfil-1080.jpg', quality=95)
circ = np.asarray(prof).copy(); circ[d > 1] = 245
Image.fromarray(circ).resize((540, 540)).save('/tmp/claude-0/-home-user/094ad51c-dc1d-53f1-95cf-37b8d37e2c23/scratchpad/perfil-circulo.jpg', quality=88)
