/* ============================================
   LOBA PRO-TOOLS 2026 — Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // 1. NAVBAR SCROLL EFFECT
    // ===========================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // ===========================
    // 2. HERO PARTICLES
    // ===========================
    const particlesContainer = document.getElementById('heroParticles');

    function createParticles() {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${6 + Math.random() * 6}s`;

            const colors = ['#0070ff', '#00a3ff', '#ff2d55', '#8b5cf6'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.width = `${2 + Math.random() * 3}px`;
            particle.style.height = particle.style.width;

            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // ===========================
    // 3. CALCULATOR
    // ===========================
    const formatPresets = document.getElementById('formatPresets');
    const customFormatBtn = document.getElementById('customFormatBtn');
    const customFormatInputs = document.getElementById('customFormatInputs');
    const customWidth = document.getElementById('customWidth');
    const customHeight = document.getElementById('customHeight');
    const totalArea = document.getElementById('totalArea');
    const areaSlider = document.getElementById('areaSlider');
    const gamaBlue = document.getElementById('gamaBlue');
    const gamaRed = document.getElementById('gamaRed');

    // Calculator state
    let calcState = {
        tileW: 60,
        tileH: 60,
        area: 25,
        gama: 'blue', // 'blue' or 'red'
        isCustom: false
    };

    // Pricing data
    const pricing = {
        blue: {
            kit: { units: 200, price: 18.80, label: 'Kit Iniciación (100+100+Alicate)' },
            bag: { units: 300, price: 10.65, label: 'Bolsa 300 uds' },
            box: { units: 3000, price: 100.80, label: 'Box 3.000 uds' }
        },
        red: {
            kit: { units: 200, price: 16.20, label: 'Kit Iniciación (100+100+Alicate)' },
            bag: { units: 300, price: 7.85, label: 'Bolsa 300 uds' },
            box: { units: 3000, price: 72.70, label: 'Box 3.000 uds' }
        }
    };

    // Competitor average pricing (for savings calculation)
    const competitorAvg = {
        kit: 26.30,   // Average of competitors
        bag: 14.00,
        box: 120.00
    };

    // Calculate clips per m²
    // Formula calibrated so 60×60 = 18 clips/m²
    function clipsPerM2(w, h) {
        return Math.ceil(540 * (1 / w + 1 / h));
    }

    // Find best pack recommendation
    function getRecommendation(totalClips, gama) {
        const p = pricing[gama];
        const recommendations = [];

        // Option 1: Boxes only
        const boxCount = Math.ceil(totalClips / p.box.units);
        const boxTotal = boxCount * p.box.price;
        const boxWaste = (boxCount * p.box.units) - totalClips;

        recommendations.push({
            label: `${boxCount}× ${p.box.label}`,
            total: boxTotal,
            units: boxCount * p.box.units,
            waste: boxWaste,
            type: 'box',
            count: boxCount
        });

        // Option 2: Bags only
        const bagCount = Math.ceil(totalClips / p.bag.units);
        const bagTotal = bagCount * p.bag.price;
        const bagWaste = (bagCount * p.bag.units) - totalClips;

        recommendations.push({
            label: `${bagCount}× ${p.bag.label}`,
            total: bagTotal,
            units: bagCount * p.bag.units,
            waste: bagWaste,
            type: 'bag',
            count: bagCount
        });

        // Option 3: Mix of boxes and bags
        if (totalClips > p.box.units) {
            const mixBoxes = Math.floor(totalClips / p.box.units);
            const remaining = totalClips - (mixBoxes * p.box.units);
            const mixBags = Math.ceil(remaining / p.bag.units);
            const mixTotal = (mixBoxes * p.box.price) + (mixBags * p.bag.price);

            let mixLabel = `${mixBoxes}× Box 3.000`;
            if (mixBags > 0) mixLabel += ` + ${mixBags}× Bolsa 300`;

            recommendations.push({
                label: mixLabel,
                total: mixTotal,
                units: (mixBoxes * p.box.units) + (mixBags * p.bag.units),
                waste: ((mixBoxes * p.box.units) + (mixBags * p.bag.units)) - totalClips,
                type: 'mix',
                count: mixBoxes + mixBags
            });
        }

        // Sort by total price
        recommendations.sort((a, b) => a.total - b.total);
        return recommendations.slice(0, 2);
    }

    // Update calculator results
    function updateCalculator() {
        const cpm2 = clipsPerM2(calcState.tileW, calcState.tileH);
        const totalClips = Math.ceil(cpm2 * calcState.area);

        // Update result values
        document.getElementById('resultClips').textContent = totalClips.toLocaleString('es-ES');
        document.getElementById('resultClipsM2').textContent = `${cpm2} clips/m²`;
        document.getElementById('resultFormat').textContent = `${calcState.tileW}×${calcState.tileH}`;
        document.getElementById('resultArea').textContent = calcState.area;

        // Update badge
        const badge = document.getElementById('resultsBadge');
        badge.textContent = calcState.gama === 'blue' ? 'GAMA BLUE' : 'GAMA RED';
        badge.className = `results-badge ${calcState.gama === 'red' ? 'red' : ''}`;

        // Update recommendations
        const recs = getRecommendation(totalClips, calcState.gama);
        const recContainer = document.getElementById('resultsRecommendation');

        let recHTML = '';
        recs.forEach((rec, i) => {
            recHTML += `
                <div class="rec-card" style="${i === 0 ? 'border-color: var(--blue-primary);' : ''}">
                    <h4>${i === 0 ? '✅ Recomendado' : '📦 Alternativa'}</h4>
                    <div class="rec-price">${rec.total.toFixed(2).replace('.', ',')} €</div>
                    <div class="rec-detail">${rec.label} (${rec.units.toLocaleString('es-ES')} clips, sobran ${rec.waste})</div>
                </div>
            `;
        });
        recContainer.innerHTML = recHTML;

        // Calculate savings vs competitor
        if (recs.length > 0) {
            const bestPrice = recs[0].total;
            const competitorPrice = recs[0].type === 'box'
                ? recs[0].count * competitorAvg.box
                : recs[0].type === 'bag'
                    ? recs[0].count * competitorAvg.bag
                    : (Math.floor(totalClips / 3000) * competitorAvg.box) + (Math.ceil((totalClips % 3000) / 300) * competitorAvg.bag);

            const saving = competitorPrice - bestPrice;

            if (saving > 0) {
                document.getElementById('resultsSaving').innerHTML = `
                    <div class="saving-banner">
                        <div class="saving-amount">🎉 Ahorras ${saving.toFixed(2).replace('.', ',')} € vs. la media del mercado</div>
                        <div class="saving-detail">Comparado con precios medios en Amazon, ManoMano y retail</div>
                    </div>
                `;
            }
        }

        // Animate results
        document.querySelectorAll('.result-value').forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // trigger reflow
            el.style.animation = 'resultPop 0.3s ease-out';
        });
    }

    // Add CSS animation for results
    const style = document.createElement('style');
    style.textContent = `
        @keyframes resultPop {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Format preset buttons
    formatPresets.addEventListener('click', (e) => {
        const btn = e.target.closest('.format-btn');
        if (!btn) return;

        // Update active state
        formatPresets.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn === customFormatBtn) {
            calcState.isCustom = true;
            customFormatInputs.style.display = 'flex';
            calcState.tileW = parseInt(customWidth.value) || 60;
            calcState.tileH = parseInt(customHeight.value) || 60;
        } else {
            calcState.isCustom = false;
            customFormatInputs.style.display = 'none';
            calcState.tileW = parseInt(btn.dataset.w);
            calcState.tileH = parseInt(btn.dataset.h);
        }

        updateCalculator();
    });

    // Custom format inputs
    customWidth.addEventListener('input', () => {
        calcState.tileW = parseInt(customWidth.value) || 10;
        updateCalculator();
    });

    customHeight.addEventListener('input', () => {
        calcState.tileH = parseInt(customHeight.value) || 10;
        updateCalculator();
    });

    // Area input + slider sync
    totalArea.addEventListener('input', () => {
        calcState.area = parseFloat(totalArea.value) || 1;
        areaSlider.value = Math.min(calcState.area, 200);
        updateCalculator();
    });

    areaSlider.addEventListener('input', () => {
        calcState.area = parseFloat(areaSlider.value);
        totalArea.value = calcState.area;
        updateCalculator();
    });

    // Gama selector
    gamaBlue.addEventListener('click', () => {
        calcState.gama = 'blue';
        gamaBlue.classList.add('active');
        gamaRed.classList.remove('active');
        updateCalculator();
    });

    gamaRed.addEventListener('click', () => {
        calcState.gama = 'red';
        gamaRed.classList.add('active');
        gamaBlue.classList.remove('active');
        updateCalculator();
    });

    // Initial calculation
    updateCalculator();

    // ===========================
    // 4. FAQ ACCORDION
    // ===========================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked (if wasn't active)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===========================
    // 5. SCROLL REVEAL ANIMATION
    // ===========================
    const revealElements = document.querySelectorAll(
        '.section-header, .product-card, .calc-container, .comparison-table-wrapper, ' +
        '.comparison-insight, .faq-item, .download-card, .contact-wrapper, .joint-sizes, .products-showcase'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===========================
    // 6. SMOOTH SCROLL
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===========================
    // 7. CONTACT FORM (Web3Forms)
    // ===========================
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos la redirección por defecto

        const submitBtn = document.getElementById('contactSubmit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = '⏳ Enviando...';
        submitBtn.style.background = '#666';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                submitBtn.textContent = '✅ ¡Mensaje Enviado!';
                submitBtn.style.background = 'linear-gradient(135deg, #34c759, #30d158)';
                contactForm.reset();
            } else {
                submitBtn.textContent = '❌ Error al enviar';
                submitBtn.style.background = '#ff3b30';
                console.error('Web3Forms Error:', data);
            }
        } catch (error) {
            submitBtn.textContent = '❌ Error de red';
            submitBtn.style.background = '#ff3b30';
            console.error('Fetch Error:', error);
        }

        // Restaurar el botón después de 5 segundos
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 5000);
    });

    // ===========================
    // 8. TABLE ROW HOVER HIGHLIGHT
    // ===========================
    const tableRows = document.querySelectorAll('.comparison-table tbody tr:not(.row-loba)');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.querySelectorAll('.price-cell').forEach(cell => {
                const text = cell.textContent.trim().replace('€', '').replace(',', '.').trim();
                const price = parseFloat(text);
                if (!isNaN(price)) {
                    // Compare with LOBA RED (cheapest)
                    const colIndex = cell.cellIndex;
                    const lobaRedRow = document.querySelector('.row-red');
                    if (lobaRedRow) {
                        const lobaCell = lobaRedRow.cells[colIndex];
                        const lobaText = lobaCell.textContent.trim().replace('€', '').replace(',', '.').trim();
                        const lobaPrice = parseFloat(lobaText);
                        if (!isNaN(lobaPrice) && price > lobaPrice) {
                            const diff = ((price - lobaPrice) / lobaPrice * 100).toFixed(0);
                            cell.title = `+${diff}% más caro que LOBA RED`;
                        }
                    }
                }
            });
        });
    });

    // ===========================
    // 9. COUNTER ANIMATION (Hero stats)
    // ===========================
    function animateValue(element, start, end, duration, suffix = '') {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic

            const current = start + (end - start) * easeProgress;
            element.textContent = current.toFixed(suffix === '€' ? 3 : 0).replace('.', ',') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ===========================
    // 10. PRELOADER EFFECT
    // ===========================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

});
