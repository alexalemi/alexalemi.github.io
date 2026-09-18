"""Build the king-of-clubs mark (../koc.svg) from a handful of geometric pieces.

The shape is three circles, a pointed cap made from the two tangent lines
from the tip to the top circle, and a stem whose sides hook out of the side
circles into a thin neck and then flare as cubics to a flat base.  The numbers
below were fit to the site's original 180px favicon (apple-touch-icon.png).

    python make_koc.py            # write ../koc.svg
    python make_koc.py --jpegs    # also render koc_<size>.jpg (needs rsvg-convert + ImageMagick)
"""
import math, pathlib, subprocess, sys

# ---- construction parameters (svg units, viewBox 152.4) ----
AX   = 76.2                    # symmetry axis
TIP  = 0.0                     # y of the pointed cap
TOP  = (AX, 43.0, 31.4)        # top circle (cx, cy, r)
SIDE = (37.6, 89.3, 32.5)      # side circles: (dx from axis, cy, r)
NECK_Y, NECK_HALF = 100.0, 1.8 # the stem is thinnest here
FLARE = (40, 12)               # handle lengths: straight down from the neck, straight in from the base
BASE_Y, BASE_HALF, BASE_LIP = 152.4, 48.0, 4.4
HOOK = (134, 15.5, 8.5)        # where the stem leaves the side circle (deg, y-down) and its two handle lengths
FILL = "#1e1e1e"
SIZES = (32, 64, 128, 180, 256, 512, 1024, 2048)

HERE = pathlib.Path(__file__).resolve().parent


def pt(c, deg):
    a = math.radians(deg)
    return (c[0] + c[2]*math.cos(a), c[1] + c[2]*math.sin(a))

def ang(c, p):
    return math.degrees(math.atan2(p[1]-c[1], p[0]-c[0])) % 360

def outer_intersection(c1, c2):
    """The intersection of two circles farther from the axis."""
    dx, dy = c2[0]-c1[0], c2[1]-c1[1]; d = math.hypot(dx, dy)
    a = (c1[2]**2 - c2[2]**2 + d*d) / (2*d); h = math.sqrt(c1[2]**2 - a*a)
    mx, my = c1[0] + a*dx/d, c1[1] + a*dy/d
    return max((mx - h*dy/d, my + h*dx/d), (mx + h*dy/d, my - h*dx/d), key=lambda q: abs(q[0]-AX))

def mirror(p):
    return (2*AX - p[0], p[1])

def fmt(p):
    return f"{p[0]:.2f},{p[1]:.2f}"

def arc(c, a, b):
    large = (ang(c, b) - ang(c, a)) % 360 > 180
    return f"A {c[2]} {c[2]} 0 {int(large)} 1 {fmt(b)}"


def build_svg():
    R = (AX + SIDE[0], SIDE[1], SIDE[2]); L = (AX - SIDE[0], SIDE[1], SIDE[2])
    t = math.degrees(math.acos(TOP[2] / (TOP[1] - TIP)))    # tangent from tip to top circle
    Ttr, Ttl = pt(TOP, -90 + t), pt(TOP, -90 - t)
    Qr, Ql = outer_intersection(TOP, R), outer_intersection(TOP, L)

    # hook: leave the right circle along its (clockwise) tangent, arrive at the neck heading down
    deg, u, v = HOOK
    Sr = pt(R, deg); T = (-math.sin(math.radians(deg)), math.cos(math.radians(deg)))
    N = (AX + NECK_HALF, NECK_Y)
    H1, H2 = (Sr[0] + u*T[0], Sr[1] + u*T[1]), (N[0], N[1] - v)
    # flare: vertical at the neck, horizontal at the base
    Br = (AX + BASE_HALF, BASE_Y - BASE_LIP)
    F1, F2 = (N[0], N[1] + FLARE[0]), (Br[0] - FLARE[1], Br[1])

    d = [f"M {fmt((AX, TIP))}", f"L {fmt(Ttr)}", arc(TOP, Ttr, Qr), arc(R, Qr, Sr),
         f"C {fmt(H1)} {fmt(H2)} {fmt(N)}", f"C {fmt(F1)} {fmt(F2)} {fmt(Br)}", f"L {fmt((Br[0], BASE_Y))}",
         f"L {fmt(mirror((Br[0], BASE_Y)))}", f"L {fmt(mirror(Br))}",
         f"C {fmt(mirror(F2))} {fmt(mirror(F1))} {fmt(mirror(N))}",
         f"C {fmt(mirror(H2))} {fmt(mirror(H1))} {fmt(mirror(Sr))}",
         arc(L, mirror(Sr), Ql), arc(TOP, Ql, Ttl), "Z"]
    path = "\n           ".join(d)
    return f'''<!-- Alex Alemi's king-of-clubs mark, built geometrically:
     three circles (top r={TOP[2]} at (76.2, {TOP[1]}); sides r={SIDE[2]} at (76.2±{SIDE[0]}, {SIDE[1]})),
     a pointed cap from the two tangent lines to (76.2, {TIP:g}), and a stem whose sides
     hook out of the side circles into a neck at y={NECK_Y:g}, then flare to a {2*BASE_HALF:g}-wide base. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152.4 152.4" width="152.4" height="152.4">
  <path fill="{FILL}" d="{path}"/>
</svg>
'''


def render_jpegs(svg_path):
    for n in SIZES:
        png = subprocess.run(["rsvg-convert", "-w", str(n), "-h", str(n), "-b", "white", str(svg_path)],
                             check=True, capture_output=True).stdout
        subprocess.run(["convert", "-", "-quality", "92", str(HERE / f"koc_{n}.jpg")], input=png, check=True)


if __name__ == "__main__":
    out = HERE.parent / "koc.svg"
    out.write_text(build_svg())
    print(f"wrote {out}")
    if "--jpegs" in sys.argv:
        render_jpegs(out)
        print(f"wrote koc_{{{','.join(map(str, SIZES))}}}.jpg")
