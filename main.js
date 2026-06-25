// js/main.js

document.getElementById("year").innerHTML =
new Date().getFullYear();

const prefersReducedMotion =
window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- NAVBAR BACKGROUND ON SCROLL ---------- */

const nav = document.querySelector("nav");

window.addEventListener("scroll", ()=>{

    if(window.scrollY > 50){
        nav.style.background="#ffffff";
    }
    else{
        nav.style.background="rgba(255,255,255,.95)";
    }

    updateBackToTop();
    updateActiveNavLink();

});


/* ---------- MOBILE NAV TOGGLE ---------- */

const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector("nav ul");

if(navToggle && navList){

    navToggle.addEventListener("click", ()=>{
        navToggle.classList.toggle("open");
        navList.classList.toggle("open");
    });

    navList.querySelectorAll("a").forEach(link=>{
        link.addEventListener("click", ()=>{
            navToggle.classList.remove("open");
            navList.classList.remove("open");
        });
    });

}


/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

function updateActiveNavLink(){

    let currentId = "";

    sections.forEach(section=>{
        const rect = section.getBoundingClientRect();
        if(rect.top <= 120 && rect.bottom >= 120){
            currentId = section.getAttribute("id");
        }
    });

    navLinks.forEach(link=>{
        link.classList.remove("active");
        if(link.getAttribute("href") === `#${currentId}`){
            link.classList.add("active");
        }
    });

}


/* ---------- COUNTERS (TRIGGERED ON SCROLL INTO VIEW) ---------- */

const counters = document.querySelectorAll(".counter");

function animateCounter(counter){

    const target = +counter.getAttribute("data-target");
    const duration = 1500;
    const stepTime = 16;
    const steps = duration/stepTime;
    const increment = target/steps;
    let current = 0;

    const updateCounter = ()=>{

        current += increment;

        if(current < target){
            counter.innerText = Math.ceil(current);
            setTimeout(updateCounter, stepTime);
        }
        else{
            counter.innerText = target;
        }

    };

    if(prefersReducedMotion){
        counter.innerText = target;
    }
    else{
        updateCounter();
    }

}


/* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */

const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");

if("IntersectionObserver" in window){

    const revealObserver = new IntersectionObserver((entries, observer)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("visible");

                const counterInside = entry.target.querySelectorAll(".counter");
                counterInside.forEach(counter=>{
                    if(counter.innerText === "0"){
                        animateCounter(counter);
                    }
                });

                observer.unobserve(entry.target);

            }

        });

    }, { threshold: 0.2 });

    revealTargets.forEach(target=> revealObserver.observe(target));

}
else{
    // Fallback: no IntersectionObserver support
    revealTargets.forEach(target=> target.classList.add("visible"));
    counters.forEach(animateCounter);
}


/* ---------- GALLERY IMAGE FADE-IN ---------- */

document.querySelectorAll(".gallery-item img").forEach(img=>{

    if(img.complete){
        img.classList.add("loaded");
    }
    else{
        img.addEventListener("load", ()=> img.classList.add("loaded"));
    }

});


/* ---------- TESTIMONIAL SLIDER ---------- */

const slides = document.querySelectorAll(".slide");
const sliderDotsContainer = document.querySelector(".slider-dots");
const prevArrow = document.querySelector(".slider-arrow.prev");
const nextArrow = document.querySelector(".slider-arrow.next");
const sliderEl = document.querySelector(".slider");

let currentSlide = 0;
let sliderInterval = null;
const SLIDE_DELAY = 5000;

// Build dots dynamically based on number of slides
if(sliderDotsContainer){

    slides.forEach((_, index)=>{

        const dot = document.createElement("button");
        dot.classList.add("slider-dot");
        dot.setAttribute("aria-label", `Aller au témoignage ${index + 1}`);

        if(index === 0){
            dot.classList.add("active");
        }

        dot.addEventListener("click", ()=>{
            goToSlide(index);
            restartAutoplay();
        });

        sliderDotsContainer.appendChild(dot);

    });

}

const dots = document.querySelectorAll(".slider-dot");

function goToSlide(index){

    slides.forEach(slide=> slide.classList.remove("active"));
    dots.forEach(dot=> dot.classList.remove("active"));

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");

    if(dots[currentSlide]){
        dots[currentSlide].classList.add("active");
    }

}

function nextSlide(){
    goToSlide(currentSlide + 1);
}

function prevSlide(){
    goToSlide(currentSlide - 1);
}

function startAutoplay(){

    if(prefersReducedMotion) return;

    sliderInterval = setInterval(nextSlide, SLIDE_DELAY);

}

function stopAutoplay(){
    clearInterval(sliderInterval);
}

function restartAutoplay(){
    stopAutoplay();
    startAutoplay();
}

if(nextArrow){
    nextArrow.addEventListener("click", ()=>{
        nextSlide();
        restartAutoplay();
    });
}

if(prevArrow){
    prevArrow.addEventListener("click", ()=>{
        prevSlide();
        restartAutoplay();
    });
}

if(sliderEl){
    sliderEl.addEventListener("mouseenter", stopAutoplay);
    sliderEl.addEventListener("mouseleave", startAutoplay);
}

if(slides.length > 0){
    startAutoplay();
}


/* ---------- BACK TO TOP ---------- */

const backToTopBtn = document.querySelector(".back-to-top");

function updateBackToTop(){

    if(!backToTopBtn) return;

    if(window.scrollY > 600){
        backToTopBtn.classList.add("show");
    }
    else{
        backToTopBtn.classList.remove("show");
    }

}

if(backToTopBtn){

    backToTopBtn.addEventListener("click", ()=>{
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });

}
