# FunCAD project site

This is a dependency-free static project site for **Can It Actually Work? Synthesizing Functional CAD Mechanisms**.

Hosted on UCL: https://zigeng.duckdns.org/funcad/.
Deployment paths and Caddy configuration are documented in `../deploy/ucl/README.md`.

Serve the repository root with a static server; the Figure 7 GLB viewers use ES modules and do not run from a `file://` page:

```bash
python -m http.server 8791
```

Then visit `http://127.0.0.1:8791/project_site/`.

The page uses only local files. The project video is the Mechanical Benchmark Showcase, placed after the Figure 8 repair example and before FunCADBench. The public narrative goes from the problem and Figure 7 failure cases, through the Figure 5 Harness and Figure 8 repair example, then to the video, FunCADBench, and the experiments. The first screen exposes the Paper and Comparison Demo links; Code repository and HF dataset are marked Pending. The problem section includes two draggable local failure-part viewers. The paper PDF is a web-sized copy of the supplied manuscript, and the in-page figures are crops of Figures 1, 2, 3, 5, 6, 7, and 8 from that manuscript. Benchmark numbers are transcribed from the manuscript.

The benchmark family index is hidden by default; selecting a filter reveals collapsed family cards, and available family renders open inline with the selected card. The full comparison viewer is linked at https://zigeng.duckdns.org/harness/demo/.
