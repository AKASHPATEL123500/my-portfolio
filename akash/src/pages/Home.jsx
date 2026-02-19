import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

/* ─────────────────────────── DATA ─────────────────────────── */
const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
];

const SKILLS = {
    Frontend: [ 'HTML5', 'CSS3', 'JavaScript (ES2024)', 'React.js', 'Next.js 14', 'Tailwind CSS', 'Framer Motion', 'GSAP' ],
    Backend: [ 'Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'WebSockets', 'MongoDB', 'PostgreSQL', 'Redis' ],
    Security: [ 'JWT Auth', 'WebAuthn / Passkeys', 'OAuth 2.0', 'CSRF Protection', 'Rate Limiting', 'Helmet.js', 'Input Sanitisation' ],
    DevOps: [ 'Docker', 'GitHub Actions', 'Vercel', 'Railway', 'Nginx', 'PM2', 'Linux CLI' ],
    Vision: [ 'Python', 'OpenCV', 'NumPy', 'Automation Scripts', 'Web Scraping', 'Data Pipelines' ],
};

const PROJECTS = [
    {
        num: '01',
        title: 'AuthForge',
        tag: 'Security Platform',
        year: '2024',
        stack: [ 'Next.js', 'Node.js', 'PostgreSQL', 'JWT', 'WebAuthn' ],
        description:
            'Full-stack authentication platform supporting password, magic-link, TOTP, and WebAuthn/Passkey flows. Built with a stateless JWT strategy, refresh-token rotation, and Redis-backed session store. Admin dashboard tracks active sessions, revokes tokens, and surfaces anomaly alerts.',
        highlights: [
            'Sub-50 ms auth response via Redis caching',
            'Passkey enrolment & verification with FIDO2',
            'Role-based access control with fine-grained permissions',
            'Automated token rotation on every request',
        ],
        color: '#b4ff00',
    },
    {
        num: '02',
        title: 'PulseBoard',
        tag: 'Realtime Dashboard',
        year: '2024',
        stack: [ 'React.js', 'Express.js', 'MongoDB', 'WebSockets', 'Chart.js' ],
        description:
            'Realtime analytics dashboard streaming live metrics over WebSocket. Server-side aggregation pipeline compresses MongoDB change-streams into delta payloads, reducing bandwidth 70%. UI renders 60 fps charts with canvas-based rendering and optimistic updates.',
        highlights: [
            '< 120 ms end-to-end latency on live metric push',
            'Delta compression cuts WebSocket payload 70%',
            'Persistent snapshot caching with TTL invalidation',
            'Keyboard-navigable, WCAG-AA accessible',
        ],
        color: '#00d4ff',
    },
    {
        num: '03',
        title: 'ShieldAPI',
        tag: 'API Security Layer',
        year: '2025',
        stack: [ 'Node.js', 'Express.js', 'Redis', 'Nginx', 'Docker' ],
        description:
            'Drop-in API gateway providing adaptive rate-limiting, IP reputation scoring, request signing, and anomaly detection. Middleware chain is plug-and-play; zero code changes needed in the target service. Integrated Slack alerts on threshold breach.',
        highlights: [
            'Adaptive sliding-window rate limiter with Redis',
            'Request HMAC signing & verification',
            'Geo-IP blocking with manual allow-list override',
            'Zero-downtime hot-config reload via SIGHUP',
        ],
        color: '#ff6b35',
    },
    {
        num: '04',
        title: 'VisionBot',
        tag: 'Computer Vision Tool',
        year: '2025',
        stack: [ 'Python', 'OpenCV', 'NumPy', 'FastAPI', 'Docker' ],
        description:
            'Automation toolkit using OpenCV for real-time object detection, template matching, and screen-region analysis. Ships as a FastAPI microservice; any language can call it over HTTP. Used internally for automated UI regression testing.',
        highlights: [
            'Template match accuracy > 97% across 4K displays',
            'FastAPI REST interface for cross-language use',
            'Batch-process 1000+ screenshots in < 30 s',
            'Docker image < 180 MB with multi-stage build',
        ],
        color: '#c77dff',
    },
];

const TIMELINE = [
    {
        period: 'Jan 2024 – Present',
        role: 'Full Stack Developer (Freelance)',
        place: 'Remote — Various Clients',
        desc: 'Delivered 4 production web apps across auth, analytics, and API-security domains. Clients range from early-stage startups to solo founders scaling their MVPs. Maintained 100% on-time delivery record.',
    },
    {
        period: 'Aug 2023 – Dec 2023',
        role: 'Backend Intern',
        place: 'Local Tech Studio, Prayagraj',
        desc: 'Built and maintained Node/Express microservices. Refactored monolith into 3 independent services, cutting deploy time from 12 min to 90 s. Wrote integration tests that raised coverage from 34% to 81%.',
    },
    {
        period: 'Jun 2023 – Jul 2023',
        role: 'Open Source Contributor',
        place: 'GitHub',
        desc: 'Contributed auth-middleware improvements and documentation to two Node.js libraries (combined 1.4k GitHub stars). PRs merged within 72 h.',
    },
];

const BLOG_POSTS = [
    { title: 'Refresh Token Rotation Without Breaking Your UX', tag: 'Security', read: '7 min' },
    { title: 'WebSockets vs. SSE — Choosing the Right Real-time Primitive', tag: 'Backend', read: '9 min' },
    { title: 'How I Cut MongoDB Query Time 60% With Compound Indexes', tag: 'Performance', read: '5 min' },
    { title: 'Building Passkey Auth From Scratch With WebAuthn', tag: 'Security', read: '12 min' },
    { title: 'OpenCV in Production: Lessons From 10k Screenshot Runs', tag: 'Python', read: '8 min' },
];

const UPCOMING = [
    { title: 'AI Code Review Bot', desc: 'Claude API + GitHub webhooks → automated PR feedback with line-level comments.' },
    { title: 'WebAuthn SaaS Starter', desc: 'Open-source Next.js boilerplate: Passkeys-first, zero password by default.' },
    { title: 'Edge Rate Limiter', desc: 'Cloudflare Worker + Durable Objects sliding-window limiter as npm package.' },
    { title: 'CV Pipeline Service', desc: 'Multipart upload → OpenCV processing → annotated result, in < 2 s.' },
];

/* ─────────────────── NAVBAR ─────────────────── */
function Navbar() {
    const [ scrolled, setScrolled ] = useState( false );
    const [ menuOpen, setMenuOpen ] = useState( false );

    useEffect( () => {
        const onScroll = () => setScrolled( window.scrollY > 60 );
        window.addEventListener( 'scroll', onScroll );
        return () => window.removeEventListener( 'scroll', onScroll );
    }, [] );

    return (
        <nav
            className={ `fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${ scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 py-3' : 'py-5'
                }` }
        >
            <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
                <a href="#" className="text-lg font-bold tracking-[0.15em] text-[#b4ff00] uppercase">
                    AP<span className="text-white">.</span>
                </a>

                {/* Desktop links */ }
                <ul className="hidden md:flex items-center gap-8">
                    { NAV_LINKS.map( ( link ) => (
                        <li key={ link.label }>
                            <a
                                href={ link.href }
                                className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-[#b4ff00] transition-colors duration-200"
                            >
                                { link.label }
                            </a>
                        </li>
                    ) ) }
                </ul>

                <a
                    href="mailto:allahabadkin@gmail.com"
                    className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#b4ff00]/60 bg-[#b4ff00]/10 px-5 py-2 text-xs uppercase tracking-[0.2em] text-[#b4ff00] hover:bg-[#b4ff00] hover:text-black transition-all duration-300"
                >
                    Hire Me
                </a>

                {/* Mobile hamburger */ }
                <button
                    className="md:hidden flex flex-col gap-1.5"
                    onClick={ () => setMenuOpen( !menuOpen ) }
                    aria-label="Toggle menu"
                >
                    <span className={ `block h-0.5 w-6 bg-white transition-transform duration-300 ${ menuOpen ? 'rotate-45 translate-y-2' : '' }` } />
                    <span className={ `block h-0.5 w-6 bg-white transition-opacity duration-300 ${ menuOpen ? 'opacity-0' : '' }` } />
                    <span className={ `block h-0.5 w-6 bg-white transition-transform duration-300 ${ menuOpen ? '-rotate-45 -translate-y-2' : '' }` } />
                </button>
            </div>

            {/* Mobile menu */ }
            { menuOpen && (
                <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-6 pb-6 pt-4">
                    { NAV_LINKS.map( ( link ) => (
                        <a
                            key={ link.label }
                            href={ link.href }
                            onClick={ () => setMenuOpen( false ) }
                            className="block py-2.5 text-sm uppercase tracking-[0.2em] text-white/70 hover:text-[#b4ff00]"
                        >
                            { link.label }
                        </a>
                    ) ) }
                    <a
                        href="mailto:allahabadkin@gmail.com"
                        className="mt-4 block text-center rounded-full border border-[#b4ff00] px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#b4ff00]"
                    >
                        Hire Me
                    </a>
                </div>
            ) }
        </nav>
    );
}

/* ─────────────────── FOOTER ─────────────────── */
function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#080808] px-6 py-16">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {/* Brand */ }
                    <div>
                        <p className="text-2xl font-bold tracking-[0.15em] text-[#b4ff00] uppercase">Akash Patel</p>
                        <p className="mt-3 text-sm leading-relaxed text-white/55 max-w-xs">
                            Full Stack Developer crafting resilient systems with cinematic UX. Based in Prayagraj, India. Available for remote work worldwide.
                        </p>
                    </div>

                    {/* Quick Links */ }
                    <div>
                        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#b4ff00]/70">Quick Links</p>
                        <ul className="space-y-2">
                            { NAV_LINKS.map( ( link ) => (
                                <li key={ link.label }>
                                    <a href={ link.href } className="text-sm text-white/55 hover:text-white transition-colors">
                                        { link.label }
                                    </a>
                                </li>
                            ) ) }
                        </ul>
                    </div>

                    {/* Contact */ }
                    <div>
                        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#b4ff00]/70">Get In Touch</p>
                        <a href="mailto:allahabadkin@gmail.com" className="text-sm text-white/70 hover:text-[#b4ff00] transition-colors block mb-2">
                            allahabadkin@gmail.com
                        </a>
                        <a
                            href="https://github.com/AKASHPATEL123500"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-white/70 hover:text-[#b4ff00] transition-colors block"
                        >
                            github.com/AKASHPATEL123500
                        </a>
                        <div className="mt-6 flex gap-3">
                            <a
                                href="https://github.com/AKASHPATEL123500"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-white/20 p-2.5 hover:border-[#b4ff00] hover:text-[#b4ff00] transition-all text-white/60"
                                aria-label="GitHub"
                            >
                                {/* GitHub SVG */ }
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </a>
                            <a
                                href="mailto:allahabadkin@gmail.com"
                                className="rounded-full border border-white/20 p-2.5 hover:border-[#b4ff00] hover:text-[#b4ff00] transition-all text-white/60"
                                aria-label="Email"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
                    <p className="text-xs text-white/30">© 2025 Akash Patel. All rights reserved.</p>
                    <p className="text-xs text-white/30">Designed & Built with React + GSAP</p>
                </div>
            </div>
        </footer>
    );
}

/* ─────────────────── SCENE WRAPPER ─────────────────── */
function Scene( { id, index, children, className = '' } ) {
    return (
        <section
            id={ id }
            data-scene
            className={ `relative flex min-h-screen items-center justify-center px-6 py-24 ${ className }` }
        >
            {/* BG layers */ }
            <div data-parallax className="absolute inset-8 rounded-[2rem] border border-white/8 bg-white/[0.03] backdrop-blur-2xl pointer-events-none" />
            <div data-parallax className="absolute inset-x-[18%] top-[12%] h-28 rounded-full bg-[#b4ff00]/10 blur-3xl pointer-events-none" />
            <div data-parallax className="absolute bottom-[10%] right-[8%] h-40 w-40 rounded-full border border-[#b4ff00]/25 pointer-events-none" />

            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-[#b4ff00]/60">
                    { String( index + 1 ).padStart( 2, '0' ) } / { String( 20 ).padStart( 2, '0' ) }
                </p>
                { children }
            </div>
        </section>
    );
}

/* ─────────────────── CHIP ─────────────────── */
function Chip( { children, color = 'default' } ) {
    const colors = {
        default: 'border-white/15 bg-white/8 text-white/80',
        green: 'border-[#b4ff00]/40 bg-[#b4ff00]/10 text-[#b4ff00]',
        blue: 'border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]',
        orange: 'border-[#ff6b35]/40 bg-[#ff6b35]/10 text-[#ff6b35]',
        purple: 'border-[#c77dff]/40 bg-[#c77dff]/10 text-[#c77dff]',
    };
    return (
        <span
            data-chip
            className={ `rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur ${ colors[ color ] }` }
        >
            { children }
        </span>
    );
}

/* ─────────────────── MAIN ─────────────────── */
export default function Home() {
    const rootRef = useRef( null );
    const progressRef = useRef( null );

    useEffect( () => {
        const ctx = gsap.context( () => {
            /* Progress bar */
            gsap.to( progressRef.current, {
                scaleX: 1,
                ease: 'none',
                transformOrigin: 'left center',
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.3,
                },
            } );

            /* Per-scene animations — no pinning (avoids stacking bugs) */
            gsap.utils.toArray( '[data-scene]' ).forEach( ( section ) => {
                const heading = section.querySelector( '[data-title]' );
                const subtitle = section.querySelector( '[data-subtitle]' );
                const chips = section.querySelectorAll( '[data-chip]' );
                const layers = section.querySelectorAll( '[data-parallax]' );

                if ( heading ) {
                    gsap.fromTo(
                        heading,
                        { yPercent: 60, autoAlpha: 0, rotateX: -30 },
                        {
                            yPercent: 0,
                            autoAlpha: 1,
                            rotateX: 0,
                            ease: 'power4.out',
                            scrollTrigger: { trigger: section, start: 'top 82%', end: 'top 35%', scrub: false, toggleActions: 'play none none reverse' },
                        },
                    );
                }

                if ( subtitle ) {
                    gsap.fromTo(
                        subtitle,
                        { y: 40, autoAlpha: 0 },
                        {
                            y: 0,
                            autoAlpha: 1,
                            ease: 'expo.out',
                            delay: 0.15,
                            scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none reverse' },
                        },
                    );
                }

                if ( chips.length ) {
                    gsap.fromTo(
                        chips,
                        { autoAlpha: 0, scale: 0.8, y: 20 },
                        {
                            autoAlpha: 1,
                            scale: 1,
                            y: 0,
                            stagger: 0.05,
                            ease: 'back.out(1.7)',
                            scrollTrigger: { trigger: section, start: 'top 72%', toggleActions: 'play none none reverse' },
                        },
                    );
                }

                /* Subtle parallax on BG layers */
                gsap.to( layers, {
                    yPercent: -8,
                    ease: 'none',
                    scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
                } );
            } );

            /* Floating skill chips */
            gsap.utils.toArray( '[data-float]' ).forEach( ( el, i ) => {
                gsap.to( el, {
                    y: i % 2 ? 14 : -14,
                    duration: 2.2 + ( i % 5 ) * 0.3,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut',
                } );
            } );

            /* Magnetic buttons */
            gsap.utils.toArray( '[data-magnetic]' ).forEach( ( btn ) => {
                const qx = gsap.quickTo( btn, 'x', { duration: 0.35, ease: 'power4.out' } );
                const qy = gsap.quickTo( btn, 'y', { duration: 0.35, ease: 'power4.out' } );
                btn.addEventListener( 'mousemove', ( e ) => {
                    const b = btn.getBoundingClientRect();
                    qx( ( e.clientX - b.left - b.width / 2 ) * 0.25 );
                    qy( ( e.clientY - b.top - b.height / 2 ) * 0.25 );
                } );
                btn.addEventListener( 'mouseleave', () => { qx( 0 ); qy( 0 ); } );
            } );

            /* Infinite rail */
            const rail = document.querySelector( '[data-rail]' );
            if ( rail ) gsap.to( rail, { xPercent: -50, ease: 'none', repeat: -1, duration: 18 } );

            /* Counter numbers */
            gsap.utils.toArray( '[data-count]' ).forEach( ( el ) => {
                const target = parseInt( el.getAttribute( 'data-count' ), 10 );
                gsap.fromTo(
                    el,
                    { innerText: 0 },
                    {
                        innerText: target,
                        duration: 1.6,
                        ease: 'power2.out',
                        snap: { innerText: 1 },
                        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
                    },
                );
            } );

            /* Project panel animations */
            gsap.utils.toArray( '[data-panel]' ).forEach( ( panel ) => {
                gsap.fromTo(
                    panel,
                    { yPercent: 20, scale: 0.93, rotateY: 10, autoAlpha: 0 },
                    {
                        yPercent: 0,
                        scale: 1,
                        rotateY: 0,
                        autoAlpha: 1,
                        ease: 'expo.out',
                        scrollTrigger: { trigger: panel, start: 'top 80%', toggleActions: 'play none none reverse' },
                    },
                );
            } );

        }, rootRef );

        return () => ctx.revert();
    }, [] );

    return (
        <div>
            <Navbar />

            <main
                ref={ rootRef }
                className="relative overflow-x-hidden bg-[#0a0a0a] text-white"
                style={ { perspective: '1400px', fontFamily: "'DM Sans', 'Space Grotesk', sans-serif" } }
            >
                {/* Global BG */ }
                <div className="fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_15%_20%,rgba(180,255,0,0.12),transparent_40%),radial-gradient(ellipse_at_85%_5%,rgba(20,140,255,0.10),transparent_35%),linear-gradient(160deg,#0a0a0a,#0e0e0e,#080808)]" />
                <div className="fixed inset-0 -z-10 pointer-events-none opacity-15 [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:2.5px_2.5px]" />

                {/* Progress bar */ }
                <div className="fixed left-0 top-0 z-[200] h-[2px] w-full origin-left scale-x-0 bg-[#b4ff00] shadow-[0_0_18px_#b4ff00]" ref={ progressRef } />

                {/* ──────────────── SCENE 01: HERO ──────────────── */ }
                <Scene id="hero" index={ 0 }>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b4ff00]/30 bg-[#b4ff00]/8 px-4 py-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#b4ff00] shadow-[0_0_6px_#b4ff00]" />
                            <span className="text-[11px] uppercase tracking-[0.3em] text-[#b4ff00]">Available for work</span>
                        </div>
                        <h1
                            data-title
                            className="text-5xl font-bold leading-[0.92] tracking-tight drop-shadow-[0_0_40px_rgba(180,255,0,0.2)] sm:text-7xl lg:text-9xl"
                        >
                            Akash<br />
                            <span className="text-[#b4ff00]">Patel</span>
                        </h1>
                        <p data-subtitle className="mt-6 max-w-xl text-base text-white/60 sm:text-lg leading-relaxed">
                            Full Stack Developer &amp; Backend Engineer — building resilient systems,<br className="hidden sm:block" />
                            secure APIs, and cinematic web experiences from Prayagraj, India.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <a
                                data-magnetic
                                href="https://github.com/AKASHPATEL123500"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-[#b4ff00]/60 bg-[#b4ff00]/10 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-[#b4ff00] shadow-[0_0_30px_rgba(180,255,0,0.22)] hover:bg-[#b4ff00] hover:text-black transition-all duration-300"
                            >
                                View GitHub
                            </a>
                            <a
                                data-magnetic
                                href="#contact"
                                className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-white/70 hover:border-white hover:text-white transition-all duration-300"
                            >
                                Let's Talk
                            </a>
                        </div>
                        {/* Stat row */ }
                        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10 w-full max-w-lg">
                            { [
                                { val: 2, label: 'Years Coding', suffix: '+' },
                                { val: 4, label: 'Live Projects', suffix: '' },
                                { val: 18, label: 'Skills Mastered', suffix: '+' },
                            ].map( ( s ) => (
                                <div key={ s.label } className="text-center">
                                    <p className="text-3xl font-bold text-[#b4ff00] sm:text-4xl">
                                        <span data-count={ s.val }>{ s.val }</span>{ s.suffix }
                                    </p>
                                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">{ s.label }</p>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 02: TAGLINE ──────────────── */ }
                <Scene index={ 1 }>
                    <div className="text-center">
                        <h2 data-title className="text-4xl font-bold leading-tight sm:text-6xl lg:text-8xl">
                            I Build<br />
                            <span className="text-[#b4ff00]">Digital Velocity.</span>
                        </h2>
                        <p data-subtitle className="mx-auto mt-8 max-w-2xl text-base text-white/60 sm:text-xl leading-relaxed">
                            From whiteboard idea to deployed production system — I handle architecture, code,
                            security, and polish. Every project ships with intent, performance budgets, and
                            zero shortcuts on auth or data safety.
                        </p>
                        <div className="mt-12 flex flex-wrap justify-center gap-3">
                            { [ 'Idea → Architecture', 'Architecture → Code', 'Code → Production', 'Performance First', 'Security by Design' ].map( ( t ) => (
                                <Chip key={ t } color="green">{ t }</Chip>
                            ) ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 03: ABOUT ──────────────── */ }
                <Scene id="about" index={ 2 }>
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
                        <div>
                            <h2 data-title className="text-4xl font-bold sm:text-6xl">About<br /><span className="text-[#b4ff00]">Me</span></h2>
                            <p data-subtitle className="mt-6 text-white/65 text-base leading-relaxed">
                                I'm a 2-year-old self-taught developer who started with HTML/CSS curiosity and now architects
                                full-stack production systems. Currently pursuing BCA (1st Year) while shipping real products
                                for clients and open-source.
                            </p>
                            <p className="mt-4 text-white/65 text-base leading-relaxed">
                                My work sits at the intersection of <span className="text-white">backend engineering</span>,
                                <span className="text-white"> security</span>, and <span className="text-white">cinematic frontend UX</span>.
                                I believe systems should be boring-reliable under the hood and visually surprising on top.
                            </p>
                            <p className="mt-4 text-white/65 text-base leading-relaxed">
                                When I'm not building, I'm writing about auth flows, writing about indexing strategies,
                                and contributing PRs to OSS projects I use daily.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                { [ 'Prayagraj, India', 'Remote-friendly', 'BCA 1st Year', '2+ Years Experience' ].map( ( t ) => (
                                    <Chip key={ t } color="default">{ t }</Chip>
                                ) ) }
                            </div>
                        </div>
                        {/* Code snippet card */ }
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 font-mono text-sm leading-7 backdrop-blur-xl">
                            <div className="mb-4 flex gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                            </div>
                            <p className="text-white/35">// akash.config.ts</p>
                            <p><span className="text-[#b4ff00]">const</span> <span className="text-[#00d4ff]">dev</span> = { '{' }</p>
                            <p className="pl-4"><span className="text-white/60">name:</span> <span className="text-green-400">'Akash Patel'</span>,</p>
                            <p className="pl-4"><span className="text-white/60">role:</span> <span className="text-green-400">'Full Stack Dev'</span>,</p>
                            <p className="pl-4"><span className="text-white/60">location:</span> <span className="text-green-400">'Prayagraj, IN'</span>,</p>
                            <p className="pl-4"><span className="text-white/60">focus:</span> [<span className="text-green-400">'Backend'</span>, <span className="text-green-400">'Security'</span>, <span className="text-green-400">'React'</span>],</p>
                            <p className="pl-4"><span className="text-white/60">available:</span> <span className="text-[#b4ff00]">true</span>,</p>
                            <p className="pl-4"><span className="text-white/60">openSource:</span> <span className="text-[#b4ff00]">true</span>,</p>
                            <p>{ '};' }</p>
                            <p className="mt-2"><span className="text-[#b4ff00]">export default</span> dev;</p>
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 04: SKILLS NEBULA ──────────────── */ }
                <Scene id="skills" index={ 3 }>
                    <div className="text-center">
                        <h2 data-title className="text-4xl font-bold sm:text-6xl">Skills<br /><span className="text-[#b4ff00]">Nebula</span></h2>
                        <p data-subtitle className="mx-auto mt-5 max-w-xl text-base text-white/60">
                            Frontend, Backend, Security, DevOps, and Vision tooling — orbiting in sync.
                        </p>
                        <div className="mt-14 flex flex-wrap justify-center gap-2.5">
                            { Object.values( SKILLS ).flat().map( ( skill, i ) => (
                                <span
                                    key={ skill }
                                    data-chip
                                    data-float
                                    className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/80 backdrop-blur hover:border-[#b4ff00]/60 hover:text-[#b4ff00] transition-colors cursor-default"
                                >
                                    { skill }
                                </span>
                            ) ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 05: FRONTEND ──────────────── */ }
                <Scene index={ 4 }>
                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 items-center">
                        <div>
                            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#b4ff00]/70">Discipline 01</p>
                            <h2 data-title className="text-4xl font-bold sm:text-6xl">Frontend<br />Engineering</h2>
                            <p data-subtitle className="mt-5 text-white/60 leading-relaxed">
                                React.js and Next.js 14 are my daily drivers. I build performance-first interfaces with
                                sub-3 s LCP, smooth 60 fps animations via GSAP &amp; Framer Motion, and accessibility
                                that passes WCAG-AA out of the box. Every component ships with Storybook docs.
                            </p>
                            <ul className="mt-6 space-y-2.5 text-sm text-white/65">
                                { [ 'Server Components & React Server Actions', 'Dynamic imports & code splitting', 'CSS-in-JS → Tailwind migration experience', 'Core Web Vitals optimisation' ].map( ( t ) => (
                                    <li key={ t } className="flex items-start gap-2"><span className="mt-1 text-[#b4ff00]">→</span>{ t }</li>
                                ) ) }
                            </ul>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            { SKILLS.Frontend.map( ( s ) => <Chip key={ s } color="green">{ s }</Chip> ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 06: BACKEND ──────────────── */ }
                <Scene index={ 5 }>
                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 items-center">
                        <div className="order-2 lg:order-1 flex flex-wrap gap-2.5">
                            { SKILLS.Backend.map( ( s ) => <Chip key={ s } color="blue">{ s }</Chip> ) }
                        </div>
                        <div className="order-1 lg:order-2">
                            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#00d4ff]/70">Discipline 02</p>
                            <h2 data-title className="text-4xl font-bold sm:text-6xl"><span className="text-[#00d4ff]">Backend</span><br />Engineering</h2>
                            <p data-subtitle className="mt-5 text-white/60 leading-relaxed">
                                Node.js/Express microservices with clean service-repository separation. I instrument
                                everything with structured logging, distributed tracing, and health endpoints. Databases
                                are properly indexed; queries are profiled before they hit production.
                            </p>
                            <ul className="mt-6 space-y-2.5 text-sm text-white/65">
                                { [ 'RESTful & GraphQL API design', 'MongoDB aggregation pipelines', 'PostgreSQL with proper indexing', 'Redis caching + pub/sub patterns' ].map( ( t ) => (
                                    <li key={ t } className="flex items-start gap-2"><span className="mt-1 text-[#00d4ff]">→</span>{ t }</li>
                                ) ) }
                            </ul>
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 07: SECURITY ──────────────── */ }
                <Scene index={ 6 }>
                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 items-center">
                        <div>
                            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff6b35]/70">Discipline 03</p>
                            <h2 data-title className="text-4xl font-bold sm:text-6xl">Security<br /><span className="text-[#ff6b35]">Layer</span></h2>
                            <p data-subtitle className="mt-5 text-white/60 leading-relaxed">
                                Auth is never an afterthought. I implement multi-factor, passkeys (FIDO2/WebAuthn),
                                refresh-token rotation, and server-side session invalidation as standard. Every API
                                gets input validation, rate limiting, and OWASP Top-10 hardening.
                            </p>
                            <ul className="mt-6 space-y-2.5 text-sm text-white/65">
                                { [ 'JWT + refresh-token rotation strategy', 'WebAuthn / Passkey FIDO2 flows', 'CSRF, XSS, SQLi prevention', 'Adaptive rate limiting with Redis' ].map( ( t ) => (
                                    <li key={ t } className="flex items-start gap-2"><span className="mt-1 text-[#ff6b35]">→</span>{ t }</li>
                                ) ) }
                            </ul>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            { SKILLS.Security.map( ( s ) => <Chip key={ s } color="orange">{ s }</Chip> ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 08: API ARCHITECTURE ──────────────── */ }
                <Scene index={ 7 }>
                    <div className="text-center">
                        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">Discipline 04</p>
                        <h2 data-title className="text-4xl font-bold sm:text-6xl">API<br /><span className="text-[#b4ff00]">Architecture</span></h2>
                        <p data-subtitle className="mx-auto mt-5 max-w-2xl text-base text-white/60 leading-relaxed">
                            Clean contracts, versioning, modular boundaries, and full observability. Every API ships
                            with OpenAPI docs, typed SDKs, and end-to-end integration tests.
                        </p>
                        <div className="mt-14 grid grid-cols-2 gap-5 text-left md:grid-cols-4">
                            { [
                                { title: 'Contract-First', desc: 'OpenAPI 3.1 spec → typed client SDK generated automatically.', icon: '📄' },
                                { title: 'Versioning', desc: 'URI-based versioning with deprecation headers and sunset dates.', icon: '🔢' },
                                { title: 'Observability', desc: 'Structured JSON logs, distributed traces, and /health endpoints.', icon: '📊' },
                                { title: 'Testing', desc: '100% integration test coverage on critical paths before deploy.', icon: '✅' },
                            ].map( ( card ) => (
                                <div key={ card.title } data-chip className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                    <p className="text-2xl">{ card.icon }</p>
                                    <p className="mt-3 font-semibold text-white">{ card.title }</p>
                                    <p className="mt-2 text-xs text-white/55 leading-relaxed">{ card.desc }</p>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 09: PYTHON + OPENCV ──────────────── */ }
                <Scene index={ 8 }>
                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 items-center">
                        <div>
                            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#c77dff]/70">Discipline 05</p>
                            <h2 data-title className="text-4xl font-bold sm:text-6xl">Python &amp;<br /><span className="text-[#c77dff]">OpenCV</span></h2>
                            <p data-subtitle className="mt-5 text-white/60 leading-relaxed">
                                Vision systems, automation scripts, and data pipelines. OpenCV for real-time object detection
                                and template matching. FastAPI to expose vision results as HTTP endpoints consumable
                                by any backend service.
                            </p>
                            <ul className="mt-6 space-y-2.5 text-sm text-white/65">
                                { [ 'Real-time object detection pipelines', 'Template matching > 97% accuracy', 'FastAPI microservice wrapper', 'Batch image processing at scale' ].map( ( t ) => (
                                    <li key={ t } className="flex items-start gap-2"><span className="mt-1 text-[#c77dff]">→</span>{ t }</li>
                                ) ) }
                            </ul>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            { SKILLS.Vision.map( ( s ) => <Chip key={ s } color="purple">{ s }</Chip> ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 10: KINETIC RAIL ──────────────── */ }
                <Scene index={ 9 }>
                    <div className="w-full text-center">
                        <h2 data-title className="text-4xl font-bold sm:text-5xl">Built With<br /><span className="text-[#b4ff00]">Momentum.</span></h2>
                        <p data-subtitle className="mx-auto mt-4 max-w-lg text-sm text-white/50">
                            The tech behind every project — in infinite motion.
                        </p>
                        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-black/30 py-5">
                            <div data-rail className="flex w-[200%] gap-10 whitespace-nowrap text-3xl font-bold uppercase tracking-[0.2em] text-[#b4ff00] sm:text-5xl">
                                { Array.from( { length: 8 } ).map( ( _, i ) => (
                                    <span key={ i } className="shrink-0">
                                        Akash Patel&nbsp;•&nbsp;Backend Eng&nbsp;•&nbsp;React Motion&nbsp;•&nbsp;Security First&nbsp;•&nbsp;Node.js&nbsp;•&nbsp;Next.js&nbsp;•&nbsp;
                                    </span>
                                ) ) }
                            </div>
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 11: PROJECTS INTRO ──────────────── */ }
                <Scene id="projects" index={ 10 }>
                    <div className="text-center">
                        <h2 data-title className="text-4xl font-bold sm:text-6xl lg:text-8xl">Selected<br /><span className="text-[#b4ff00]">Work.</span></h2>
                        <p data-subtitle className="mx-auto mt-6 max-w-xl text-base text-white/60 leading-relaxed">
                            Four production-grade projects built with real constraints, real users, and real performance
                            requirements. Each one represents a core pillar of my engineering practice.
                        </p>
                        <div className="mt-10 flex justify-center gap-6 text-sm text-white/40">
                            <span>AuthForge</span><span className="text-white/20">—</span>
                            <span>PulseBoard</span><span className="text-white/20">—</span>
                            <span>ShieldAPI</span><span className="text-white/20">—</span>
                            <span>VisionBot</span>
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENES 12–15: PROJECTS ──────────────── */ }
                { PROJECTS.map( ( project, i ) => (
                    <Scene key={ project.num } index={ 11 + i }>
                        <div data-panel className="mx-auto max-w-4xl">
                            <div className="rounded-[2rem] border p-8 backdrop-blur-xl md:p-12" style={ { borderColor: `${ project.color }30`, background: `${ project.color }08` } }>
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em]" style={ { color: `${ project.color }cc` } }>
                                            { project.tag } — { project.year }
                                        </p>
                                        <h3 className="mt-2 text-4xl font-bold sm:text-5xl" style={ { color: project.color } }>
                                            { project.title }
                                        </h3>
                                    </div>
                                    <span className="text-5xl font-black text-white/10">{ project.num }</span>
                                </div>
                                <p className="mt-5 text-base text-white/65 leading-relaxed">{ project.description }</p>
                                <ul className="mt-6 space-y-2">
                                    { project.highlights.map( ( h ) => (
                                        <li key={ h } className="flex items-start gap-2.5 text-sm text-white/60">
                                            <span className="mt-0.5 text-xs" style={ { color: project.color } }>✦</span>
                                            { h }
                                        </li>
                                    ) ) }
                                </ul>
                                <div className="mt-8 flex flex-wrap gap-2">
                                    { project.stack.map( ( s ) => (
                                        <span key={ s } className="rounded-full border px-3 py-1 text-xs" style={ { borderColor: `${ project.color }40`, color: project.color } }>
                                            { s }
                                        </span>
                                    ) ) }
                                </div>
                            </div>
                        </div>
                    </Scene>
                ) ) }

                {/* ──────────────── SCENE 16: UPCOMING ──────────────── */ }
                <Scene index={ 15 }>
                    <div className="text-center">
                        <h2 data-title className="text-4xl font-bold sm:text-6xl">What's<br /><span className="text-[#b4ff00]">Next.</span></h2>
                        <p data-subtitle className="mx-auto mt-5 max-w-xl text-base text-white/60">
                            Projects in the pipeline — AI, passkeys, edge computing, and vision.
                        </p>
                        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
                            { UPCOMING.map( ( item ) => (
                                <div key={ item.title } data-chip className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:border-[#b4ff00]/30 transition-colors">
                                    <p className="font-semibold text-white">{ item.title }</p>
                                    <p className="mt-2 text-sm text-white/55 leading-relaxed">{ item.desc }</p>
                                    <p className="mt-3 text-xs text-[#b4ff00]/70 uppercase tracking-[0.2em]">In Progress →</p>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 17: EXPERIENCE ──────────────── */ }
                <Scene id="experience" index={ 16 }>
                    <div className="mx-auto max-w-3xl">
                        <h2 data-title className="text-4xl font-bold sm:text-6xl">Experience<br /><span className="text-[#b4ff00]">Timeline.</span></h2>
                        <p data-subtitle className="mt-4 text-white/60">2 years of consistent iteration under real-world pressure.</p>
                        <div className="mt-12 space-y-8">
                            { TIMELINE.map( ( item ) => (
                                <div key={ item.role } data-chip className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-white/15">
                                    <div className="absolute left-[-4px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#b4ff00] shadow-[0_0_8px_#b4ff00]" />
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#b4ff00]/70">{ item.period }</p>
                                    <p className="mt-1.5 text-lg font-semibold text-white">{ item.role }</p>
                                    <p className="text-sm text-white/45">{ item.place }</p>
                                    <p className="mt-3 text-sm text-white/60 leading-relaxed">{ item.desc }</p>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 18: EDUCATION ──────────────── */ }
                <Scene index={ 17 }>
                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 items-center">
                        <div>
                            <h2 data-title className="text-4xl font-bold sm:text-6xl">Education &amp;<br /><span className="text-[#b4ff00]">Learning.</span></h2>
                            <p data-subtitle className="mt-5 text-white/60 leading-relaxed">
                                Formal degree provides the fundamentals. But the real education happens in production.
                            </p>
                            <div className="mt-8 space-y-5">
                                { [
                                    { deg: 'BCA — Bachelor of Computer Applications', place: 'Currently enrolled, 1st Year', note: 'Data structures, algorithms, OS, DBMS, networking.' },
                                    { deg: 'Self-Directed Engineering', place: 'Ongoing (2023 – Present)', note: 'MDN, Docs, OSS codebases, production post-mortems, and obsessive reading of RFCs.' },
                                ].map( ( e ) => (
                                    <div key={ e.deg } data-chip className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                        <p className="font-semibold text-white">{ e.deg }</p>
                                        <p className="text-xs text-[#b4ff00]/70 uppercase tracking-[0.15em] mt-0.5">{ e.place }</p>
                                        <p className="mt-2 text-sm text-white/55 leading-relaxed">{ e.note }</p>
                                    </div>
                                ) ) }
                            </div>
                        </div>
                        <div>
                            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/40">Certifications &amp; Learning</p>
                            <div className="space-y-3">
                                { [ 'The Odin Project — Full Stack Path', 'CS50x — Harvard (In Progress)', 'JavaScript Algorithms — FCC', 'MongoDB University — M001', 'Google Cybersecurity Certificate' ].map( ( cert ) => (
                                    <div key={ cert } data-chip className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/70">
                                        <span className="text-[#b4ff00]">✓</span>
                                        { cert }
                                    </div>
                                ) ) }
                            </div>
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 19: BLOG ──────────────── */ }
                <Scene index={ 18 }>
                    <div>
                        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h2 data-title className="text-4xl font-bold sm:text-6xl">Blog<br /><span className="text-[#b4ff00]">Lab.</span></h2>
                                <p data-subtitle className="mt-3 text-white/60 max-w-md">Notes on backend architecture, security, and scaling — written for engineers who ship.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            { BLOG_POSTS.map( ( post ) => (
                                <div key={ post.title } data-chip className="group flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-6 py-5 backdrop-blur hover:border-[#b4ff00]/30 transition-colors cursor-pointer">
                                    <div className="flex items-start gap-5">
                                        <span className="hidden sm:block mt-0.5 text-xs uppercase tracking-[0.2em] text-[#b4ff00] min-w-[80px]">{ post.tag }</span>
                                        <p className="font-medium text-white group-hover:text-[#b4ff00] transition-colors">{ post.title }</p>
                                    </div>
                                    <span className="text-xs text-white/35 shrink-0 ml-4">{ post.read } read</span>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </Scene>

                {/* ──────────────── SCENE 20: CONTACT ──────────────── */ }
                <Scene id="contact" index={ 19 }>
                    <div className="text-center">
                        <h2 data-title className="text-4xl font-bold sm:text-6xl lg:text-8xl">Let's<br /><span className="text-[#b4ff00]">Build.</span></h2>
                        <p data-subtitle className="mx-auto mt-6 max-w-lg text-base text-white/60 leading-relaxed">
                            I'm open to freelance projects, full-time roles, and interesting collaborations.
                            If you're building something ambitious — I want to hear about it.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <a
                                data-magnetic
                                href="mailto:allahabadkin@gmail.com"
                                className="rounded-full bg-[#b4ff00] px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black shadow-[0_0_40px_rgba(180,255,0,0.5)] hover:shadow-[0_0_60px_rgba(180,255,0,0.7)] transition-shadow"
                            >
                                Email Me
                            </a>
                            <a
                                data-magnetic
                                href="https://github.com/AKASHPATEL123500"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-white/25 px-10 py-4 text-sm font-medium uppercase tracking-[0.25em] text-white/70 hover:border-white hover:text-white transition-all"
                            >
                                GitHub
                            </a>
                        </div>
                        <p className="mt-8 text-sm text-white/35">allahabadkin@gmail.com</p>
                    </div>
                </Scene>
            </main>

            <Footer />
        </div>
    );
}