"""Pista original estilo cumbia (sintetizada, libre de derechos) para los motion flyers de CUU Tacos."""
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

SR = 44100
BPM = 96
BEAT = 60 / BPM
BARS = 4
DUR = BARS * 4 * BEAT  # 10 s
rng = np.random.default_rng(7)
out = np.zeros((int(SR * DUR) + SR, 2))

def env(n, a=0.005, r=0.1):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.exp(-t / r)
    return e

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    j = min(i + len(sig), len(out))
    s = sig[: j - i] * gain
    out[i:j, 0] += s * np.sqrt(0.5 * (1 - pan))
    out[i:j, 1] += s * np.sqrt(0.5 * (1 + pan))

def freq(note):  # MIDI -> Hz
    return 440 * 2 ** ((note - 69) / 12)

def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], btype="band")
    return lfilter(b, a, x)

# Progresión I - V - V - I en Do mayor
chords = [[60, 64, 67], [55, 59, 62, 65], [55, 59, 62, 65], [60, 64, 67]]
roots = [36, 43, 43, 36]

for bar in range(BARS):
    t0 = bar * 4 * BEAT
    # Bajo: tumbao raíz-quinta
    for k, (b, iv) in enumerate([(0, 0), (1.5, 7), (2, 7), (3.5, 0)]):
        n = int(SR * BEAT * 0.9)
        t = np.arange(n) / SR
        f = freq(roots[bar] + iv)
        s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.004, 0.25)
        add(s, t0 + b * BEAT, 0, 0.55)
    for beat in range(4):
        tb = t0 + beat * BEAT
        # Bombo en 1 y 3
        if beat in (0, 2):
            n = int(SR * 0.3); t = np.arange(n) / SR
            s = np.sin(2 * np.pi * (50 + 90 * np.exp(-t * 30)) * t) * env(n, 0.002, 0.12)
            add(s, tb, 0, 0.9)
        # Tambora/timbal en 2 y 4
        if beat in (1, 3):
            n = int(SR * 0.2); t = np.arange(n) / SR
            s = (0.6 * bp(rng.standard_normal(n), 800, 5000) + 0.5 * np.sin(2 * np.pi * 330 * t)) * env(n, 0.001, 0.06)
            add(s, tb, 0.1, 0.5)
        # Güiro: larga-corta-corta
        for off, ln, g in [(0, 0.22, 0.30), (0.5, 0.09, 0.22), (0.75, 0.09, 0.22)]:
            n = int(SR * ln); t = np.arange(n) / SR
            scr = bp(rng.standard_normal(n), 2500, 9000) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 38 * t)))
            add(scr * np.minimum(1, t / 0.01) * np.exp(-t / (ln * 0.8)), tb + off * BEAT, 0.5, g)
        # Cencerro en contratiempo
        n = int(SR * 0.12); t = np.arange(n) / SR
        s = (np.sign(np.sin(2 * np.pi * 800 * t)) + np.sign(np.sin(2 * np.pi * 540 * t))) * env(n, 0.001, 0.035)
        add(bp(s, 500, 4000), tb + 0.5 * BEAT, -0.4, 0.12)
        # Acordeón: acordes en contratiempo
        n = int(SR * BEAT * 0.35); t = np.arange(n) / SR
        s = np.zeros(n)
        for note in chords[bar]:
            for det in (-0.12, 0.12):
                f = freq(note + 12) * 2 ** (det / 12)
                s += ((2 * ((f * t) % 1) - 1) * 0.5 + np.sin(2 * np.pi * f * t))
        s *= (1 + 0.25 * np.sin(2 * np.pi * 6 * t)) * env(n, 0.01, 0.12)
        add(bp(s, 300, 3500) / len(chords[bar]), tb + 0.5 * BEAT, -0.2, 0.22)

# Melodía de acordeón (gancho)
mel = [(0, 76, .5), (.5, 74, .5), (1, 72, 1), (2, 74, .5), (2.5, 76, .5), (3, 79, 1),
       (4, 79, .5), (4.5, 77, .5), (5, 76, .5), (5.5, 74, .5), (6, 74, 1.5),
       (8, 76, .5), (8.5, 74, .5), (9, 72, 1), (10, 74, .5), (10.5, 76, .5), (11, 79, 1),
       (12, 81, .5), (12.5, 79, .5), (13, 76, .5), (13.5, 74, .5), (14, 72, 2)]
for b, note, ln in mel:
    n = int(SR * BEAT * ln * 0.95); t = np.arange(n) / SR
    f = freq(note) * (1 + 0.004 * np.sin(2 * np.pi * 5.5 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * np.sign(np.sin(ph)) * 0.4)
    e = np.minimum(1, np.arange(n) / (SR * 0.02)) * np.minimum(1, (n - np.arange(n)) / (SR * 0.05))
    add(bp(s * e, 250, 5000), b * BEAT, 0.15, 0.20)

out = out[: int(SR * DUR)]
# Fade in/out y normalización
fade = int(SR * 0.4)
out[:fade] *= np.linspace(0, 1, fade)[:, None]
out[-int(SR * 0.8):] *= np.linspace(1, 0, int(SR * 0.8))[:, None]
out /= np.max(np.abs(out)) * 1.12
wavfile.write("cumbia-cuu-tacos.wav", SR, (out * 32767).astype(np.int16))
print("ok", DUR)
