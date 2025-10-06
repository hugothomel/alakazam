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
          cursorX += (mouseX - cursorX) * 0.1;
          cursorY += (mouseY - cursorY) * 0.1;
          cursor.style.left = cursorX + 'px';
          cursor.style.top = cursorY + 'px';
          requestAnimationFrame(animateCursor);
        };
        animateCursor();
        
        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .tech-card');
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
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 100;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.05,
          color: 0x00ffff,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        camera.position.z = 30;
        
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
          
          particlesMesh.rotation.x += 0.0003;
          particlesMesh.rotation.y += 0.0005;
          
          // React to mouse
          particlesMesh.rotation.x += mouseYThree * 0.00005;
          particlesMesh.rotation.y += mouseXThree * 0.00005;
          
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
        
        // Vision metrics animation
        gsap.utils.toArray('.problem-metric, .solution-metric').forEach((metric: any, i: number) => {
          gsap.from(metric, {
            opacity: 0,
            x: -30,
            duration: 0.8,
            delay: i * 0.2,
            scrollTrigger: {
              trigger: metric,
              start: 'top 80%'
            }
          });
        });
        
        // Pipeline steps animation
        gsap.utils.toArray('.pipeline-step').forEach((step: any, i: number) => {
          gsap.from(step, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: step,
              start: 'top 85%'
            }
          });
        });
        
        // Tech model cards scroll hint
        const techScroll = document.querySelector('.tech-scroll');
        if (techScroll) {
          ScrollTrigger.create({
            trigger: '.tech-scroll-container',
            start: 'top 60%',
            once: true,
            onEnter: () => {
              gsap.to(techScroll, {
                scrollLeft: 200,
                duration: 1,
                ease: 'power2.out'
              });
              gsap.to(techScroll, {
                scrollLeft: 0,
                duration: 1,
                delay: 1.5,
                ease: 'power2.inOut'
              });
            }
          });
        }
        
        // Flow steps animation
        gsap.utils.toArray('.flow-step').forEach((step: any, i: number) => {
          gsap.from(step, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: '.flow-diagram',
              start: 'top 70%'
            }
          });
        });
        
        gsap.from('.flow-parallel', {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 1,
          scrollTrigger: {
            trigger: '.flow-parallel',
            start: 'top 80%'
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
        
        // Stats
        gsap.utils.toArray('.stat').forEach((stat: any, i: number) => {
          gsap.to(stat, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%'
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
              <li><a href="#vision">Vision</a></li>
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
              AI-native world models. Synthetic training data. Local deployment. 
              Making radical experimentation economically viable.
            </p>
            <div className="hero-cta">
              <a href="#anamnesis" className="btn-magnetic">Discover Anamnesis</a>
            </div>
          </div>
          <div className="scroll-indicator">
            <span></span>
          </div>
        </section>
        
        {/* Vision - Split Screen Problem/Solution */}
        <section id="vision">
          <div className="vision-split">
            <div className="vision-left">
              <div className="vision-sticky">
                <span className="vision-label">The Problem</span>
                <h2>The game industry<br />is trapped</h2>
                <div className="problem-metrics">
                  <div className="problem-metric">
                    <div className="metric-value red">$500K+</div>
                    <div className="metric-label">Prototype cost</div>
                  </div>
                  <div className="problem-metric">
                    <div className="metric-value red">6+ months</div>
                    <div className="metric-label">Development time</div>
                  </div>
                  <div className="problem-metric">
                    <div className="metric-value red">0%</div>
                    <div className="metric-label">Risk tolerance</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="vision-right">
              <div className="vision-sticky">
                <span className="vision-label">Our Solution</span>
                <h2>Flip the<br />cost curve</h2>
                <div className="solution-metrics">
                  <div className="solution-metric">
                    <div className="metric-value cyan">$9K–$67K</div>
                    <div className="metric-label">Training cost</div>
                  </div>
                  <div className="solution-metric">
                    <div className="metric-value cyan">Days</div>
                    <div className="metric-label">Iteration speed</div>
                  </div>
                  <div className="solution-metric">
                    <div className="metric-value cyan">100%</div>
                    <div className="metric-label">Creative freedom</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pipeline Visualization */}
          <div className="pipeline-container">
            <h3 className="pipeline-title">The Ewilan Pipeline</h3>
            <div className="pipeline-steps">
              <div className="pipeline-step">
                <div className="step-number">01</div>
                <div className="step-icon">📐</div>
                <div className="step-name">Generation Spec</div>
                <div className="step-desc">Visual anchors, UI mockups, action prompts</div>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-step">
                <div className="step-number">02</div>
                <div className="step-icon">🎬</div>
                <div className="step-name">Video Generation</div>
                <div className="step-desc">100 hrs synthetic gameplay via Veo3</div>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-step">
                <div className="step-number">03</div>
                <div className="step-icon">⚙️</div>
                <div className="step-name">Preprocessing</div>
                <div className="step-desc">Low-res dynamics + high-res targets</div>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-step">
                <div className="step-number">04</div>
                <div className="step-icon">🧠</div>
                <div className="step-name">World Model</div>
                <div className="step-desc">128×128 physics & logic engine</div>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-step">
                <div className="step-number">05</div>
                <div className="step-icon">🎨</div>
                <div className="step-name">Upscaler</div>
                <div className="step-desc">Low-res → 1080p rendering</div>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-step">
                <div className="step-number">06</div>
                <div className="step-icon">🚀</div>
                <div className="step-name">Deployment</div>
                <div className="step-desc">RTX 3070+, 30+ FPS, local</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technology - Horizontal Scroll */}
        <section id="technology">
          <div className="section-content">
            <div className="tech-header">
              <span className="tech-label">Runtime Architecture</span>
              <h2 className="section-title">Four models<br />working in concert</h2>
              <p className="tech-subtitle">Real-time inference on your PC. 8–12GB VRAM. 30+ FPS.</p>
            </div>
            
            <div className="tech-scroll-container">
              <div className="tech-scroll">
                <div className="tech-model-card">
                  <div className="model-header">
                    <span className="model-icon">🧠</span>
                    <span className="model-badge">Core</span>
                  </div>
                  <h3>The Engine</h3>
                  <p className="model-tagline">World Model</p>
                  <p className="model-description">
                    The heart of the experience. Takes player actions and recent history, 
                    generates the next low-resolution frame at 128×128. Masters physics, 
                    logic, and core interactions. Understands <em>what happens next</em>.
                  </p>
                  <div className="model-specs">
                    <div className="spec-item">
                      <span className="spec-label">Output</span>
                      <span className="spec-value">128×128 @ 30fps</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Role</span>
                      <span className="spec-value">Physics & Logic</span>
                    </div>
                  </div>
                </div>
                
                <div className="tech-model-card">
                  <div className="model-header">
                    <span className="model-icon">🎨</span>
                    <span className="model-badge">Visual</span>
                  </div>
                  <h3>The Lens</h3>
                  <p className="model-tagline">Upscaler Model</p>
                  <p className="model-description">
                    The artist. Takes coarse frames from the World Model and renders them 
                    into high-fidelity 1080p images. Responsible for the final look and feel—from 
                    watercolor effects to photorealistic textures. Makes the world <em>look right</em>.
                  </p>
                  <div className="model-specs">
                    <div className="spec-item">
                      <span className="spec-label">Output</span>
                      <span className="spec-value">1080p visual</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Role</span>
                      <span className="spec-value">Aesthetic rendering</span>
                    </div>
                  </div>
                </div>
                
                <div className="tech-model-card">
                  <div className="model-header">
                    <span className="model-icon">👁️</span>
                    <span className="model-badge">Data</span>
                  </div>
                  <h3>The Observer</h3>
                  <p className="model-tagline">Computer Vision Model</p>
                  <p className="model-description">
                    The interface layer. Analyzes generated frames to extract structured data. 
                    Reads in-world UI to update game state, identifies entities for targeting, 
                    provides accessibility info. Translates pixels back into <em>data</em>.
                  </p>
                  <div className="model-specs">
                    <div className="spec-item">
                      <span className="spec-label">Output</span>
                      <span className="spec-value">Structured data</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Role</span>
                      <span className="spec-value">State extraction</span>
                    </div>
                  </div>
                </div>
                
                <div className="tech-model-card">
                  <div className="model-header">
                    <span className="model-icon">📖</span>
                    <span className="model-badge">Narrative</span>
                  </div>
                  <h3>The Director</h3>
                  <p className="model-tagline">Vision-Language Model</p>
                  <p className="model-description">
                    The storyteller. Operates on longer timescales, analyzing seconds or minutes 
                    of gameplay. Interprets player patterns, struggles, triumphs to generate narrative 
                    seeds and dynamic objectives. Understands what the gameplay <em>means</em>.
                  </p>
                  <div className="model-specs">
                    <div className="spec-item">
                      <span className="spec-label">Output</span>
                      <span className="spec-value">Narrative events</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Role</span>
                      <span className="spec-value">Emergent story</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Per-Frame Flow Diagram */}
            <div className="flow-diagram">
              <h3 className="flow-title">Per-Frame Pipeline</h3>
              <div className="flow-steps">
                <div className="flow-step">
                  <div className="flow-icon">⌨️</div>
                  <div className="flow-label">Player Input</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step highlight">
                  <div className="flow-icon">🧠</div>
                  <div className="flow-label">Engine predicts<br />128×128 frame</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step highlight">
                  <div className="flow-icon">🎨</div>
                  <div className="flow-label">Lens renders<br />1080p frame</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="flow-icon">🖥️</div>
                  <div className="flow-label">Display</div>
                </div>
              </div>
              <div className="flow-parallel">
                <div className="parallel-label">In parallel:</div>
                <div className="parallel-items">
                  <div className="parallel-item">
                    <span className="parallel-icon">👁️</span>
                    <span>Observer extracts data</span>
                  </div>
                  <div className="parallel-item">
                    <span className="parallel-icon">📖</span>
                    <span>Director reviews gameplay</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="stats">
              <div className="stat">
                <div className="stat-number">$9K–$67K</div>
                <div className="stat-label">Training Cost</div>
              </div>
              <div className="stat">
                <div className="stat-number">30+ FPS</div>
                <div className="stat-label">Performance</div>
              </div>
              <div className="stat">
                <div className="stat-number">8–12GB</div>
                <div className="stat-label">VRAM Budget</div>
              </div>
              <div className="stat">
                <div className="stat-number">100 hrs</div>
                <div className="stat-label">Training Data</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Anamnesis */}
        <section id="anamnesis" className="anamnesis">
          <div className="section-content">
            <div className="anamnesis-layout">
              <div className="anamnesis-visual">
                🎨
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
          <a href="mailto:contact@alakazam.studio" className="contact-email">contact@alakazam.studio</a>
        </section>
        
        {/* Footer */}
        <footer>
          <p>© 2025 Alakazam — Building the future of AI-native gaming</p>
        </footer>
      </div>
    </>
  );
}
