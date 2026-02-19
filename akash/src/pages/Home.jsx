import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
    Github, Mail, ExternalLink, ChevronDown, Code2, Database, Server,
    Globe, Terminal, Zap, Layers, Cpu, Menu, X, ArrowRight, Star,
    Award, BookOpen, Coffee, Briefcase, User, MessageSquare, Phone,
    Twitter, Linkedin, Instagram, Download, Eye, Heart, Send,
    CheckCircle, Clock, MapPin, Calendar, TrendingUp, Shield, Rocket
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   GLOBAL STYLES INJECTED
═══════════════════════════════════════════════════ */
const GlobalStyles = () => (
    <style>{ `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Syne', sans-serif;
      background: #060b0b;
      color: #fff;
      overflow-x: hidden;
    }
    * { cursor: none !important; }
    .mono { font-family: 'JetBrains Mono', monospace !important; }
    .serif { font-family: 'Crimson Pro', serif !important; }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #060b0b; }
    ::-webkit-scrollbar-thumb { background: #00ff88; border-radius: 4px; }
    ::selection { background: rgba(0,255,136,0.25); color: #fff; }

    .grid-bg {
      background-image:
        linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px);
      background-size: 64px 64px;
    }
    .noise {
      position: relative;
    }
    .noise::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-18px); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes ping-slow {
      0% { transform: scale(1); opacity: 1; }
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    .float { animation: float 5s ease-in-out infinite; }
    .spin-slow { animation: spin-slow 12s linear infinite; }
    .ping-slow { animation: ping-slow 2s cubic-bezier(0,0,0.2,1) infinite; }

    input, textarea {
      font-family: 'JetBrains Mono', monospace;
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════ */
function Cursor() {
    const cx = useMotionValue( -100 );
    const cy = useMotionValue( -100 );
    const sx = useSpring( cx, { stiffness: 600, damping: 35 } );
    const sy = useSpring( cy, { stiffness: 600, damping: 35 } );
    const tx = useSpring( cx, { stiffness: 80, damping: 20 } );
    const ty = useSpring( cy, { stiffness: 80, damping: 20 } );
    const [ clicked, setClicked ] = useState( false );
    const [ hovered, setHovered ] = useState( false );

    useEffect( () => {
        const move = ( e ) => { cx.set( e.clientX ); cy.set( e.clientY ); };
        const down = () => setClicked( true );
        const up = () => setClicked( false );
        const over = ( e ) => setHovered( !!e.target.closest( 'a,button,[data-hover]' ) );
        window.addEventListener( "mousemove", move );
        window.addEventListener( "mousedown", down );
        window.addEventListener( "mouseup", up );
        window.addEventListener( "mouseover", over );
        return () => {
            window.removeEventListener( "mousemove", move );
            window.removeEventListener( "mousedown", down );
            window.removeEventListener( "mouseup", up );
            window.removeEventListener( "mouseover", over );
        };
    }, [] );

    return (
        <>
            <motion.div
                style={ { x: sx, y: sy, translateX: "-50%", translateY: "-50%" } }
                animate={ { scale: clicked ? 0.7 : hovered ? 1.8 : 1 } }
                className="fixed top-0 left-0 w-3 h-3 rounded-full bg-[#00ff88] pointer-events-none z-[9999] mix-blend-difference"
            />
            <motion.div
                style={ { x: tx, y: ty, translateX: "-50%", translateY: "-50%" } }
                animate={ { scale: hovered ? 1.5 : 1, opacity: hovered ? 0.4 : 0.7 } }
                className="fixed top-0 left-0 w-9 h-9 rounded-full border border-[#00ff88] pointer-events-none z-[9998]"
            />
        </>
    );
}

/* ═══════════════════════════════════════════════════
   SCROLL PROGRESS
═══════════════════════════════════════════════════ */
function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring( scrollYProgress, { stiffness: 200, damping: 30 } );
    return (
        <motion.div
            style={ { scaleX } }
            className="fixed top-0 left-0 right-0 h-[2px] bg-[#00ff88] origin-left z-[999] shadow-[0_0_10px_#00ff88]"
        />
    );
}

/* ═══════════════════════════════════════════════════
   REVEAL WRAPPERS
═══════════════════════════════════════════════════ */
function FadeUp( { children, delay = 0, className = "" } ) {
    const ref = useRef( null );
    const inView = useInView( ref, { once: true, margin: "-80px" } );
    return (
        <motion.div ref={ ref } className={ className }
            initial={ { y: 55, opacity: 0 } }
            animate={ inView ? { y: 0, opacity: 1 } : {} }
            transition={ { duration: 0.75, delay, ease: [ 0.22, 1, 0.36, 1 ] } }
        >{ children }</motion.div>
    );
}

function SlideIn( { children, from = "left", delay = 0, className = "" } ) {
    const ref = useRef( null );
    const inView = useInView( ref, { once: true, margin: "-60px" } );
    const x = from === "left" ? -60 : from === "right" ? 60 : 0;
    const y = from === "bottom" ? 60 : 0;
    return (
        <motion.div ref={ ref } className={ className }
            initial={ { x, y, opacity: 0 } }
            animate={ inView ? { x: 0, y: 0, opacity: 1 } : {} }
            transition={ { duration: 0.8, delay, ease: [ 0.22, 1, 0.36, 1 ] } }
        >{ children }</motion.div>
    );
}

function ScaleIn( { children, delay = 0, className = "" } ) {
    const ref = useRef( null );
    const inView = useInView( ref, { once: true, margin: "-60px" } );
    return (
        <motion.div ref={ ref } className={ className }
            initial={ { scale: 0.8, opacity: 0 } }
            animate={ inView ? { scale: 1, opacity: 1 } : {} }
            transition={ { duration: 0.7, delay, ease: [ 0.22, 1, 0.36, 1 ] } }
        >{ children }</motion.div>
    );
}

/* ═══════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════ */
function Typewriter( { words } ) {
    const [ idx, setIdx ] = useState( 0 );
    const [ sub, setSub ] = useState( 0 );
    const [ del, setDel ] = useState( false );
    const [ txt, setTxt ] = useState( "" );

    useEffect( () => {
        if ( sub === words[ idx ].length + 1 && !del ) { setTimeout( () => setDel( true ), 1400 ); return; }
        if ( sub === 0 && del ) { setDel( false ); setIdx( p => ( p + 1 ) % words.length ); return; }
        const t = setTimeout( () => {
            setTxt( words[ idx ].substring( 0, sub ) );
            setSub( p => p + ( del ? -1 : 1 ) );
        }, del ? 50 : 90 );
        return () => clearTimeout( t );
    }, [ sub, del, idx, words ] );

    return <span className="text-[#00ff88]">{ txt }<span className="animate-pulse">▌</span></span>;
}

/* ═══════════════════════════════════════════════════
   MARQUEE
═══════════════════════════════════════════════════ */
function Marquee( { items, speed = 30, reverse = false } ) {
    return (
        <div className="overflow-hidden flex">
            <motion.div
                className="flex gap-8 whitespace-nowrap shrink-0"
                animate={ { x: reverse ? [ "-50%", "0%" ] : [ "0%", "-50%" ] } }
                transition={ { duration: speed, repeat: Infinity, ease: "linear" } }
            >
                { [ ...items, ...items ].map( ( item, i ) => (
                    <span key={ i } className="text-xs mono tracking-[0.3em] uppercase text-[#00ff88]/40 flex items-center gap-4">
                        { item } <span className="text-[#00ff88]/60 text-base">◆</span>
                    </span>
                ) ) }
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════════════════ */
function SectionLabel( { num, text } ) {
    return (
        <FadeUp>
            <div className="flex items-center gap-3 mb-4">
                <span className="mono text-[#00ff88] text-xs tracking-widest">0{ num }.</span>
                <span className="mono text-[#8892b0] text-xs tracking-[0.3em] uppercase">{ text }</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#00ff88]/20 to-transparent" />
            </div>
        </FadeUp>
    );
}

/* ═══════════════════════════════════════════════════
   GLOWING BUTTON
═══════════════════════════════════════════════════ */
function GlowBtn( { children, onClick, href, variant = "primary", className = "" } ) {
    const base = "relative inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm tracking-widest uppercase rounded-full overflow-hidden transition-all duration-300";
    const styles = variant === "primary"
        ? "bg-[#00ff88] text-black hover:shadow-[0_0_40px_rgba(0,255,136,0.5)]"
        : "border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/80";

    const content = (
        <motion.span whileHover={ { scale: 1.04 } } whileTap={ { scale: 0.96 } } className={ `${ base } ${ styles } ${ className }` }>
            { children }
        </motion.span>
    );
    if ( href ) return <a href={ href } target="_blank" rel="noopener noreferrer">{ content }</a>;
    return <button onClick={ onClick }>{ content }</button>;
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const NAV_LINKS = [ "Home", "About", "Skills", "Services", "Projects", "Experience", "Education", "Testimonials", "Blog", "Contact" ];

const SKILLS = [
    { name: "HTML & CSS", level: 95, color: "#ff6b35", icon: <Globe size={ 16 } /> },
    { name: "JavaScript", level: 90, color: "#f7df1e", icon: <Zap size={ 16 } /> },
    { name: "TypeScript", level: 72, color: "#3178c6", icon: <Code2 size={ 16 } /> },
    { name: "React.js", level: 88, color: "#61dafb", icon: <Layers size={ 16 } /> },
    { name: "Next.js", level: 82, color: "#ffffff", icon: <Layers size={ 16 } /> },
    { name: "Node.js", level: 86, color: "#68a063", icon: <Server size={ 16 } /> },
    { name: "Express.js", level: 84, color: "#888", icon: <Server size={ 16 } /> },
    { name: "Python", level: 80, color: "#3776ab", icon: <Terminal size={ 16 } /> },
    { name: "OpenCV", level: 74, color: "#5c3ee8", icon: <Cpu size={ 16 } /> },
    { name: "MongoDB", level: 82, color: "#4db33d", icon: <Database size={ 16 } /> },
    { name: "PostgreSQL", level: 77, color: "#336791", icon: <Database size={ 16 } /> },
    { name: "JWT / WebAuthn", level: 78, color: "#ff4444", icon: <Shield size={ 16 } /> },
    { name: "REST APIs", level: 91, color: "#00ff88", icon: <Rocket size={ 16 } /> },
    { name: "Git & GitHub", level: 87, color: "#f05033", icon: <Github size={ 16 } /> },
    { name: "DSA (Learning)", level: 38, color: "#a855f7", icon: <TrendingUp size={ 16 } /> },
    { name: "Linux / Shell", level: 68, color: "#00ccff", icon: <Terminal size={ 16 } /> },
];

const PROJECTS = [
    { title: "FullStack Auth System", desc: "JWT + WebAuthn secure auth with biometric login, refresh tokens & RBAC.", tags: [ "Node.js", "JWT", "WebAuthn", "MongoDB" ], color: "#00ff88", emoji: "🔐", live: true },
    { title: "CV Image Processor", desc: "Real-time face detection & object tracking using Python & OpenCV.", tags: [ "Python", "OpenCV", "Flask", "NumPy" ], color: "#00ccff", emoji: "👁️", live: true },
    { title: "Analytics Dashboard", desc: "Full-stack dashboard with real-time charts & PostgreSQL backend.", tags: [ "Next.js", "PostgreSQL", "Tailwind" ], color: "#a855f7", emoji: "📊", live: true },
    { title: "E-Commerce Platform", desc: "Complete shop with cart, payments & admin panel.", tags: [ "React", "Node.js", "Stripe", "MongoDB" ], color: "#ff6b35", emoji: "🛒", live: false },
    { title: "Social Media App", desc: "Twitter-like platform with real-time updates & media uploads.", tags: [ "Next.js", "PostgreSQL", "WebSockets" ], color: "#f7df1e", emoji: "💬", live: false },
    { title: "DSA Visualizer", desc: "Interactive algorithms visualizer built while learning DSA.", tags: [ "React", "TypeScript", "Algorithms" ], color: "#ff4444", emoji: "🧠", live: false },
];

const SERVICES = [
    { icon: <Globe size={ 28 } />, title: "Frontend Development", desc: "Pixel-perfect, animated UIs with React/Next.js that users love.", color: "#00ff88" },
    { icon: <Server size={ 28 } />, title: "Backend Engineering", desc: "Scalable REST APIs with Node.js, Express & databases.", color: "#00ccff" },
    { icon: <Shield size={ 28 } />, title: "Auth & Security", desc: "JWT, WebAuthn, OAuth — secure auth systems from scratch.", color: "#a855f7" },
    { icon: <Cpu size={ 28 } />, title: "Computer Vision", desc: "Python & OpenCV for real-time image processing & detection.", color: "#ff6b35" },
    { icon: <Database size={ 28 } />, title: "Database Design", desc: "PostgreSQL & MongoDB — optimized schemas & queries.", color: "#f7df1e" },
    { icon: <Rocket size={ 28 } />, title: "Full Stack Projects", desc: "End-to-end web apps built solo from concept to deployment.", color: "#ff4444" },
];

const TIMELINE = [
    { year: "2022", title: "Started Coding", desc: "Began with HTML & CSS, built first static websites.", icon: <Code2 size={ 18 } />, color: "#00ff88" },
    { year: "2022", title: "JavaScript Deep Dive", desc: "Mastered DOM, ES6+, async/await and built JS projects.", icon: <Zap size={ 18 } />, color: "#f7df1e" },
    { year: "2023", title: "Backend Journey", desc: "Learned Node.js, Express, MongoDB. Built first REST APIs.", icon: <Server size={ 18 } />, color: "#00ccff" },
    { year: "2023", title: "React & Next.js", desc: "Dived into React ecosystem. State management, hooks, SSR.", icon: <Layers size={ 18 } />, color: "#61dafb" },
    { year: "2023", title: "Python & OpenCV", desc: "Explored computer vision. Face detection, image processing.", icon: <Cpu size={ 18 } />, color: "#3776ab" },
    { year: "2024", title: "BCA 1st Year", desc: "Started BCA. Combining academics with real-world projects.", icon: <BookOpen size={ 18 } />, color: "#a855f7" },
    { year: "2024", title: "Auth Systems Expert", desc: "Deep dive into JWT, WebAuthn, security best practices.", icon: <Shield size={ 18 } />, color: "#ff4444" },
    { year: "2024", title: "Starting DSA", desc: "Beginning Data Structures & Algorithms to crack interviews.", icon: <TrendingUp size={ 18 } />, color: "#ff6b35" },
];

const TESTIMONIALS = [
    { name: "Rahul Sharma", role: "Senior Dev @ TechCorp", text: "Akash's backend work is incredibly clean. His API design shows maturity beyond his years.", avatar: "RS", color: "#00ff88" },
    { name: "Priya Singh", role: "Startup Founder", text: "Built our entire auth system in a week. Robust, secure, and well-documented.", avatar: "PS", color: "#00ccff" },
    { name: "Amit Verma", role: "Full Stack Dev", text: "Collaborating with Akash was great. He writes clean code and picks up things insanely fast.", avatar: "AV", color: "#a855f7" },
    { name: "Neha Gupta", role: "Product Manager", text: "Delivered the dashboard ahead of schedule. The UI was stunning — clients were impressed.", avatar: "NG", color: "#f7df1e" },
];

const BLOGS = [
    { title: "Understanding JWT Auth from Scratch", tag: "Security", time: "5 min read", color: "#00ff88", emoji: "🔐" },
    { title: "Why I Chose Next.js Over Plain React", tag: "Frontend", time: "4 min read", color: "#61dafb", emoji: "⚡" },
    { title: "OpenCV Face Detection in 50 Lines", tag: "Python", time: "6 min read", color: "#3776ab", emoji: "👁️" },
    { title: "My DSA Learning Roadmap as a Dev", tag: "DSA", time: "3 min read", color: "#a855f7", emoji: "🧠" },
    { title: "Building REST APIs: Best Practices", tag: "Backend", time: "7 min read", color: "#00ccff", emoji: "🛠️" },
    { title: "WebAuthn: Passwordless Login Guide", tag: "Security", time: "8 min read", color: "#ff4444", emoji: "🛡️" },
];

const STATS_COUNTER = [
    { val: 2, suffix: "+", label: "Years Coding" },
    { val: 16, suffix: "+", label: "Technologies" },
    { val: 6, suffix: "", label: "Projects Built" },
    { val: 1000, suffix: "+", label: "Hours Coded" },
];

/* ═══════════════════════════════════════════════════
   COUNTER COMPONENT
═══════════════════════════════════════════════════ */
function Counter( { val, suffix } ) {
    const ref = useRef( null );
    const inView = useInView( ref, { once: true } );
    const [ count, setCount ] = useState( 0 );

    useEffect( () => {
        if ( !inView ) return;
        let start = 0;
        const end = val;
        const duration = 1800;
        const step = duration / end;
        const timer = setInterval( () => {
            start++;
            setCount( start );
            if ( start === end ) clearInterval( timer );
        }, step );
        return () => clearInterval( timer );
    }, [ inView, val ] );

    return <span ref={ ref }>{ count }{ suffix }</span>;
}

/* ═══════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════ */
function Navbar() {
    const [ open, setOpen ] = useState( false );
    const [ scrolled, setScrolled ] = useState( false );
    const [ active, setActive ] = useState( "Home" );

    useEffect( () => {
        const h = () => setScrolled( window.scrollY > 60 );
        window.addEventListener( "scroll", h );
        return () => window.removeEventListener( "scroll", h );
    }, [] );

    const scroll = ( id ) => {
        document.getElementById( id.toLowerCase() )?.scrollIntoView( { behavior: "smooth" } );
        setActive( id ); setOpen( false );
    };

    return (
        <motion.nav
            initial={ { y: -80 } }
            animate={ { y: 0 } }
            transition={ { duration: 0.9, ease: [ 0.22, 1, 0.36, 1 ] } }
            style={ { backdropFilter: scrolled ? "blur(20px)" : "none" } }
            className={ `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${ scrolled ? "bg-[#060b0b]/85 border-b border-[#00ff88]/8" : "" }` }
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <motion.button onClick={ () => scroll( "Home" ) } whileHover={ { scale: 1.06 } }
                    className="text-2xl font-black tracking-tighter text-white">
                    AK<span className="text-[#00ff88]">.</span>
                </motion.button>

                <ul className="hidden lg:flex gap-7">
                    { NAV_LINKS.map( ( l ) => (
                        <li key={ l }>
                            <button onClick={ () => scroll( l ) }
                                className={ `mono text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 ${ active === l ? "text-[#00ff88]" : "text-[#8892b0] hover:text-white" }` }>
                                { l }
                            </button>
                        </li>
                    ) ) }
                </ul>

                <motion.a href="mailto:allahabadkin@gmail.com"
                    className="hidden lg:flex items-center gap-2 px-5 py-2 border border-[#00ff88]/40 text-[#00ff88] mono text-[10px] tracking-widest rounded-full hover:bg-[#00ff88]/10 transition-all"
                    whileHover={ { scale: 1.05 } }>
                    <Mail size={ 12 } /> Hire Me
                </motion.a>

                <button className="lg:hidden text-white" onClick={ () => setOpen( !open ) }>
                    { open ? <X size={ 22 } /> : <Menu size={ 22 } /> }
                </button>
            </div>

            <AnimatePresence>
                { open && (
                    <motion.div initial={ { height: 0, opacity: 0 } } animate={ { height: "auto", opacity: 1 } }
                        exit={ { height: 0, opacity: 0 } }
                        className="lg:hidden bg-[#060b0b]/98 border-b border-[#00ff88]/10 overflow-hidden">
                        <div className="px-6 py-4 grid grid-cols-2 gap-2">
                            { NAV_LINKS.map( l => (
                                <button key={ l } onClick={ () => scroll( l ) }
                                    className="py-2.5 text-left mono text-[10px] tracking-widest uppercase text-[#8892b0] hover:text-[#00ff88] transition-colors border-b border-white/5">
                                    { l }
                                </button>
                            ) ) }
                        </div>
                    </motion.div>
                ) }
            </AnimatePresence>
        </motion.nav>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 1 — HERO
═══════════════════════════════════════════════════ */
function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform( scrollY, [ 0, 700 ], [ 0, 160 ] );
    const op = useTransform( scrollY, [ 0, 450 ], [ 1, 0 ] );

    const particles = Array.from( { length: 30 }, ( _, i ) => ( {
        x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 3 + 1, delay: Math.random() * 4, dur: Math.random() * 5 + 4,
    } ) );

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060b0b] grid-bg">
            {/* Glow blobs */ }
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00ff88]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00ccff]/5 blur-[100px] pointer-events-none" />

            {/* Floating particles */ }
            { particles.map( ( p, i ) => (
                <motion.div key={ i }
                    className="absolute rounded-full bg-[#00ff88]"
                    style={ { left: `${ p.x }%`, top: `${ p.y }%`, width: p.size, height: p.size } }
                    animate={ { y: [ -10, 10, -10 ], opacity: [ 0.2, 0.7, 0.2 ] } }
                    transition={ { duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" } }
                />
            ) ) }

            {/* Big number background */ }
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[200px] md:text-[300px] font-black text-[#00ff88]/[0.02] leading-none select-none pointer-events-none tracking-tighter">
                DEV
            </div>

            <motion.div style={ { y, opacity: op } } className="relative z-10 text-center max-w-5xl mx-auto px-6">
                <motion.div initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 0.2 } }
                    className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#00ff88]/20 rounded-full mono text-[10px] tracking-[0.4em] text-[#00ff88] uppercase mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] ping-slow" />
                    Available for work
                </motion.div>

                <div className="overflow-hidden mb-4">
                    <motion.h1
                        initial={ { y: "110%" } } animate={ { y: 0 } }
                        transition={ { duration: 1, ease: [ 0.22, 1, 0.36, 1 ], delay: 0.3 } }
                        className="text-7xl md:text-[110px] font-black tracking-tighter leading-none text-white">
                        Akash<br />
                        <span className="text-stroke">Patel</span>
                    </motion.h1>
                </div>

                <style>{ `.text-stroke { -webkit-text-stroke: 2px #00ff88; color: transparent; }` }</style>

                <motion.div initial={ { opacity: 0 } } animate={ { opacity: 1 } } transition={ { delay: 1 } }
                    className="text-2xl md:text-3xl font-bold text-[#8892b0] mb-8 h-10">
                    <Typewriter words={ [ "Full Stack Developer", "Backend Engineer", "Python Dev 🐍", "Problem Solver", "BCA Student 🎓", "Open Source Fan 🌍" ] } />
                </motion.div>

                <motion.p initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 1.2 } }
                    className="text-[#8892b0] text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    2+ years building <span className="text-white font-semibold">fast, scalable web apps</span>. From rock-solid backend APIs to stunning 3D frontends — I craft digital experiences that matter.
                </motion.p>

                <motion.div initial={ { opacity: 0, y: 30 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 1.4 } }
                    className="flex flex-wrap gap-4 justify-center mb-12">
                    <GlowBtn onClick={ () => document.getElementById( "projects" )?.scrollIntoView( { behavior: "smooth" } ) }>
                        View Projects <ArrowRight size={ 16 } />
                    </GlowBtn>
                    <GlowBtn href="https://github.com/AKASHPATEL123500" variant="outline">
                        <Github size={ 16 } /> GitHub
                    </GlowBtn>
                    <GlowBtn href="mailto:allahabadkin@gmail.com" variant="outline">
                        <Mail size={ 16 } /> Email
                    </GlowBtn>
                </motion.div>

                {/* Tech stack pills */ }
                <motion.div initial={ { opacity: 0 } } animate={ { opacity: 1 } } transition={ { delay: 1.7 } }
                    className="flex flex-wrap justify-center gap-2.5">
                    { [ "React", "Node.js", "Next.js", "Python", "MongoDB", "PostgreSQL", "Express" ].map( t => (
                        <span key={ t } className="mono text-[10px] px-3 py-1 rounded-full border border-white/8 text-[#8892b0] tracking-wider">
                            { t }
                        </span>
                    ) ) }
                </motion.div>
            </motion.div>

            {/* Scroll cue */ }
            <motion.div animate={ { y: [ 0, 10, 0 ] } } transition={ { repeat: Infinity, duration: 2.2 } }
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8892b0]">
                <span className="mono text-[10px] tracking-[0.4em] uppercase">Scroll</span>
                <ChevronDown size={ 18 } className="text-[#00ff88]" />
            </motion.div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 2 — MARQUEE STRIP
