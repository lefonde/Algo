# 🎯 Advanced Algorithms — Exam Question Prediction (Moed A, 19.02.2026)

## Exam Structure Reminder

| Slot | Points | Subject Constraint | Notes |
|------|--------|--------------------|-------|
| Q1 (mandatory) | 29 | Data Structures | One per main subject |
| Q2 (mandatory) | 29 | Linear Programming | One per main subject |
| Q3 (mandatory) | 29 | Expander Graphs | One per main subject |
| Q4 (choose 1 of 2) | 13 | Any subject | Can be from any of the 3 topics |
| Q5 (choose 1 of 2) | 13 | Any subject | Can be from any of the 3 topics |

> [!IMPORTANT]
> **Guaranteed patterns** (based on years of precedent from דימה and גיא טמיר's analysis):
> - At least **1 question directly from the mamans** (homework)
> - At least **1 proof question** that was demonstrated in lectures
> - Typically **1 "hard/new" question** not directly from lectures or mamans
> - Exam is **closed book** — a formula sheet is provided by Asaf

---

## 2025A Exam Analysis (NEW — Most Recent Data Point)

> [!CAUTION]
> The 2025A exam (two variants) has been analyzed. This is the **most recent exam** before our test and carries the heaviest predictive weight.

### 2025A Exam 2 (2024א — מבחן 2, 41 pages):
| Q | Topic | Points | Mapped Prediction |
|---|-------|--------|-------------------|
| 1 | Fibonacci Heap: amortized analysis (Decrease-Key) | 13 | Prediction #3 ✅ |
| 2 | LP: Polytope geometry / vertex definitions | 13 | Prediction #13 ✅ |
| 3 | LP: Vertex coloring formulation + duality | 29 | Prediction #9 ✅ |
| 4 | Expander Graphs: vertex expansion + correctness proof | 29 | Prediction #17 ✅ |
| 5 | Graph expansion bounds (prove/disprove claim) | 13 | Prediction #19 ✅ |

### 2025A Exam 1 (2024ב — מבחן 1, 59 pages):
| Q | Topic | Points | Mapped Prediction |
|---|-------|--------|-------------------|
| 1 | Fibonacci Heap: Decrease-Key amortized analysis | 13 | Prediction #3 ✅ |
| 2 | Splay Tree: operations + state drawing | 29 | Prediction #6 ⬆️ |
| 3 | LP Duality: definitions and proofs | 13 | Prediction #10-11 ✅ |
| 4 | LP: Graph theory formulation (max-weight edge LP) | 29 | Prediction #9 ✅ |
| 5 | Expander Graphs: edge expansion bounds (ה'(G)) | 29 | Prediction #19 ⬆️ |

---

## Scoring Methodology

Each question is scored **1–10** based on the weighted sum of these signals:

| Signal | Weight | Explanation |
|--------|--------|-------------|
| **Taught in lecture this semester** | ×3 | Strongest indicator; Asaf asks proofs only from lectures he actually gave |
| **Appeared in maman (homework)** | ×2.5 | One maman question guaranteed on exam; Asaf "loves" certain questions |
| **Appeared in past exams** | ×2 | Asaf recycles questions; even year-to-year |
| **Appeared in 2025A exam** | ×3 | Most recent exam — strongest recycling signal |
| **Discussed/hinted in WhatsApp by דימה** | ×1.5 | דימה is a repeat student with strong predictive track record |
| **In sample exam on course website** | ×2 | Direct signal from Asaf himself |
| **In course textbook (but not taught)** | ×0.5 | Lower likelihood unless also in maman or sample exam |

Final score = min(10, normalized weighted sum). **Score 8–10** = very likely, **5–7** = medium, **1–4** = lower but possible.

---

## 📊 Question Prediction Table (Updated with 2025A Data)

### Subject 1: Data Structures (Fibonacci Heaps, Splay Trees, Dynamic Lists)

| # | Question | Score | Source | Rationale |
|---|----------|-------|--------|-----------|
| 1 | **Prove the logarithmic upper bound on degree in Fibonacci Heap** (D(n) = O(log n)) | **10** | Lecture (partially), Maman 11 Q4, Past exams, **2025A** (both variants had Fib Heap), דימה "99%" | Still the top prediction. 2025A confirmed Fibonacci Heaps appear in every exam. Both variants had a Fibonacci Heap question (Decrease-Key amortized). Since 2025A tested Decrease-Key, Asaf may now test the D(n) bound or Extract-Min instead. |
| 2 | **Amortized analysis of Extract-Min in Fibonacci Heap** | **10** ⬆️ | Lecture 1, Past exams, Formula sheet, **2025A tested Decrease-Key → Extract-Min now more likely** | **Upgraded from 9→10.** Since 2025A already tested Decrease-Key in both variants, Asaf is very likely to switch to Extract-Min or D(n) bound for 2026. The amortized analysis pattern remains identical. |
| 3 | **Amortized analysis of Decrease-Key in Fibonacci Heap** | **5** ⬇️ | Lecture 3, **2025A** (appeared in both variants!) | **Downgraded from 7→5.** This was literally the Q1 in both 2025A variants. Asaf rarely repeats the exact same question in consecutive exams. Still possible but less likely now. |
| 4 | **MF (Move-to-Front) Competitiveness Theorem**: Prove MF is 2-competitive against optimal offline | **9** | Lecture 2 (full proof), Maman 12, Past exams | Unchanged. 2025A did NOT test dynamic lists at all — this means it's "due" for 2026. Asaf gave the full proof in lecture 2. |
| 5 | **Construct input sequence S where FC/MF cost ratio > 2** (or approaches some constant) | **8** | Maman 12 Q1 | Unchanged. Not tested in 2025A, so still fresh material for 2026. |
| 6 | **Splay Trees: operations, state drawing, analysis** | **9** ⬆️ | Maman 12 Q2b, Lecture 2, **2025A Exam 1 Q2 (29pts!)** | **Upgraded from 6→9.** Splay Trees appeared as a full 29-point question in 2025A Exam 1! This confirms Asaf considers Splay Trees exam-worthy at the highest weight. Could appear again or in a variant form. |
| 7 | **Dynamic list: define potential function for a new data structure and perform amortized analysis** | **8** ⬆️ | Maman 11 Q1, Past exams, **NOT in 2025A → "due"** | **Upgraded from 7→8.** Dynamic lists were completely absent from 2025A. Given no recent testing, this topic is fresh and likely for 2026. |
| 8 | **Worst-case sequences for Splay Trees / FC / TR algorithms**: compute exact running times | **6** | Textbook, Sample exam, Maman 12 | Unchanged. |

---

### Subject 2: Linear Programming (LP formulation, Duality, Simplex, Ellipsoid, Approximation)

| # | Question | Score | Source | Rationale |
|---|----------|-------|--------|-----------|
| 9 | **Write LP formulation (primal) for a graph problem and derive its dual** | **10** | Maman 14 Q1, Maman 15 Q1, Lecture 4, Past exams, Sample exam, **2025A** (both variants!) | Still #1 LP prediction. 2025A had LP graph formulation in both variants (vertex coloring + max-weight edge). This is practically guaranteed every exam. |
| 10 | **Prove Weak Duality Theorem** | **7** ⬇️ | Lecture 3, **2025A Exam 1 Q3 tested LP duality definitions** | **Downgraded from 8→7.** 2025A Exam 1 already had an LP Duality question (Q3, 13pts). Asaf may vary the angle — could still appear but with different framing. |
| 11 | **Prove Complementary Slackness conditions** | **7** ⬇️ | Lecture 3, Past exams | **Downgraded from 8→7.** Same reasoning as #10 — duality proofs were tested in 2025A. |
| 12 | **Use LP duality to prove optimality / design approximation algorithm** (e.g., Dual-fitting for Set Cover) | **9** | Lecture 4 (example solved), Past exams | Unchanged. This was NOT directly tested in 2025A (the 2025A questions were formulation-focused, not approximation-focused). Still very likely. |
| 13 | **Vertex definitions and equivalences**: prove that definitions of vertex are equivalent | **8** ⬆️ | Maman 13, Lecture, **2025A Exam 2 Q2 (13pts!)**, דימה "suspicious" | **Upgraded from 7→8.** 2025A Exam 2 literally had LP polytope geometry as Q2. דימה was right to be suspicious! This confirms the topic is in active rotation. |
| 14 | **Prove feasibility ↔ optimization reduction** (Section 5.1 of LP textbook) | **7** | Course website, Sample exam, Textbook | Unchanged. Not tested in 2025A. |
| 15 | **Simplex-based proof** (understand simplex algorithm and use it in a proof) | **7** | Past exams, דימה's guidance | Unchanged. |
| 16 | **LP formulation for Maximum Matching in bipartite graph + duality proof** | **8** | Maman 15 Q1, Sample exam, Past exams | Unchanged. Specific variant not tested in 2025A (which had different graph problems). |

---

### Subject 3: Expander Graphs (Edge/Vertex Expansion, Diameter, Spectral Theory)

| # | Question | Score | Source | Rationale |
|---|----------|-------|--------|-----------|
| 17 | **Prove: good vertex expansion ⟹ logarithmic diameter** (ball-growing argument) | **10** | Lecture 6, Past exams, **2025A Exam 2 Q4 (29pts!)**, דימה "will definitely appear" | Still top prediction. 2025A Exam 2 Q4 was exactly vertex expansion + correctness proof at 29 points! Asaf clearly loves this question. May vary the exact formulation but concept will likely reappear. |
| 18 | **Find eigenvalues of a d-regular (multi)graph** using trace trick | **9** | Lecture 7, Maman 15 Q4, Past exams | Unchanged. Not tested in 2025A — so still fresh. |
| 19 | **Edge expansion bounds in d-regular graph** | **8** ⬆️ | Lecture 5, Maman 15 Q3, **2025A** (both variants tested expansion!) | **Upgraded from 7→8.** Appeared in both 2025A variants — Exam 1 Q5 (29pts on edge expansion h'(G)) and Exam 2 Q5 (13pts on expansion bounds). Clearly a staple. |
| 20 | **Prove: d-regular graph is an edge expander ⟹ vertex expander** | **6** | Maman 16 Q2, Lecture 6 | Unchanged. |
| 21 | **BPP/RP amplification**: prove probability amplification by repeated independent runs | **8** | Lecture 7, Past exams, דימה "gift question" | Unchanged. Not tested in 2025A — still fresh and "due." |
| 22 | **Prove Ramanujan graph construction is efficient** | **7** | Lecture 7, דימה's hint | Unchanged. |
| 23 | **Maman 16 Q3: Prove edge expansion ⟹ mixing/random-walk properties** | **6** | Maman 16 Q3, Past exam | Unchanged. |
| 24 | **Maman 16 Q4: Spectral gap ⟹ expansion property proof** | **5** | Maman 16 Q4, Past exam | Unchanged. |

---

### Mixed/Cross-Topic Questions (13-point questions)

| # | Question | Score | Source | Rationale |
|---|----------|-------|--------|-----------|
| 25 | **Fibonacci Heap: Prove D(n) ≤ log_φ(n)** (short proof version) | **10** ⬆️ | Lecture 2 (partial), Maman 11 Q4, **2025A tested Decrease-Key → D(n) now top candidate** | **Upgraded from 9→10.** Since 2025A already tested Decrease-Key, the D(n) bound is the prime Fibonacci Heap candidate for 2026. |
| 26 | **LP: Given primal+dual, verify optimality using Complementary Slackness** | **7** | Maman 13 Q2, Lecture 3 | Unchanged. |
| 27 | **Tight vs non-tight constraints: identify tight constraints and use them** | **6** | Maman 14, Lecture discussion | Unchanged. |
| 28 | **Polynomial tree (custom data structure)**: analyze structure and prove properties | **5** | Maman 11 Q2 | Unchanged. |
| 29 | **Worst-case input for comparison of two online algorithms** (e.g., FC vs MF vs TR) | **8** ⬆️ | Maman 12 Q1, Past exams, **NOT in 2025A → "due"** | **Upgraded from 7→8.** Online algorithm comparisons were absent from 2025A. Since dynamic lists weren't tested, this fresh topic is more likely for 2026. |
| 30 | **Approximation algorithm using LP relaxation** for a new problem | **6** | Lecture 4, Textbook | Unchanged. |

---

## 📋 Ranked Study Priority (Updated)

| Priority | Question #s | Topic |
|----------|-------------|-------|
| 🔴 Critical (8-10) | 1, 2, 4, 6, 9, 12, 17, 18, 21, 25 | Core proofs + confirmed by 2025A + "due" topics |
| 🟠 High (7) | 5, 7, 10, 11, 13, 14, 15, 16, 19, 22, 26, 29 | Maman questions + past exam staples |
| 🟡 Medium (5-6) | 3, 8, 20, 23, 27, 28, 30 | Tested recently (lower repeat chance) or less certain |
| 🟢 Lower (1-4) | 24 | Possible but low probability |

---

## Key Insights from WhatsApp Analysis

1. **"Proofs only from lectures"** — Asaf only asks to reproduce proofs he actually demonstrated in class.
2. **"Not taught ≠ not on exam"** — However, *technical questions* (not proofs) can come from any part of the textbook material.
3. **Strong Duality NOT proved this semester** → will NOT appear as a proof question.
4. **Shadow prices (מחיר מתואם) NOT taught** → will NOT appear.
5. **Farkas Lemma NOT taught** → will NOT appear.
6. **Mixing Lemma & Expansion Lemma NOT proved** → will NOT appear as proof questions.
7. **Fibonacci logarithmic bound** — "every semester he proves it and every other exam it appears" — study even though he only partially covered it.
8. **Asaf recycles questions** — even year to year, same exact questions can appear.
9. **Moed B is harder** — Asaf explicitly said this in the last lecture.
10. **Formula sheet provided** — standard formulas are given, but you need to *know what to do with them*.
11. **Vertex definitions** — 2025A CONFIRMED דימה's suspicion: polytope geometry appeared as Q2 in Exam 2!
12. **One "hard" question** — there's usually one 29-point question that's very challenging.

---

## 🔄 Trend Deviation Analysis (2025A vs Historical Patterns)

> [!WARNING]
> **Key deviations in 2025A that signal what to expect in 2026:**

### ⬆️ Surprises (Higher than expected in 2025A)
| Topic | Expected | Actual in 2025A | Implication for 2026 |
|-------|----------|-----------------|---------------------|
| **Splay Trees (29pts)** | Medium (6/10) — typically a 13pt question | Full 29-point question in Exam 1 | Splay Trees are now confirmed as "big question" material. Study the full proof and operations thoroughly. |
| **Edge Expansion at 29pts** | Medium (7/10) — typically 13pt | 29-point question in Exam 1 | Asaf values expansion proofs higher than expected. Prepare deep expansion proofs. |
| **Vertex/Polytope Definitions** | Medium (7/10) — דימה was "suspicious" | Appeared! 13pt in Exam 2 | דימה's instinct was correct. When he flags something as "suspicious," take it seriously. |

### ⬇️ Absences (Expected but NOT in 2025A)
| Topic | Expected Score | Appeared in 2025A? | Implication for 2026 |
|-------|---------------|---------------------|---------------------|
| **Dynamic Lists (MF/FC/TR)** | 9/10 — "core proof" | ❌ Completely absent | **VERY likely for 2026.** Absence creates a "gap" — Asaf tends to rotate topics. MF competitiveness is overdue. |
| **BPP/RP Amplification** | 8/10 — "gift question" | ❌ Not tested | **Still fresh** for 2026. דימה called it a "gift question" and it connects to expander graphs. |  
| **Eigenvalue Trace Trick** | 9/10 | ❌ Not tested | **Prime candidate** for 2026. Asaf taught it in lecture 7 and it hasn't been tested yet. |
| **LP Approximation Algorithm** | 9/10 (via duality) | ❌ Focus was on formulation, not approximation | 2025A tested pure formulation. 2026 may test the approximation/dual-fitting angle instead. |

### 🔁 Confirmed Patterns
| Pattern | Confirmation from 2025A |
|---------|------------------------|
| Fibonacci Heaps appear every exam | ✅ Both variants had Fib Heap Q1 |
| LP Graph formulation is a staple | ✅ Both variants had LP+Graph (vertex coloring / max-weight) |
| Expander graphs always tested | ✅ Both variants had expansion questions |
| Asaf recycles across variants | ✅ Q1 was identical topic (Decrease-Key) in both variants |
| 13pt questions can be from any topic | ✅ 13pt questions covered DS, LP, and Graphs |
