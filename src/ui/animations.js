/**
 * UI Animations
 * Visual effects and animations
 */

// Confetti configuration
const CONFETTI_COLORS = ['#1DB954', '#1ed760', '#ffffff', '#ffd700', '#ff69b4', '#00bfff'];
const CONFETTI_COUNT = 100;

let confettiParticles = [];
let confettiAnimationId = null;

/**
 * Launch confetti celebration
 */
export function launchConfetti(duration = 3000) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    confettiParticles = Array.from({ length: CONFETTI_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngle: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.1 + 0.05,
        speed: Math.random() * 3 + 2,
        wobble: Math.random() * 10
    }));

    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiParticles.forEach(particle => {
            particle.tiltAngle += particle.tiltSpeed;
            particle.y += particle.speed;
            particle.x += Math.sin(particle.wobble) * 0.5;
            particle.wobble += 0.05;
            particle.tilt = Math.sin(particle.tiltAngle) * 15;

            ctx.beginPath();
            ctx.lineWidth = particle.r;
            ctx.strokeStyle = particle.color;
            ctx.moveTo(particle.x + particle.tilt + particle.r / 2, particle.y);
            ctx.lineTo(particle.x + particle.tilt, particle.y + particle.tilt + particle.r / 2);
            ctx.stroke();
        });

        // Reset particles that go off screen
        confettiParticles.forEach(particle => {
            if (particle.y > canvas.height) {
                particle.y = -20;
                particle.x = Math.random() * canvas.width;
            }
        });

        if (elapsed < duration) {
            confettiAnimationId = requestAnimationFrame(animate);
        } else {
            // Fade out
            fadeOutConfetti(ctx, canvas);
        }
    }

    animate();
}

/**
 * Fade out confetti
 */
function fadeOutConfetti(ctx, canvas) {
    let opacity = 1;

    function fade() {
        opacity -= 0.05;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = opacity;

        confettiParticles.forEach(particle => {
            particle.y += particle.speed;
            ctx.beginPath();
            ctx.lineWidth = particle.r;
            ctx.strokeStyle = particle.color;
            ctx.moveTo(particle.x + particle.tilt + particle.r / 2, particle.y);
            ctx.lineTo(particle.x + particle.tilt, particle.y + particle.tilt + particle.r / 2);
            ctx.stroke();
        });

        if (opacity > 0) {
            requestAnimationFrame(fade);
        } else {
            ctx.globalAlpha = 1;
            confettiParticles = [];
        }
    }

    fade();
}

/**
 * Stop confetti
 */
export function stopConfetti() {
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    confettiParticles = [];

    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Add shake animation to element
 */
export function shake(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

/**
 * Add pulse animation to element
 */
export function pulse(element) {
    element.classList.add('pulse');
    setTimeout(() => element.classList.remove('pulse'), 500);
}

/**
 * Animate score counter
 */
export function animateScore(element, start, end, duration = 500) {
    const startTime = performance.now();
    const diff = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        const current = Math.round(start + diff * eased);
        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Smooth screen transition
 */
export function transitionToScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');

    // Small delay for transition
    setTimeout(() => {
        toScreen.classList.add('active');
    }, 50);
}
