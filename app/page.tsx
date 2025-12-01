'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function Home() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const scriptsLoaded = useRef({ three: false, gsap: false, scrollTrigger: false });

  useEffect(() => {
    // Wait for all scripts to load
    const initAnimations = () => {
      if (!scriptsLoaded.current.three || !scriptsLoaded.current.gsap || !scriptsLoaded.current.scrollTrigger) {
        return;
      }

      // Custom Cursor
      const cursor = document.querySelector('.cursor') as HTMLElement;
      if (cursor) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        const handleMouseMove = (e: MouseEvent) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        };

        document.addEventListener('mousemove', handleMouseMove);

        const animateCursor = () => {
          cursorX += (mouseX - cursorX) * 1;
          cursorY += (mouseY - cursorY) * 1;
          cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
          requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .capability-card-large, .approach-pillar');
        interactiveElements.forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
      }

      // Three.js Background
      if (canvasContainerRef.current && (window as any).THREE) {
        const THREE = (window as any).THREE;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainerRef.current.appendChild(renderer.domElement);

        // Create particle system
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 12000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 200;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.18,
          color: 0x00ffff,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 25;

        // Mouse movement effect
        let mouseXThree = 0, mouseYThree = 0;
        const handleMouseMoveThree = (e: MouseEvent) => {
          mouseXThree = (e.clientX / window.innerWidth) * 2 - 1;
          mouseYThree = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        document.addEventListener('mousemove', handleMouseMoveThree);

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);

          particlesMesh.rotation.x += 0.0015;
          particlesMesh.rotation.y += 0.002;

          // React to mouse
          particlesMesh.rotation.x += mouseYThree * 0.0005;
          particlesMesh.rotation.y += mouseXThree * 0.0005;

          renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
      }

      // GSAP Animations
      if ((window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        // Nav shrink on scroll
        ScrollTrigger.create({
          start: 'top -80',
          end: 99999,
          toggleClass: { className: 'scrolled', targets: '#nav' }
        });

        // Hero animations
        gsap.to('.hero .word', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.5
        });

        gsap.to('.hero-subtitle', {
          opacity: 1,
          duration: 1,
          delay: 1.5,
          ease: 'power3.out'
        });

        gsap.to('.hero-cta', {
          opacity: 1,
          duration: 1,
          delay: 2,
          ease: 'power3.out'
        });

        gsap.to('.scroll-indicator', {
          opacity: 1,
          duration: 1,
          delay: 2.5,
          ease: 'power3.out'
        });


        // Approach section - Parallax & Animations
        // Parallax background layers
        gsap.to('.layer-1', {
          y: -80,
          scrollTrigger: {
            trigger: '.approach-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });

        gsap.to('.layer-2', {
          y: -120,
          x: 50,
          scrollTrigger: {
            trigger: '.approach-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        });

        gsap.to('.layer-3', {
          y: -60,
          scrollTrigger: {
            trigger: '.approach-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        });

        // Approach label
        gsap.to('.approach-label', {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.approach-section',
            start: 'top 70%'
          }
        });

        // Approach title words
        gsap.to('.approach-word', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.approach-title',
            start: 'top 75%'
          }
        });

        // Approach pillars
        gsap.utils.toArray('.approach-pillar').forEach((pillar: any, i: number) => {
          gsap.to(pillar, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.2,
            scrollTrigger: {
              trigger: pillar,
              start: 'top 80%'
            }
          });
        });

        // Approach statement
        gsap.to('.approach-statement', {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.approach-statement',
            start: 'top 80%'
          }
        });

        // Capability cards horizontal scroll animation
        const capabilitiesScroll = document.querySelector('.capabilities-scroll');
        if (capabilitiesScroll) {
          // Initial hint animation
          ScrollTrigger.create({
            trigger: '.tech-scroll-container',
            start: 'top 60%',
            once: true,
            onEnter: () => {
              gsap.to(capabilitiesScroll, {
                scrollLeft: 250,
                duration: 1.2,
                ease: 'power2.out'
              });
              gsap.to(capabilitiesScroll, {
                scrollLeft: 0,
                duration: 1.2,
                delay: 1.8,
                ease: 'power2.inOut'
              });
            }
          });

          // Animate cards on scroll
          gsap.utils.toArray('.capability-card-large').forEach((card: any, i: number) => {
            gsap.from(card, {
              opacity: 0,
              scale: 0.9,
              y: 50,
              duration: 0.8,
              delay: i * 0.15,
              scrollTrigger: {
                trigger: '.capabilities-scroll',
                start: 'top 70%'
              }
            });
          });
        }

        // Scroll hint animation
        gsap.from('.scroll-hint', {
          opacity: 0,
          y: 20,
          duration: 1,
          delay: 2.5,
          scrollTrigger: {
            trigger: '.scroll-hint',
            start: 'top 90%'
          }
        });

        // Section titles
        gsap.utils.toArray('.section-title').forEach((title: any) => {
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: title,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        // Anamnesis parallax
        gsap.to('.anamnesis-visual', {
          y: -50,
          scrollTrigger: {
            trigger: '.anamnesis',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initAnimations, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        onLoad={() => {
          scriptsLoaded.current.three = true;
        }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        onLoad={() => {
          scriptsLoaded.current.gsap = true;
        }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
        onLoad={() => {
          scriptsLoaded.current.scrollTrigger = true;
        }}
      />

      {/* Custom Cursor */}
      <div className="cursor"></div>

      {/* 3D Background */}
      <div id="canvas-container" ref={canvasContainerRef}></div>

      <div className="content-wrapper">
        {/* Navigation */}
        <nav id="nav">
          <div className="nav-content">
            <a href="#" className="logo">ALAKAZAM</a>
            <ul className="nav-links">
              <li><a href="#technology">Technology</a></li>
              <li><a href="#anamnesis">Anamnesis</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-content">
            <h1>
              <span className="word">Breaking</span>{' '}
              <span className="word">the</span>{' '}
              <span className="word">cost</span>{' '}
              <span className="word">curve</span>
              <br />
              <span className="word gradient-text">of</span>{' '}
              <span className="word gradient-text">game</span>{' '}
              <span className="word gradient-text">creation</span>
            </h1>
            <p className="hero-subtitle">
              World models based games running on consumer hardware—making radical experimentation economically viable.
            </p>
            <div className="hero-cta">
              <a href="#anamnesis" className="btn-magnetic">Discover Anamnesis</a>
            </div>
          </div>
          <div className="scroll-indicator">
            <span></span>
          </div>
        </section>

        {/* Approach */}
        <section id="approach">
          <div className="approach-section">
            <div className="approach-bg-layer layer-1"></div>
            <div className="approach-bg-layer layer-2"></div>
            <div className="approach-bg-layer layer-3"></div>

            <div className="approach-content">
              <div className="approach-label">How We Do It</div>
              <h3 className="approach-title">
                <span className="approach-word">Proprietary</span>{' '}
                <span className="approach-word">AI</span>{' '}
                <span className="approach-word">pipeline</span>
              </h3>

              <div className="approach-grid">
                <div className="approach-pillar">
                  <div className="pillar-icon">🎯</div>
                  <h4>Vision to Reality</h4>
                  <p>Creative concept becomes playable prototype in days</p>
                </div>

                <div className="approach-pillar">
                  <div className="pillar-icon">⚙️</div>
                  <h4>Local Inference</h4>
                  <p>Consumer hardware. No cloud. No compromise.</p>
                </div>

                <div className="approach-pillar">
                  <div className="pillar-icon">🔒</div>
                  <h4>Your IP, Protected</h4>
                  <p>Proprietary models. Competitive advantage maintained.</p>
                </div>
              </div>

              <div className="approach-statement">
                <p className="statement-text">
                  We don&apos;t reveal the recipe.<br />
                  <span className="statement-highlight">We prove it works.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Enable */}
        <section id="technology">
          <div className="section-content">
            <div className="tech-header">
              <span className="tech-label">Capabilities</span>
              <h2 className="section-title">What becomes<br />possible</h2>
              <p className="tech-subtitle">AI-native games running locally on consumer hardware. The future, playable today.</p>
            </div>

            <div className="tech-scroll-container">
              <div className="tech-scroll capabilities-scroll">
                <div className="capability-card-large">
                  <div className="capability-number">01</div>
                  <div className="capability-icon-large">⚡</div>
                  <h3>Rapid Iteration</h3>
                  <p className="capability-tagline">Days, not months</p>
                  <p className="capability-description">
                    Go from concept to playable prototype in days. Test radical ideas without burning months of dev time or six-figure budgets. Fail fast, learn faster.
                  </p>
                  <div className="capability-stat">
                    <span className="stat-highlight">10x</span>
                    <span className="stat-label-small">Faster prototyping</span>
                  </div>
                </div>

                <div className="capability-card-large">
                  <div className="capability-number">02</div>
                  <div className="capability-icon-large">🎨</div>
                  <h3>Infinite Flexibility</h3>
                  <p className="capability-tagline">Creativity unleashed</p>
                  <p className="capability-description">
                    Change art styles, mechanics, entire worlds with minimal friction. Watercolor to pixel art to photorealism. The AI adapts. Your creativity leads.
                  </p>
                  <div className="capability-stat">
                    <span className="stat-highlight">∞</span>
                    <span className="stat-label-small">Style variations</span>
                  </div>
                </div>

                <div className="capability-card-large">
                  <div className="capability-number">03</div>
                  <div className="capability-icon-large">💻</div>
                  <h3>Local Performance</h3>
                  <p className="capability-tagline">No cloud required</p>
                  <p className="capability-description">
                    30+ FPS on consumer GPUs. RTX 3070 and up. No cloud dependency. No latency. No subscription fees. Players own the experience, truly.
                  </p>
                  <div className="capability-stat">
                    <span className="stat-highlight">30+</span>
                    <span className="stat-label-small">FPS guaranteed</span>
                  </div>
                </div>

                <div className="capability-card-large">
                  <div className="capability-number">04</div>
                  <div className="capability-icon-large">🧠</div>
                  <h3>Emergent Behavior</h3>
                  <p className="capability-tagline">Living worlds</p>
                  <p className="capability-description">
                    Worlds that respond and adapt. NPCs that remember your actions. Stories that emerge from play patterns, not pre-written scripts. Every playthrough unique.
                  </p>
                  <div className="capability-stat">
                    <span className="stat-highlight">100%</span>
                    <span className="stat-label-small">Emergent gameplay</span>
                  </div>
                </div>

                <div className="capability-card-large">
                  <div className="capability-number">05</div>
                  <div className="capability-icon-large">💰</div>
                  <h3>Economic Viability</h3>
                  <p className="capability-tagline">Risk becomes manageable</p>
                  <p className="capability-description">
                    $9K–$67K training costs vs. $500K+ traditional prototypes. Makes experimental titles financially feasible. Indie studios can compete with AAA innovation.
                  </p>
                  <div className="capability-stat">
                    <span className="stat-highlight">90%</span>
                    <span className="stat-label-small">Cost reduction</span>
                  </div>
                </div>

                <div className="capability-card-large">
                  <div className="capability-number">06</div>
                  <div className="capability-icon-large">🚀</div>
                  <h3>Ship Faster</h3>
                  <p className="capability-tagline">Market speed matters</p>
                  <p className="capability-description">
                    Compress production timelines without sacrificing quality. From concept to Steam page in weeks. Iterate based on real player feedback, not assumptions.
                  </p>
                  <div className="capability-stat">
                    <span className="stat-highlight">Weeks</span>
                    <span className="stat-label-small">To launch</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-hint">
              <span className="scroll-hint-text">Scroll to explore</span>
              <span className="scroll-hint-arrow">→</span>
            </div>
          </div>
        </section>

        {/* Anamnesis */}
        <section id="anamnesis" className="anamnesis">
          <div className="section-content">
            <div className="anamnesis-layout">
              <div className="anamnesis-visual">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="anamnesis-video"
                >
                  <source src="/WhatsApp Video 2025-09-08 at 21.16.42.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="anamnesis-info">
                <div className="anamnesis-tagline">Our Flagship Game</div>
                <h2>Anamnesis</h2>
                <p className="anamnesis-description">
                  Navigate deteriorating memories as living watercolor paintings.
                  Each 60-second run explores as deeply as you dare—but stay too long,
                  and the memory consumes you.
                </p>
                <ul className="anamnesis-features">
                  <li>First-person psychological roguelite</li>
                  <li>Watercolor 3D that progressively degrades</li>
                  <li>AI degradation as core mechanic</li>
                  <li>Identity emerging from play patterns</li>
                </ul>
                <a href="#contact" className="btn-magnetic">Get in Touch</a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="contact">
          <h2>Ready to break<br />the mold?</h2>
          <a href="mailto:contact@alakazam.gg" className="contact-email">contact@alakazam.gg</a>
        </section>

        {/* Footer */}
        <footer>
          <p>© 2025 Alakazam — Building the future of AI-native gaming</p>
        </footer>
      </div>
    </>
  );
}
