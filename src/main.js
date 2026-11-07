import '@fontsource-variable/plus-jakarta-sans/index.css';
import '@fontsource/caveat/700.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = document.documentElement.classList.contains('rm');

const inkIn = (paths) => paths.forEach((p) => { p.style.strokeDasharray = 1; p.style.strokeDashoffset = 1; });

function typeWords() {
  const el = document.getElementById('typed');
  const words = ['big programs', 'nine teams', 'peak events', 'big releases'];
  let w = 0, n = words[0].length, deleting = true;
  const step = () => {
    const word = words[w];
    n += deleting ? -1 : 1;
    el.textContent = word.slice(0, n);
    let wait = deleting ? 38 : 72;
    if (!deleting && n === word.length) { deleting = true; wait = 2200; }
    else if (deleting && n === 0) { deleting = false; w = (w + 1) % words.length; wait = 240; }
    setTimeout(step, wait);
  };
  setTimeout(step, 2600);
}

function boot() {
  if (reduced) return;

  const lenis = new Lenis({ lerp: .14 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.1 }); }
  }));

  /* Hero: settle in, then the checklist ticks itself off. */
  gsap.from(['h1 > span', '.lede', '.actions'], { y: 20, opacity: 0, duration: .7, ease: 'power3.out', stagger: .07 });
  gsap.from('#checklist', { y: 30, opacity: 0, rotation: 6, duration: .8, ease: 'power3.out', delay: .15 });
  const ticks = $$('#checklist .tick');
  inkIn(ticks);
  gsap.to(ticks, { strokeDashoffset: 0, duration: .32, ease: 'power1.inOut', stagger: .3, delay: .8 });
  typeWords();

  /* Quiet entrances as you read. */
  $$('[data-rise]').forEach((el) => {
    gsap.from(el, { y: 26, opacity: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* The highlighter passes under each result. */
  $$('.scribble path').forEach((p) => {
    inkIn([p]);
    gsap.to(p, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut', delay: .35, scrollTrigger: { trigger: p, start: 'top 85%', once: true } });
  });

  /* A pen line draws down the page beside the questions. */
  const line = document.getElementById('howLine');
  inkIn([line]);
  gsap.to(line, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.how__body', start: 'top 70%', end: 'bottom 70%', scrub: .5 } });
  $$('.steps li').forEach((li) => {
    gsap.from(li, { opacity: .18, duration: .5, scrollTrigger: { trigger: li, start: 'top 72%', once: true } });
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

boot();
