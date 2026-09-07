# PyMacs Academic Research Paper

> **Paper Title:** PyMacs: An Operating System in Python with Reactive Document Object Model, Antigravity Physics, and Bi-Directional JSON=XML=DOM Algebraic Equivalence  
> **Author:** Dr. Bheemaiah Anil K (`bheemaiah@alumni.iitm.ac.in`)  
> **Affiliation:** Indian Institute of Technology Madras (IITM) Alumnus  
> **Official Monograph:** [https://pymacs.wordpress.com](https://pymacs.wordpress.com)  
> **Status:** arXiv Preprint Format Ready

---

## Abstract

Traditional operating systems enforce a rigid ontological divide between low-level kernel abstractions (processes, address spaces, POSIX file descriptors) and high-level user interface representations (render trees, layout boxes, scene graphs). In this paper, we present **PyMacs**, a browser-based microkernel operating system written in Python that unifies operating system primitives and user interface objects through an algebraic category isomorphism: $\text{JSON} \cong \text{XML} \cong \text{DOM}$. By treating code as a first-class Document Object Model (DOM) entity, PyMacs achieves bi-directional transpilability wherein arbitrary hierarchical state matrices can be transformed through Higher-Order Functions (HOF) into reactive visual trees and formally validated via Provable Markup Language (PML) schemas.

To bridge interactive graphics and kinetic state manipulation, PyMacs incorporates an *Antigravity Physics Engine* operating at 60 FPS, subjecting live DOM nodes to gravitational vector fields ($g_y < 0$), electrostatic Coulomb repulsive charges, Hookean spring dampers, and real-time pointer perturbation. System tasks are scheduled cooperatively via an extended hybrid model combining Python `asyncio` event loops, FreeRTOS edge telemetry primitives, and distributed HTCondor shadow daemons with cryptographic SHA-256 Merkle proofs.

---

## File Inventory

- `pymacs_paper.tex`: Complete standard LaTeX source formatted for 2-column arXiv preprint submission.
- `references.bib`: BibTeX bibliography featuring verified seminal works (ACM, IEEE, W3C) without hallucinated or fabricated URLs.
- `../.github/workflows/paper.yml`: Automated GitHub Action to compile `pymacs_paper.tex` into a release-ready PDF on push.

---

## How to Compile into PDF

### 1. Using `pdflatex` & `bibtex`
```bash
cd paper
pdflatex pymacs_paper.tex
bibtex pymacs_paper
pdflatex pymacs_paper.tex
pdflatex pymacs_paper.tex
```

### 2. Using `latexmk`
```bash
cd paper
latexmk -pdf pymacs_paper.tex
```

### 3. Using `tectonic` (Zero-dependency modern compiler)
```bash
tectonic pymacs_paper.tex
```

---

## BibTeX Citation

```bibtex
@article{bheemaiah2026pymacs,
  author    = {Bheemaiah Anil K},
  title     = {PyMacs: An Operating System in Python with Reactive Document Object Model, Antigravity Physics, and Bi-Directional JSON=XML=DOM Algebraic Equivalence},
  journal   = {arXiv preprint},
  year      = {2026},
  url       = {https://pymacs.wordpress.com},
  note      = {Alumnus, Indian Institute of Technology Madras (IITM)}
}
```