═══════════════════════════════════════════════════ */
function MarqueeStrip() {
    const items = [ "React", "Node.js", "Next.js", "Python", "OpenCV", "MongoDB", "PostgreSQL", "JWT", "WebAuthn", "Express", "TypeScript", "DSA", "REST API", "Git", "Linux" ];
    return (
        <div className="py-5 bg-[#00ff88]/4 border-y border-[#00ff88]/10 overflow-hidden">
            <Marquee items={ items } speed={ 30 } />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 3 — ABOUT
═══════════════════════════════════════════════════ */
function About() {
    return (
        <section id="about" className="relative py-32 bg-[#060b0b] overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#00ff88]/[0.025] text-[160px] font-black select-none pointer-events-none -rotate-90 leading-none">
                ABOUT
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <SectionLabel num={ 1 } text="About Me" />

                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* LEFT */ }
                    <div>
                        <SlideIn from="left">
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-8">
                                Passionate<br /><span className="text-[#00ff88]">Developer</span><br />
                                <span className="serif italic text-4xl text-[#8892b0] font-light">& Learner</span>
                            </h2>
                        </SlideIn>

                        <FadeUp delay={ 0.1 }>
                            <p className="text-[#8892b0] text-base leading-relaxed mb-5">
                                Hey! I'm <span className="text-white font-bold">Akash Patel</span> — a BCA 1st year student from <span className="text-[#00ff88]">Allahabad, UP</span> with a deep passion for building things on the web. I've been coding for <span className="text-white font-semibold">2+ years</span> and still get excited every single day.
                            </p>
                        </FadeUp>

                        <FadeUp delay={ 0.2 }>
                            <p className="text-[#8892b0] text-base leading-relaxed mb-5">
                                I specialize in <span className="text-white font-semibold">Full Stack Development</span> — designing REST APIs with Node.js & Express, building stunning UIs with React & Next.js, and securing apps with JWT & WebAuthn. I also dabble in Computer Vision with Python & OpenCV.
                            </p>
                        </FadeUp>

                        <FadeUp delay={ 0.3 }>
                            <p className="text-[#8892b0] text-base leading-relaxed mb-8">
                                Currently leveling up on <span className="text-[#a855f7] font-semibold">Data Structures & Algorithms</span>. Always learning, always shipping. 🚀
                            </p>
                        </FadeUp>

                        <FadeUp delay={ 0.4 }>
                            <div className="flex flex-wrap gap-3">
                                { [
                                    { label: "GitHub", icon: <Github size={ 14 } />, href: "https://github.com/AKASHPATEL123500", color: "text-[#00ff88] border-[#00ff88]/30" },
                                    { label: "Email", icon: <Mail size={ 14 } />, href: "mailto:allahabadkin@gmail.com", color: "text-[#00ccff] border-[#00ccff]/30" },
                                    // TODO: { label: "LinkedIn", icon: <Linkedin size={14}/>, href: "https://linkedin.com/in/YOUR_ID", color: "text-[#0077b5] border-[#0077b5]/30" },
                                    // TODO: { label: "Twitter", icon: <Twitter size={14}/>, href: "https://twitter.com/YOUR_HANDLE", color: "text-[#1da1f2] border-[#1da1f2]/30" },
                                ].map( s => (
                                    <motion.a key={ s.label } href={ s.href } target="_blank" whileHover={ { y: -3, scale: 1.05 } }
                                        className={ `flex items-center gap-2 px-4 py-2 border rounded-lg mono text-xs tracking-wider transition-all hover:bg-white/5 ${ s.color }` }>
                                        { s.icon } { s.label }
                                    </motion.a>
                                ) ) }
                            </div>
                        </FadeUp>
                    </div>

                    {/* RIGHT */ }
                    <div className="flex flex-col gap-5">
                        {/* Card */ }
                        <ScaleIn delay={ 0.2 }>
                            <div className="relative bg-[#0c1a0c] border border-[#00ff88]/10 rounded-2xl p-7 overflow-hidden group hover:border-[#00ff88]/30 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                                            <User size={ 20 } className="text-[#00ff88]" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">Akash Patel</div>
                                            <div className="mono text-[10px] text-[#8892b0] tracking-wider">Full Stack Developer</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        { [
                                            { icon: <MapPin size={ 13 } />, text: "Allahabad, Uttar Pradesh" },
                                            { icon: <BookOpen size={ 13 } />, text: "BCA 1st Year Student" },
                                            { icon: <Calendar size={ 13 } />, text: "2+ Years Experience" },
                                            { icon: <Coffee size={ 13 } />, text: "Chai + Code = Life ☕" },
                                        ].map( ( r, i ) => (
                                            <div key={ i } className="flex items-center gap-2.5 text-[#8892b0] mono text-xs">
                                                <span className="text-[#00ff88]">{ r.icon }</span> { r.text }
                                            </div>
                                        ) ) }
                                    </div>
                                </div>
                            </div>
                        </ScaleIn>

                        {/* Stats */ }
                        <div className="grid grid-cols-2 gap-4">
                            { STATS_COUNTER.map( ( s, i ) => (
                                <ScaleIn key={ s.label } delay={ 0.3 + i * 0.08 }>
                                    <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-xl p-5 text-center group"
                                        whileHover={ { y: -5, borderColor: "rgba(0,255,136,0.3)" } }>
                                        <div className="text-4xl font-black text-[#00ff88] mb-1 group-hover:scale-110 transition-transform">
                                            <Counter val={ s.val } suffix={ s.suffix } />
                                        </div>
                                        <div className="mono text-[10px] text-[#8892b0] tracking-widest uppercase">{ s.label }</div>
                                    </motion.div>
                                </ScaleIn>
                            ) ) }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 4 — SKILLS
═══════════════════════════════════════════════════ */
function Skills() {
    return (
        <section id="skills" className="relative py-32 bg-[#040909] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]"
                style={ { background: "radial-gradient(ellipse at 50% 50%, #00ff88, transparent 70%)" } } />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <SectionLabel num={ 2 } text="Technical Skills" />
                <FadeUp>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        My <span className="text-[#00ff88]">Arsenal</span>
                    </h2>
                </FadeUp>
                <FadeUp delay={ 0.1 }>
                    <p className="text-[#8892b0] text-base mb-14 max-w-lg">
                        16+ technologies mastered over 2+ years of daily practice and real project experience.
                    </p>
                </FadeUp>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    { SKILLS.map( ( s, i ) => (
                        <SkillCard key={ s.name } skill={ s } index={ i } />
                    ) ) }
                </div>

                {/* Radar-like visual */ }
                <FadeUp delay={ 0.3 }>
                    <div className="mt-16 flex flex-wrap justify-center gap-4">
                        { [ "Frontend", "Backend", "Database", "Security", "DevOps", "ML/CV" ].map( ( cat, i ) => (
                            <div key={ cat } className="flex items-center gap-2 px-4 py-2 bg-[#0c1a0c] border border-white/5 rounded-full">
                                <span className="w-2 h-2 rounded-full" style={ { background: [ "#00ff88", "#00ccff", "#4db33d", "#ff4444", "#f05033", "#3776ab" ][ i ] } } />
                                <span className="mono text-[10px] text-[#8892b0] tracking-wider">{ cat }</span>
                            </div>
                        ) ) }
                    </div>
                </FadeUp>
            </div>
        </section>
    );
}

function SkillCard( { skill, index } ) {
    const ref = useRef( null );
    const inView = useInView( ref, { once: true, margin: "-30px" } );
    return (
        <motion.div ref={ ref }
            initial={ { opacity: 0, y: 40 } } animate={ inView ? { opacity: 1, y: 0 } : {} }
            transition={ { delay: index * 0.05, duration: 0.6, ease: [ 0.22, 1, 0.36, 1 ] } }
            className="relative bg-[#0c1a0c] border border-white/5 rounded-xl p-5 overflow-hidden group"
            whileHover={ { y: -6, borderColor: `${ skill.color }35` } }>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={ { background: `radial-gradient(circle at 50% 120%, ${ skill.color }10, transparent 60%)` } } />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                        <span style={ { color: skill.color } }>{ skill.icon }</span>
                        <span className="text-white text-sm font-semibold">{ skill.name }</span>
                    </div>
                    <span className="mono text-xs" style={ { color: skill.color } }>{ skill.level }%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full"
                        style={ { background: `linear-gradient(90deg, ${ skill.color }50, ${ skill.color })` } }
                        initial={ { width: 0 } }
                        animate={ inView ? { width: `${ skill.level }%` } : {} }
                        transition={ { delay: index * 0.05 + 0.4, duration: 1.4, ease: "easeOut" } }
                    />
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 5 — SERVICES
═══════════════════════════════════════════════════ */
function Services() {
    return (
        <section id="services" className="relative py-32 bg-[#060b0b] overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#00ff88]/[0.025] text-[160px] font-black select-none pointer-events-none -rotate-90 leading-none">
                SERVICES
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <SectionLabel num={ 3 } text="What I Offer" />
                <FadeUp>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        Services
                    </h2>
                </FadeUp>
                <FadeUp delay={ 0.1 }>
                    <p className="text-[#8892b0] text-base mb-14 max-w-lg">
                        From idea to deployment — I cover the full spectrum of modern web development.
                    </p>
                </FadeUp>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    { SERVICES.map( ( s, i ) => (
                        <FadeUp key={ s.title } delay={ i * 0.1 }>
                            <motion.div
                                className="bg-[#0c1a0c] border border-white/5 rounded-2xl p-7 group overflow-hidden relative"
                                whileHover={ { y: -8, borderColor: `${ s.color }30` } }
                                transition={ { type: "spring", stiffness: 300 } }>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={ { background: `radial-gradient(circle at 20% 20%, ${ s.color }08, transparent 60%)` } } />
                                <div className="relative z-10">
                                    <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                                        style={ { background: `${ s.color }15` } }
                                        whileHover={ { rotate: 8, scale: 1.1 } }>
                                        <span style={ { color: s.color } }>{ s.icon }</span>
                                    </motion.div>
                                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00ff88] transition-colors">
                                        { s.title }
                                    </h3>
                                    <p className="text-[#8892b0] text-sm leading-relaxed">{ s.desc }</p>
                                    <motion.div className="mt-5 flex items-center gap-2 mono text-xs text-[#8892b0]"
                                        whileHover={ { x: 5 } }>
                                        <span style={ { color: s.color } }>Learn more</span>
                                        <ArrowRight size={ 12 } style={ { color: s.color } } />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </FadeUp>
                    ) ) }
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 6 — PROJECTS
═══════════════════════════════════════════════════ */
function Projects() {
    const [ filter, setFilter ] = useState( "All" );
    const tags = [ "All", "Live", "Coming Soon" ];
    const filtered = filter === "All" ? PROJECTS : filter === "Live" ? PROJECTS.filter( p => p.live ) : PROJECTS.filter( p => !p.live );

    return (
        <section id="projects" className="relative py-32 bg-[#040909] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <SectionLabel num={ 4 } text="My Work" />
                <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
                    <FadeUp>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                            Projects
                        </h2>
                    </FadeUp>
                    <FadeUp delay={ 0.1 }>
                        <div className="flex gap-2">
                            { tags.map( t => (
                                <button key={ t } onClick={ () => setFilter( t ) }
                                    className={ `mono text-[10px] px-4 py-2 rounded-full tracking-widest uppercase transition-all ${ filter === t ? "bg-[#00ff88] text-black font-bold" : "border border-white/10 text-[#8892b0] hover:text-white" }` }>
                                    { t }
                                </button>
                            ) ) }
                        </div>
                    </FadeUp>
                </div>

                <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
                    <AnimatePresence>
                        { filtered.map( ( p, i ) => (
                            <motion.div key={ p.title } layout
                                initial={ { opacity: 0, scale: 0.9 } } animate={ { opacity: 1, scale: 1 } }
                                exit={ { opacity: 0, scale: 0.9 } } transition={ { delay: i * 0.07, duration: 0.5 } }>
                                <ProjectCard project={ p } />
                            </motion.div>
                        ) ) }
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}

function ProjectCard( { project } ) {
    const [ hover, setHover ] = useState( false );
    return (
        <motion.div
            onMouseEnter={ () => setHover( true ) }
            onMouseLeave={ () => setHover( false ) }
            className="relative bg-[#0c1a0c] border border-white/5 rounded-2xl p-6 overflow-hidden flex flex-col gap-4 group h-full"
            whileHover={ { y: -8, borderColor: `${ project.color }25` } }>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={ { background: `radial-gradient(circle at 50% 0%, ${ project.color }06, transparent 55%)` } } />

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <motion.span className="text-4xl" animate={ { rotate: hover ? [ 0, 10, 0 ] : 0 } } transition={ { duration: 0.4 } }>
                        { project.emoji }
                    </motion.span>
                    <div className="flex items-center gap-2">
                        { project.live ? (
                            <span className="mono text-[9px] px-2.5 py-1 rounded-full border bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88] tracking-widest uppercase">Live</span>
                        ) : (
                            <span className="mono text-[9px] px-2.5 py-1 rounded-full border border-white/10 text-[#8892b0] tracking-widest uppercase">Soon</span>
                        ) }
                        { project.live && (
                            <motion.a href="https://github.com/AKASHPATEL123500" target="_blank"
                                className="text-[#8892b0] hover:text-[#00ff88] transition-colors"
                                whileHover={ { scale: 1.2, rotate: 15 } }>
                                <ExternalLink size={ 15 } />
                            </motion.a>
                        ) }
                    </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors duration-300">{ project.title }</h3>
                <p className="text-[#8892b0] text-sm leading-relaxed mb-5 flex-1">{ project.desc }</p>
                <div className="flex flex-wrap gap-1.5">
                    { project.tags.map( tag => (
                        <span key={ tag } className="mono text-[9px] px-2 py-0.5 rounded-full"
                            style={ { color: project.color, border: `1px solid ${ project.color }20`, background: `${ project.color }05` } }>
                            { tag }
                        </span>
                    ) ) }
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 7 — EXPERIENCE / TIMELINE
═══════════════════════════════════════════════════ */
function Experience() {
    return (
        <section id="experience" className="relative py-32 bg-[#060b0b] overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                <SectionLabel num={ 5 } text="My Journey" />
                <FadeUp>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        Experience
                    </h2>
                </FadeUp>
                <FadeUp delay={ 0.1 }>
                    <p className="text-[#8892b0] text-base mb-16 max-w-lg">
                        2 years of continuous learning — every milestone shaped who I am as a developer.
                    </p>
                </FadeUp>

                <div className="relative">
                    {/* Center line */ }
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00ff88]/5 via-[#00ff88]/30 to-[#00ff88]/5" />

                    { TIMELINE.map( ( item, i ) => (
                        <TimelineItem key={ i } item={ item } index={ i } />
                    ) ) }
                </div>
            </div>
        </section>
    );
}

function TimelineItem( { item, index } ) {
    const ref = useRef( null );
    const inView = useInView( ref, { once: true, margin: "-60px" } );
    const isLeft = index % 2 === 0;

    return (
        <div ref={ ref } className={ `relative flex items-center gap-8 mb-12 ${ isLeft ? "flex-row" : "flex-row-reverse" }` }>
            <motion.div
                className={ `flex-1 ${ isLeft ? "text-right" : "text-left" }` }
                initial={ { x: isLeft ? -50 : 50, opacity: 0 } }
                animate={ inView ? { x: 0, opacity: 1 } : {} }
                transition={ { duration: 0.7, delay: index * 0.08, ease: [ 0.22, 1, 0.36, 1 ] } }>
                <div className="bg-[#0c1a0c] border border-white/5 rounded-xl p-5 inline-block max-w-xs group hover:border-[#00ff88]/25 transition-all duration-300"
                    style={ { borderLeft: isLeft ? "none" : `2px solid ${ item.color }40`, borderRight: isLeft ? `2px solid ${ item.color }40` : "none" } }>
                    <span className="mono text-xs mb-2 block" style={ { color: item.color } }>{ item.year }</span>
                    <h3 className="font-bold text-white mb-1.5 group-hover:text-[#00ff88] transition-colors">{ item.title }</h3>
                    <p className="text-[#8892b0] text-sm leading-relaxed">{ item.desc }</p>
                </div>
            </motion.div>

            {/* Center dot */ }
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 shrink-0"
                style={ { borderColor: item.color, background: "#060b0b" } }
                initial={ { scale: 0 } } animate={ inView ? { scale: 1 } : {} }
                transition={ { delay: index * 0.08 + 0.2, type: "spring", stiffness: 200 } }>
                <span style={ { color: item.color } }>{ item.icon }</span>
            </motion.div>

            <div className="flex-1" />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 8 — EDUCATION
═══════════════════════════════════════════════════ */
function Education() {
    const cards = [
        { degree: "Bachelor of Computer Applications (BCA)", school: "Allahabad University", year: "2024 – Present", status: "Current", icon: "🎓", color: "#00ff88" },
        { degree: "12th Science (PCM + CS)", school: "UP Board", year: "2022 – 2024", status: "Completed", icon: "📚", color: "#00ccff" },
        { degree: "Self-Taught Full Stack Dev", school: "Online Platforms", year: "2022 – Present", status: "Ongoing", icon: "💻", color: "#a855f7" },
    ];

    return (
        <section id="education" className="relative py-32 bg-[#040909] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <SectionLabel num={ 6 } text="Education" />
                <FadeUp>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        Learning <span className="text-[#00ff88]">Path</span>
                    </h2>
                </FadeUp>
                <FadeUp delay={ 0.1 }>
                    <p className="text-[#8892b0] text-base mb-14 max-w-lg">
                        Formal education + self-learning = unstoppable combination.
                    </p>
                </FadeUp>
                <div className="grid md:grid-cols-3 gap-6">
                    { cards.map( ( c, i ) => (
                        <ScaleIn key={ c.degree } delay={ i * 0.1 }>
                            <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-2xl p-7 group"
                                whileHover={ { y: -8, borderColor: `${ c.color }30` } }>
                                <span className="text-5xl mb-5 block">{ c.icon }</span>
                                <span className="mono text-[10px] px-2.5 py-1 rounded-full border tracking-widest uppercase mb-4 inline-block"
                                    style={ { color: c.color, borderColor: `${ c.color }30`, background: `${ c.color }08` } }>
                                    { c.status }
                                </span>
                                <h3 className="font-bold text-white text-base mb-2 group-hover:text-[#00ff88] transition-colors">{ c.degree }</h3>
                                <p className="text-[#8892b0] text-sm mb-1.5">{ c.school }</p>
                                <p className="mono text-[10px] text-[#8892b0]/60 tracking-wider">{ c.year }</p>
                            </motion.div>
                        </ScaleIn>
                    ) ) }
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 9 — MARQUEE 2
═══════════════════════════════════════════════════ */
function MarqueeStrip2() {
    const items = [ "Building in Public", "Open Source", "Clean Code", "Problem Solving", "Full Stack", "Backend Engineering", "Computer Vision", "DSA Journey" ];
    return (
        <div className="py-5 bg-[#00ff88]/3 border-y border-[#00ff88]/8 overflow-hidden">
            <Marquee items={ items } speed={ 35 } reverse />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 10 — TESTIMONIALS
═══════════════════════════════════════════════════ */
function Testimonials() {
    const [ active, setActive ] = useState( 0 );

    return (
        <section id="testimonials" className="relative py-32 bg-[#060b0b] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]"
                style={ { background: "radial-gradient(ellipse at 80% 50%, #00ff88, transparent 60%)" } } />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <SectionLabel num={ 7 } text="Testimonials" />
                <FadeUp>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-14">
                        What People <span className="text-[#00ff88]">Say</span>
                    </h2>
                </FadeUp>

                <div className="grid md:grid-cols-2 gap-6">
                    { TESTIMONIALS.map( ( t, i ) => (
                        <SlideIn key={ t.name } from={ i % 2 === 0 ? "left" : "right" } delay={ i * 0.1 }>
                            <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-2xl p-7 group relative overflow-hidden"
                                whileHover={ { y: -6, borderColor: `${ t.color }25` } }>
                                <div className="absolute top-4 right-6 text-[#00ff88]/10 text-7xl font-serif leading-none">"</div>
                                <p className="text-[#8892b0] text-base leading-relaxed mb-6 relative z-10 serif italic">
                                    "{ t.text }"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                                        style={ { background: `${ t.color }20`, color: t.color } }>
                                        { t.avatar }
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-sm">{ t.name }</div>
                                        <div className="mono text-[10px] text-[#8892b0] tracking-wider">{ t.role }</div>
                                    </div>
                                    <div className="ml-auto flex gap-0.5">
                                        { [ ...Array( 5 ) ].map( ( _, si ) => (
                                            <Star key={ si } size={ 12 } className="text-[#f7df1e] fill-[#f7df1e]" />
                                        ) ) }
                                    </div>
                                </div>
                            </motion.div>
                        </SlideIn>
                    ) ) }
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 11 — BLOG
═══════════════════════════════════════════════════ */
function Blog() {
    return (
        <section id="blog" className="relative py-32 bg-[#040909] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <SectionLabel num={ 8 } text="Writings" />
                <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
                    <FadeUp>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                            Blog Posts
                        </h2>
                    </FadeUp>
                    <FadeUp delay={ 0.1 }>
                        <span className="mono text-xs text-[#8892b0] tracking-widest border border-white/10 px-4 py-2 rounded-full">
                            Coming Soon 🔜
                        </span>
                    </FadeUp>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    { BLOGS.map( ( b, i ) => (
                        <FadeUp key={ b.title } delay={ i * 0.08 }>
                            <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-xl p-6 group cursor-pointer"
                                whileHover={ { y: -6, borderColor: `${ b.color }25` } }>
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-3xl">{ b.emoji }</span>
                                    <span className="mono text-[9px] px-2.5 py-1 rounded-full border tracking-widest uppercase"
                                        style={ { color: b.color, borderColor: `${ b.color }25`, background: `${ b.color }08` } }>
                                        { b.tag }
                                    </span>
                                </div>
                                <h3 className="font-bold text-white text-sm leading-snug mb-3 group-hover:text-[#00ff88] transition-colors">
                                    { b.title }
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="mono text-[10px] text-[#8892b0] flex items-center gap-1.5">
                                        <Clock size={ 10 } /> { b.time }
                                    </span>
                                    <motion.span className="mono text-[10px]" style={ { color: b.color } } whileHover={ { x: 4 } }>
                                        Read →
                                    </motion.span>
                                </div>
                            </motion.div>
                        </FadeUp>
                    ) ) }
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 12 — OPEN SOURCE / GITHUB STATS
═══════════════════════════════════════════════════ */
function GithubStats() {
    const stats = [
        { val: "50+", label: "Commits", icon: <CheckCircle size={ 18 } />, color: "#00ff88" },
        { val: "10+", label: "Repos", icon: <Layers size={ 18 } />, color: "#00ccff" },
        { val: "5+", label: "Stars", icon: <Star size={ 18 } />, color: "#f7df1e" },
        { val: "3+", label: "Forks", icon: <Github size={ 18 } />, color: "#a855f7" },
    ];

    return (
        <section className="py-24 bg-[#060b0b] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <SectionLabel num={ 9 } text="Open Source" />
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <FadeUp>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
                                GitHub <span className="text-[#00ff88]">Activity</span>
                            </h2>
                        </FadeUp>
                        <FadeUp delay={ 0.1 }>
                            <p className="text-[#8892b0] text-base leading-relaxed mb-7">
                                Consistently building and committing. Open source contributions are growing — every project is public for the world to learn from.
                            </p>
                        </FadeUp>
                        <FadeUp delay={ 0.2 }>
                            <GlowBtn href="https://github.com/AKASHPATEL123500" variant="outline">
                                <Github size={ 15 } /> View GitHub Profile
                            </GlowBtn>
                        </FadeUp>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        { stats.map( ( s, i ) => (
                            <ScaleIn key={ s.label } delay={ i * 0.1 }>
                                <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-xl p-5 group text-center"
                                    whileHover={ { y: -5, borderColor: `${ s.color }30` } }>
                                    <span style={ { color: s.color } } className="block mb-3 mx-auto w-fit">{ s.icon }</span>
                                    <div className="text-3xl font-black mb-1" style={ { color: s.color } }>{ s.val }</div>
                                    <div className="mono text-[10px] text-[#8892b0] tracking-widest uppercase">{ s.label }</div>
                                </motion.div>
                            </ScaleIn>
                        ) ) }
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 13 — TECH STACK VISUAL
═══════════════════════════════════════════════════ */
function TechStack() {
    const techs = [
        { name: "React", color: "#61dafb", emoji: "⚛️" },
        { name: "Node.js", color: "#68a063", emoji: "🟢" },
        { name: "Python", color: "#3776ab", emoji: "🐍" },
        { name: "MongoDB", color: "#4db33d", emoji: "🍃" },
        { name: "PostgreSQL", color: "#336791", emoji: "🐘" },
        { name: "Next.js", color: "#fff", emoji: "▲" },
        { name: "Express", color: "#888", emoji: "🚂" },
        { name: "Linux", color: "#00ccff", emoji: "🐧" },
    ];

    return (
        <section className="py-24 bg-[#040909] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <SectionLabel num={ 10 } text="Tech Stack" />
                <FadeUp>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-14">
                        Tools I <span className="text-[#00ff88]">Love</span>
                    </h2>
                </FadeUp>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    { techs.map( ( t, i ) => (
                        <ScaleIn key={ t.name } delay={ i * 0.08 }>
                            <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-2xl p-6 text-center group"
                                whileHover={ { y: -8, scale: 1.04, borderColor: `${ t.color }30` } }>
                                <span className="text-4xl mb-3 block">{ t.emoji }</span>
                                <span className="font-bold text-sm" style={ { color: t.color } }>{ t.name }</span>
                            </motion.div>
                        </ScaleIn>
                    ) ) }
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 14 — FUN FACTS
═══════════════════════════════════════════════════ */
function FunFacts() {
    const facts = [
        { text: "I drink ≥ 3 cups of chai while coding ☕", color: "#f7df1e" },
        { text: "Dark mode only — light mode is a crime 🌑", color: "#00ccff" },
        { text: "My first program was a calculator in class 9th 🧮", color: "#00ff88" },
        { text: "I debug faster with lo-fi music 🎵", color: "#a855f7" },
        { text: "Started DSA — Stack & Queue are my best friends 📚", color: "#ff6b35" },
        { text: "I can explain JWT auth better than most seniors 🔐", color: "#ff4444" },
    ];

    return (
        <section className="py-24 bg-[#060b0b] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <SectionLabel num={ 11 } text="Fun Facts" />
                <FadeUp>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-14">
                        About <span className="text-[#00ff88]">Me</span>
                    </h2>
                </FadeUp>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    { facts.map( ( f, i ) => (
                        <FadeUp key={ f.text } delay={ i * 0.08 }>
                            <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-xl p-5 flex items-start gap-3 group"
                                whileHover={ { y: -5, borderColor: `${ f.color }25` } }>
                                <span className="mt-0.5 shrink-0 text-lg">💡</span>
                                <p className="text-[#8892b0] text-sm leading-relaxed group-hover:text-white transition-colors">{ f.text }</p>
                            </motion.div>
                        </FadeUp>
                    ) ) }
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 15 — WHAT I'M LEARNING
═══════════════════════════════════════════════════ */
function CurrentlyLearning() {
    const items = [
        { title: "Data Structures & Algorithms", desc: "Arrays, Linked Lists, Trees, Graphs — building problem-solving muscle.", progress: 35, color: "#a855f7" },
        { title: "System Design", desc: "Learning how to design scalable, distributed systems.", progress: 20, color: "#00ccff" },
        { title: "Docker & DevOps", desc: "Containerization, CI/CD pipelines and deployment strategies.", progress: 30, color: "#00ff88" },
        { title: "Advanced TypeScript", desc: "Generics, utility types, strict mode patterns.", progress: 55, color: "#3178c6" },
    ];

    return (
        <section className="py-24 bg-[#040909] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <SectionLabel num={ 12 } text="Currently Learning" />
                <FadeUp>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
                        Always <span className="text-[#00ff88]">Growing</span>
                    </h2>
                </FadeUp>
                <FadeUp delay={ 0.1 }>
                    <p className="text-[#8892b0] text-base mb-14 max-w-lg">
                        The moment I stop learning is the moment I stop growing. Here's what's on my plate right now.
                    </p>
                </FadeUp>
                <div className="grid md:grid-cols-2 gap-6">
                    { items.map( ( item, i ) => (
                        <FadeUp key={ item.title } delay={ i * 0.1 }>
                            <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-xl p-6 group"
                                whileHover={ { y: -5, borderColor: `${ item.color }25` } }>
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-white text-sm group-hover:text-[#00ff88] transition-colors">{ item.title }</h3>
                                    <span className="mono text-xs ml-3 shrink-0" style={ { color: item.color } }>{ item.progress }%</span>
                                </div>
                                <p className="text-[#8892b0] text-xs leading-relaxed mb-4">{ item.desc }</p>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div className="h-full rounded-full"
                                        style={ { background: `linear-gradient(90deg, ${ item.color }50, ${ item.color })` } }
                                        initial={ { width: 0 } }
                                        whileInView={ { width: `${ item.progress }%` } }
                                        viewport={ { once: true } }
                                        transition={ { duration: 1.5, delay: i * 0.1, ease: "easeOut" } }
                                    />
                                </div>
                            </motion.div>
                        </FadeUp>
                    ) ) }
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 16 — CTA BANNER
═══════════════════════════════════════════════════ */
function CTABanner() {
    return (
        <section className="py-24 bg-[#060b0b] overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                <ScaleIn>
                    <motion.div className="relative rounded-3xl overflow-hidden border border-[#00ff88]/15 p-12 md:p-16 text-center"
                        style={ { background: "linear-gradient(135deg, #0c1a0c 0%, #060b0b 50%, #0a0c1a 100%)" } }>
                        <div className="absolute inset-0 opacity-20"
                            style={ { background: "radial-gradient(ellipse at 50% 0%, #00ff88, transparent 60%)" } } />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center mx-auto mb-6">
                                <Rocket size={ 30 } className="text-[#00ff88]" />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                                Have a Project<span className="text-[#00ff88]">?</span>
                            </h2>
                            <p className="text-[#8892b0] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                                Let's build something great together. I'm available for freelance projects, collaborations, and internships.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <GlowBtn href="mailto:allahabadkin@gmail.com">
                                    Let's Talk <ArrowRight size={ 16 } />
                                </GlowBtn>
                                <GlowBtn href="https://github.com/AKASHPATEL123500" variant="outline">
                                    <Github size={ 15 } /> See My Work
                                </GlowBtn>
                            </div>
                        </div>
                    </motion.div>
                </ScaleIn>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 17 — CONTACT FORM
═══════════════════════════════════════════════════ */
function Contact() {
    const ref = useRef( null );
    const inView = useInView( ref, { once: true, margin: "-80px" } );
    const [ form, setForm ] = useState( { name: "", email: "", subject: "", message: "" } );
    const [ sent, setSent ] = useState( false );

    const handleSubmit = ( e ) => {
        e.preventDefault();
        setSent( true );
        setForm( { name: "", email: "", subject: "", message: "" } );
        setTimeout( () => setSent( false ), 5000 );
    };

    return (
        <section id="contact" className="relative py-32 bg-[#040909] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]"
                style={ { background: "radial-gradient(ellipse at 50% 100%, #00ff88, transparent 55%)" } } />

            <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ ref }>
                <SectionLabel num={ 13 } text="Get In Touch" />
                <FadeUp>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">
                        Let's <span className="text-[#00ff88]">Connect</span>
                    </h2>
                </FadeUp>
                <FadeUp delay={ 0.1 }>
                    <p className="text-[#8892b0] text-base mb-14 max-w-lg">
                        Have a project? Want to collaborate? Or just say hi? My inbox is always open. 👋
                    </p>
                </FadeUp>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Info */ }
                    <SlideIn from="left">
                        <div className="flex flex-col gap-5">
                            { [
                                { icon: <Mail size={ 18 } />, label: "Email", val: "allahabadkin@gmail.com", href: "mailto:allahabadkin@gmail.com", color: "#00ff88" },
                                { icon: <Github size={ 18 } />, label: "GitHub", val: "AKASHPATEL123500", href: "https://github.com/AKASHPATEL123500", color: "#00ccff" },
                                { icon: <MapPin size={ 18 } />, label: "Location", val: "Allahabad, UP, India", href: null, color: "#a855f7" },
                                // TODO: { icon: <Linkedin size={18}/>, label: "LinkedIn", val: "your-linkedin-id", href: "https://linkedin.com/in/YOUR_ID", color: "#0077b5" },
                                // TODO: { icon: <Twitter size={18}/>, label: "Twitter", val: "@your_handle", href: "https://twitter.com/YOUR_HANDLE", color: "#1da1f2" },
                                // TODO: { icon: <Instagram size={18}/>, label: "Instagram", val: "@your_handle", href: "https://instagram.com/YOUR_HANDLE", color: "#e1306c" },
                            ].map( c => (
                                <motion.div key={ c.label } className="bg-[#0c1a0c] border border-white/5 rounded-xl p-5 flex items-center gap-4 group"
                                    whileHover={ { y: -4, borderColor: `${ c.color }25` } }>
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={ { background: `${ c.color }15` } }>
                                        <span style={ { color: c.color } }>{ c.icon }</span>
                                    </div>
                                    <div>
                                        <div className="mono text-[10px] text-[#8892b0] tracking-widest uppercase mb-0.5">{ c.label }</div>
                                        { c.href ? (
                                            <a href={ c.href } target="_blank" rel="noopener noreferrer"
                                                className="text-white text-sm font-semibold hover:text-[#00ff88] transition-colors">
                                                { c.val }
                                            </a>
                                        ) : (
                                            <span className="text-white text-sm font-semibold">{ c.val }</span>
                                        ) }
                                    </div>
                                </motion.div>
                            ) ) }

                            {/* Availability card */ }
                            <div className="bg-[#0c1a0c] border border-[#00ff88]/20 rounded-xl p-5">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-[#00ff88] ping-slow" />
                                    <span className="text-[#00ff88] font-bold text-sm">Available for Hire</span>
                                </div>
                                <p className="text-[#8892b0] text-xs leading-relaxed mono">
                                    Open to freelance, internship & collaboration opportunities. Response within 24hrs.
                                </p>
                            </div>
                        </div>
                    </SlideIn>

                    {/* Form */ }
                    <SlideIn from="right">
                        <motion.form onSubmit={ handleSubmit }
                            className="bg-[#0c1a0c] border border-white/5 rounded-2xl p-8 flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-4">
                                { [
                                    { id: "name", label: "Name", placeholder: "Your name", type: "text" },
                                    { id: "email", label: "Email", placeholder: "you@example.com", type: "email" },
                                ].map( f => (
                                    <div key={ f.id }>
                                        <label className="mono text-[10px] text-[#8892b0] tracking-widest uppercase mb-2 block">{ f.label }</label>
                                        <input type={ f.type } required value={ form[ f.id ] } placeholder={ f.placeholder }
                                            onChange={ e => setForm( { ...form, [ f.id ]: e.target.value } ) }
                                            className="w-full bg-white/4 border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder-[#8892b0]/40 focus:outline-none focus:border-[#00ff88]/50 transition-colors" />
                                    </div>
                                ) ) }
                            </div>

                            <div>
                                <label className="mono text-[10px] text-[#8892b0] tracking-widest uppercase mb-2 block">Subject</label>
                                <input type="text" required value={ form.subject } placeholder="Project idea / Collaboration / Hello"
                                    onChange={ e => setForm( { ...form, subject: e.target.value } ) }
                                    className="w-full bg-white/4 border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder-[#8892b0]/40 focus:outline-none focus:border-[#00ff88]/50 transition-colors" />
                            </div>

                            <div>
                                <label className="mono text-[10px] text-[#8892b0] tracking-widest uppercase mb-2 block">Message</label>
                                <textarea required rows={ 5 } value={ form.message } placeholder="Hey Akash, I have a project idea..."
                                    onChange={ e => setForm( { ...form, message: e.target.value } ) }
                                    className="w-full bg-white/4 border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder-[#8892b0]/40 focus:outline-none focus:border-[#00ff88]/50 transition-colors resize-none" />
                            </div>

                            <AnimatePresence mode="wait">
                                { sent ? (
                                    <motion.div key="sent" initial={ { opacity: 0, scale: 0.9 } } animate={ { opacity: 1, scale: 1 } } exit={ { opacity: 0 } }
                                        className="py-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl text-[#00ff88] font-bold text-center text-sm tracking-wide flex items-center justify-center gap-2">
                                        <CheckCircle size={ 16 } /> Message sent! I'll reply within 24hrs. 🎉
                                    </motion.div>
                                ) : (
                                    <motion.button key="btn" type="submit" whileHover={ { scale: 1.02, boxShadow: "0 0 50px rgba(0,255,136,0.35)" } } whileTap={ { scale: 0.97 } }
                                        className="w-full py-4 bg-[#00ff88] text-black font-black rounded-xl tracking-widest uppercase text-sm flex items-center justify-center gap-2">
                                        <Send size={ 15 } /> Send Message
                                    </motion.button>
                                ) }
                            </AnimatePresence>
                        </motion.form>
                    </SlideIn>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 18 — MARQUEE 3
═══════════════════════════════════════════════════ */
function MarqueeStrip3() {
    const items = [ "Available for Hire", "Freelance Ready", "Open Source", "Full Stack Dev", "Allahabad → Global", "Let's Build Together", "2 Years & Counting" ];
    return (
        <div className="py-5 bg-[#00ff88]/4 border-y border-[#00ff88]/10 overflow-hidden">
            <Marquee items={ items } speed={ 40 } />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 19 — FAQ
═══════════════════════════════════════════════════ */
function FAQ() {
    const [ open, setOpen ] = useState( null );
    const faqs = [
        { q: "Are you available for freelance work?", a: "Yes! I'm open to freelance projects, part-time contracts, and collaborations. Reach out via email and let's chat." },
        { q: "What kind of projects do you build?", a: "I specialize in full stack web apps — REST APIs, dashboards, auth systems, e-commerce, portfolios, SaaS tools, and computer vision apps." },
        { q: "How long does a typical project take?", a: "It depends on scope. A simple landing page takes 2-3 days. A full stack app with auth & dashboard can take 2-4 weeks." },
        { q: "What's your tech stack?", a: "Frontend: React/Next.js + Tailwind. Backend: Node.js + Express. DB: PostgreSQL & MongoDB. Auth: JWT/WebAuthn. Also Python for CV projects." },
        { q: "Do you work remotely?", a: "Absolutely! 100% remote-friendly. I communicate clearly via GitHub, email, and video calls." },
    ];

    return (
        <section className="py-24 bg-[#060b0b] overflow-hidden">
            <div className="max-w-3xl mx-auto px-6">
                <SectionLabel num={ 14 } text="FAQ" />
                <FadeUp>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-12">
                        Frequently Asked <span className="text-[#00ff88]">Questions</span>
                    </h2>
                </FadeUp>
                <div className="flex flex-col gap-3">
                    { faqs.map( ( f, i ) => (
                        <FadeUp key={ f.q } delay={ i * 0.06 }>
                            <motion.div className="bg-[#0c1a0c] border border-white/5 rounded-xl overflow-hidden"
                                whileHover={ { borderColor: "rgba(0,255,136,0.2)" } }>
                                <button onClick={ () => setOpen( open === i ? null : i ) }
                                    className="w-full flex items-center justify-between p-5 text-left">
                                    <span className="font-semibold text-white text-sm pr-4">{ f.q }</span>
                                    <motion.span animate={ { rotate: open === i ? 45 : 0 } } transition={ { duration: 0.2 } }
                                        className="text-[#00ff88] shrink-0">
                                        <X size={ 16 } />
                                    </motion.span>
                                </button>
                                <AnimatePresence>
                                    { open === i && (
                                        <motion.div initial={ { height: 0, opacity: 0 } } animate={ { height: "auto", opacity: 1 } }
                                            exit={ { height: 0, opacity: 0 } } transition={ { duration: 0.3 } }>
                                            <p className="px-5 pb-5 text-[#8892b0] text-sm leading-relaxed border-t border-white/5 pt-4">{ f.a }</p>
                                        </motion.div>
                                    ) }
                                </AnimatePresence>
                            </motion.div>
                        </FadeUp>
                    ) ) }
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════
   SECTION 20 — FOOTER
═══════════════════════════════════════════════════ */
function Footer() {
    const scroll = ( id ) => document.getElementById( id.toLowerCase() )?.scrollIntoView( { behavior: "smooth" } );
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#040909] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */ }
                    <div>
                        <motion.button onClick={ () => scroll( "Home" ) } whileHover={ { scale: 1.05 } }
                            className="text-3xl font-black tracking-tighter text-white mb-4 block text-left">
                            AK<span className="text-[#00ff88]">.</span>
                        </motion.button>
                        <p className="text-[#8892b0] text-sm leading-relaxed max-w-xs">
                            Full Stack Developer from Allahabad. Building fast, scalable, beautiful web apps. Available for hire.
                        </p>
                        <div className="flex gap-3 mt-5">
                            { [
                                { icon: <Github size={ 16 } />, href: "https://github.com/AKASHPATEL123500", color: "#00ff88" },
                                { icon: <Mail size={ 16 } />, href: "mailto:allahabadkin@gmail.com", color: "#00ccff" },
                                // TODO: { icon: <Linkedin size={16}/>, href: "https://linkedin.com/in/YOUR_ID", color: "#0077b5" },
                                // TODO: { icon: <Twitter size={16}/>, href: "https://twitter.com/YOUR_HANDLE", color: "#1da1f2" },
                            ].map( ( s, i ) => (
                                <motion.a key={ i } href={ s.href } target="_blank" whileHover={ { y: -4, scale: 1.1 } }
                                    className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center transition-all hover:border-[#00ff88]/40"
                                    style={ { color: s.color } }>
                                    { s.icon }
                                </motion.a>
                            ) ) }
                        </div>
                    </div>

                    {/* Quick links */ }
                    <div>
                        <h4 className="mono text-[10px] text-[#8892b0] tracking-[0.3em] uppercase mb-5">Navigate</h4>
                        <div className="grid grid-cols-2 gap-2">
                            { NAV_LINKS.map( l => (
                                <button key={ l } onClick={ () => scroll( l ) }
                                    className="mono text-[10px] text-[#8892b0] hover:text-[#00ff88] tracking-wider uppercase transition-colors text-left">
                                    { l }
                                </button>
                            ) ) }
                        </div>
                    </div>

                    {/* Contact */ }
                    <div>
                        <h4 className="mono text-[10px] text-[#8892b0] tracking-[0.3em] uppercase mb-5">Get In Touch</h4>
                        <div className="flex flex-col gap-3">
                            <a href="mailto:allahabadkin@gmail.com"
                                className="mono text-xs text-[#8892b0] hover:text-[#00ff88] transition-colors flex items-center gap-2">
                                <Mail size={ 12 } /> allahabadkin@gmail.com
                            </a>
                            <a href="https://github.com/AKASHPATEL123500" target="_blank"
                                className="mono text-xs text-[#8892b0] hover:text-[#00ff88] transition-colors flex items-center gap-2">
                                <Github size={ 12 } /> github.com/AKASHPATEL123500
                            </a>
                            <span className="mono text-xs text-[#8892b0] flex items-center gap-2">
                                <MapPin size={ 12 } /> Allahabad, Uttar Pradesh, IN
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="mono text-[10px] text-[#8892b0] tracking-wider">
                        © { year } Akash Patel. All rights reserved.
                    </p>
                    <p className="mono text-[10px] text-[#8892b0] tracking-wider flex items-center gap-2">
                        Built with <Heart size={ 10 } className="text-[#ff4444] fill-[#ff4444]" /> using React + Framer Motion + Tailwind
                    </p>
                    <motion.button onClick={ () => scroll( "Home" ) } whileHover={ { y: -3 } }
                        className="mono text-[10px] text-[#00ff88] tracking-widest border border-[#00ff88]/30 px-4 py-1.5 rounded-full hover:bg-[#00ff88]/10 transition-all uppercase">
                        Back to Top ↑
                    </motion.button>
                </div>
            </div>
        </footer>
    );
}

/* ═══════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════ */
export default function Home() {
    return (
        <>
            <GlobalStyles />
            <div className="bg-[#060b0b] min-h-screen overflow-x-hidden">
                <Cursor />
                <ScrollProgress />
                <Navbar />

                {/* 20 SECTIONS */ }
                <Hero />             {/* 1  */ }
                <MarqueeStrip />     {/* 2  */ }
                <About />            {/* 3  */ }
                <Skills />           {/* 4  */ }
                <Services />         {/* 5  */ }
                <Projects />         {/* 6  */ }
                <Experience />       {/* 7  */ }
                <Education />        {/* 8  */ }
                <MarqueeStrip2 />    {/* 9  */ }
                <Testimonials />     {/* 10 */ }
                <Blog />             {/* 11 */ }
                <GithubStats />      {/* 12 */ }
                <TechStack />        {/* 13 */ }
                <FunFacts />         {/* 14 */ }
                <CurrentlyLearning />{/* 15 */ }
                <CTABanner />        {/* 16 */ }
                <Contact />          {/* 17 */ }
                <MarqueeStrip3 />    {/* 18 */ }
                <FAQ />              {/* 19 */ }
                <Footer />           {/* 20 */ }
            </div>
        </>
    );
}