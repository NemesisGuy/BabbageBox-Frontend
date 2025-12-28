🔥 WHAT YOU SHOULD ADD (THIS IS THE IMPORTANT PART)
1️⃣ Core viewport breakpoints (NON-NEGOTIABLE)

These cover ~99% of real users:

Category Width × Height Why
Small mobile 360 × 640 Most Android phones
iPhone baseline 375 × 667 Your current SE target
Large mobile 390 × 844 Modern iPhones
Phablet 412 × 915 Large Androids
Tablet portrait 768 × 1024 iPad baseline
Tablet landscape 1024 × 768 Critical layout flip
Small laptop 1280 × 800 Budget laptops
Standard laptop 1366 × 768 Still huge globally
Desktop 1440 × 900 Normal dev screens
Large desktop 1920 × 1080 Full HD baseline
Ultra-wide sanity 2560 × 1440 Layout stress test

💡 These should replace 90% of your device presets.

2️⃣ Orientation testing (people forget this)

For each mobile & tablet width, test:

Portrait ✅

Landscape ✅

Landscape is where:

Nav bars break

Hero sections explode

“100vh” bugs appear

3️⃣ Zoom & text stress tests (VERY IMPORTANT)

Add manual checks for:

🔍 125% zoom

🔍 150% zoom

🅰️ Browser text size increased

This catches:

Fixed-height containers

Overflow-hidden disasters

Accessibility failures

🧠 A PRO SETUP (what I personally use)

Primary workflow:

Responsive mode

Drag from 320 → 1440

Stop at:

360

375

390

768

1024

1366

1920

Secondary checks:

Landscape mobile

Tablet landscape

125% zoom

🎯 TL;DR — YOUR ACTION LIST
❌ Remove

Most named phone models

Nest Hub devices

Redundant Android/iPhone variants

✅ Add

Width-based breakpoints

Tablet landscape checks

Desktop & ultrawide sizes

Zoom & text scaling tests
