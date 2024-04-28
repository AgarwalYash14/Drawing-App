gsap.from("#page1 #square", {
    // scale: 0,
    // delay: 1,
    duration: 4,
    ease: "none",
    repeat: -1,
    rotate: 360,
});

gsap.to("#rect", {
    duration: 3,
    repeat: -1,
    repeatDelay: 2,
    yoyo: true,
    ease: "power1.inOut",
    motionPath: {
        path: "#path",
        align: "#path",
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
    },
});
