// Preloader
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('preloader').classList.add('hidden');
            }, 2200);
        });

        // Custom Cursor
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursorDot');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .service-card, .work-card, .testimonial-dot, .hamburger').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Mobile menu
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        function closeMobile() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Reveal on Scroll
        const revealElements = document.querySelectorAll('.reveal');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));

        // Counter Animation
        const statNumbers = document.querySelectorAll('.stat-number');
        let countersStarted = false;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    statNumbers.forEach(num => {
                        const target = parseInt(num.getAttribute('data-target'));
                        const suffix = num.parentElement.querySelector('.stat-label').textContent.includes('%') ? '%' : '+';
                        let current = 0;
                        const increment = target / 60;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            num.textContent = Math.floor(current) + suffix;
                        }, 30);
                    });
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stats-bar').forEach(el => counterObserver.observe(el));

        // Testimonial Slider
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const testimonialDots = document.querySelectorAll('.testimonial-dot');
        let currentSlide = 0;
        let slideInterval;

        function goToSlide(index) {
            testimonialCards.forEach(card => card.classList.remove('active'));
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            testimonialCards[index].classList.add('active');
            testimonialDots[index].classList.add('active');
            currentSlide = index;
        }

        testimonialDots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(parseInt(dot.getAttribute('data-slide')));
                clearInterval(slideInterval);
                startSlideInterval();
            });
        });

        function startSlideInterval() {
            slideInterval = setInterval(() => {
                goToSlide((currentSlide + 1) % testimonialCards.length);
            }, 5000);
        }

        startSlideInterval();

        // Weave Canvas Animation
        const canvas = document.getElementById('weaveCanvas');
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class WeaveParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '108, 60, 225' : '0, 245, 212';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        const particles = [];
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));

        for (let i = 0; i < particleCount; i++) {
            particles.push(new WeaveParticle());
        }

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        gradient.addColorStop(0, `rgba(108, 60, 225, ${opacity})`);
                        gradient.addColorStop(1, `rgba(0, 245, 212, ${opacity})`);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                const dxMouse = particles[i].x - mouseX;
                const dyMouse = particles[i].y - mouseY;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < 200) {
                    const opacity = (1 - distMouse / 200) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            requestAnimationFrame(animate);
        }

        animate();

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Tilt effect on service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });

window.addEventListener('scroll', () => {
    if (window.innerWidth <= 1200) return;
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
    }
});

document.getElementById("year").textContent = new Date().getFullYear();
