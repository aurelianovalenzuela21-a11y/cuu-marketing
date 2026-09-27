# Emblema principal (concepto D): PNG transparente, versión en negro y foto de perfil.
import cv2, numpy as np
src = cv2.imread('fuentes/conceptos/concepto-D-hotrod.jpg')
h, w = src.shape[:2]
hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV)
sat = (hsv[..., 1] > 110) & (hsv[..., 2] > 80)
pts = []
for y in range(int(h*.1), int(h*.9), 4):
    row = np.nonzero(sat[y])[0]
    if len(row): pts += [(row[0], y), (row[-1], y)]
for x in range(int(w*.3), int(w*.7), 4):
    col = np.nonzero(sat[:, x])[0]
    if len(col): pts += [(x, col[0]), (x, col[-1])]
pts = np.array(pts, float)
A = np.c_[2*pts[:, 0], 2*pts[:, 1], np.ones(len(pts))]; b = (pts**2).sum(1)
cx, cy, c = np.linalg.lstsq(A, b, rcond=None)[0]; R = np.sqrt(c + cx**2 + cy**2)
print('circulo', round(cx), round(cy), round(R))
yy, xx = np.mgrid[0:h, 0:w]; rr = np.hypot(xx-cx, yy-cy)
disk = np.clip((R + 4 - rr) / 5, 0, 1)
lum = np.clip((src.max(2).astype(np.float32) - 14) / 40, 0, 1) * (rr < R*1.25)
alpha = cv2.GaussianBlur(np.maximum(disk, lum).astype(np.float32), (0, 0), 0.8)
ys, xs = np.nonzero(alpha > 0.05)
ext = np.hypot(xs-cx, ys-cy).max(); print('radio contenido', round(ext))
rgba = np.dstack([src, (alpha*255).astype(np.uint8)])
x0, x1, y0, y1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
cv2.imwrite('logo/norinko-emblema-transparente.png', rgba[y0:y1, x0:x1])
def on_black(size, fill):
    s = (size/2*fill)/ext
    M = np.float32([[s, 0, size/2-cx*s], [0, s, size/2-cy*s]])
    return cv2.warpAffine(src, M, (size, size), flags=cv2.INTER_LANCZOS4)
cv2.imwrite('logo/norinko-emblema-negro-2048.png', on_black(2048, 0.92))
p = on_black(1080, 0.95)
cv2.imwrite('perfil/norinko-perfil-1080.png', p)
cv2.imwrite('perfil/norinko-perfil-1080.jpg', p, [cv2.IMWRITE_JPEG_QUALITY, 95])
y2, x2 = np.mgrid[0:1080, 0:1080]; m = (np.hypot(x2-540, y2-540) <= 540)[..., None]
cv2.imwrite('/tmp/claude-0/-home-user/094ad51c-dc1d-53f1-95cf-37b8d37e2c23/scratchpad/perfil-circulo.jpg', cv2.resize(np.where(m, p, 245).astype(np.uint8), (540, 540)))
