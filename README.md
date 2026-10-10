# FunCAD project site

This is a dependency-free static project site for **Can It Actually Work? Synthesizing Functional CAD Mechanisms**.

Hosted on UCL: https://zigeng.duckdns.org/funcad/. This repository mirrors the `project_site/` folder of the main Harness repository, which also holds the deployment configuration.

Serve the repository root with a static server; the Figure 7 GLB viewers use ES modules and do not run from a `file://` page:

```bash
python -m http.server 8791
```

Then visit `http://127.0.0.1:8791/`.

The page uses only local files (no external fonts, scripts or styles). It is media-first and keeps text to headings and short captions. Sections, in order: a full-screen hero loop of the printed prototypes; Figure 1 with headline numbers; the problem (Figure 7 and two draggable failure-part viewers); FunCAD-Harness (Figure 5); simulation replays; repair examples (Figures 8–10; the gripper example adds a before/after replay); printed prototypes; FunCADBench (Figures 3 and 2, a filterable build gallery and the 46 family names); results; resources. Light and dark themes follow the system setting and can be toggled.

## Media sources

- `assets/hero/` and `assets/proto/`: silent loops cut from the six chapter videos of the Mechanical Benchmark Showcase (the full film is `assets/mechanical-benchmark-showcase.mp4`); title cards and frame chrome are removed.
- `assets/sim/`: renders of recorded FunCAD-Harness test replays from the team HF archive. Each clip poses the replay's original body-local CAD meshes from its saved per-frame body poses; nothing is re-simulated. Colors are for display. The before/after pair (gripper W05 Fable r01/r02, matching Figure 9) shares one camera.
- `assets/gallery/`: Blender renders of delivered CAD from the paper gallery, trimmed and converted to WebP.
- `assets/img/`: Figures 1, 2, 5, 7, 8, 9 and 10 rendered from the manuscript PDF at 4×, the embedded full-resolution Figure 3 gallery, and four prototype photos from Figures 12 and 13.
- `assets/film-poster.jpg`: the showcase film's poster frame.
- Benchmark and result numbers are transcribed from the manuscript.

The comparison demo link points to https://zigeng.duckdns.org/harness/demo/.
