# Genera los archivos finales del logo (emblema) a partir de fuentes/logo-rby-completo.jpg
import cv2, numpy as np
import sys
src = cv2.imread(sys.argv[1] if len(sys.argv)>1 else 'fuentes/logo-rby-completo.jpg')
S = src.shape[0]; c = S/2
yy,xx = np.mgrid[0:S,0:S]; rr = np.hypot(xx-c, yy-c)
# alfa: disco del emblema + elementos que sobresalen (por luminancia)
disk = np.clip((1010-rr)/8, 0, 1)
V = src.max(2).astype(np.float32)
lum = np.clip((V-12)/40, 0, 1) * (rr < 1120)
alpha = cv2.GaussianBlur(np.maximum(disk, lum).astype(np.float32), (0,0), 0.8)
rgba = np.dstack([src, (alpha*255).astype(np.uint8)])
ys,xs = np.nonzero(alpha > 0.05)
ext = max(np.hypot(xs-c, ys-c).max(), 1)
print('radio maximo del contenido', int(ext))
# 1) logo transparente recortado al contenido
x0,x1,y0,y1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
cv2.imwrite('logo/norinko-logo-transparente.png', rgba[y0:y1, x0:x1])
# 2) logo en fondo negro 2048
def on_black(size, fill):
    s = (size/2*fill)/ext
    M = np.float32([[s,0,size/2-c*s],[0,s,size/2-c*s]])
    return cv2.warpAffine(src, M, (size,size), flags=cv2.INTER_LANCZOS4)
cv2.imwrite('logo/norinko-logo-negro-2048.png', on_black(2048, 0.94))
# 3) foto de perfil 1080 (todo dentro del recorte circular)
cv2.imwrite('perfil/norinko-perfil-1080.png', on_black(1080, 0.965))
cv2.imwrite('perfil/norinko-perfil-1080.jpg', on_black(1080, 0.965), [cv2.IMWRITE_JPEG_QUALITY, 95])
# vista previa del recorte circular
p = on_black(1080, 0.965).astype(np.float32)
y2,x2 = np.mgrid[0:1080,0:1080]; m = (np.hypot(x2-540,y2-540) <= 540)[...,None]
prev = np.where(m, p, 245).astype(np.uint8)
cv2.imwrite('/tmp/claude-0/-home-user/094ad51c-dc1d-53f1-95cf-37b8d37e2c23/scratchpad/perfil-circulo.jpg', cv2.resize(prev,(540,540)))
