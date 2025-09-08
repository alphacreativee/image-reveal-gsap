document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll(".img:not([data-origin])").forEach((img, index) => {
    img.setAttribute("data-origin", index % 2 === 0 ? "left" : "right");
  });
  gsap.set(".img", {
    scale: 0,
    force3D: true,
  });

  const workRows = document.querySelectorAll(".work-row");

  workRows.forEach((row, index) => {
    const rowImgs = row.querySelectorAll(".img");
    if (rowImgs.length > 0) {
      row.id = `work-row-${index}`;
      ScrollTrigger.create({
        id: `scaleIn-${index}`,
        trigger: row,
        start: "top bottom",
        end: "bottom bottom-=10%",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (self.isActive) {
            const progress = self.progress;
            const easedProgress = Math.min(1, progress * 1.2);
            const scaleValue = gsap.utils.interpolate(0, 1, easedProgress);

            rowImgs.forEach((img) => {
              gsap.set(img, {
                scale: scaleValue,
                force3D: true,
              });
            });

            if (progress > 0.95) {
              gsap.set(rowImgs, {
                scale: 1,
                force3D: true,
              });
            }
          }
        },
        onLeave: function () {
          gsap.set(rowImgs, {
            scale: 1,
            force3D: true,
          });
        },
      });

      ScrollTrigger.create({
        id: `scaleOut-${index}`,
        trigger: row,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        scrub: 1,
        invalidateOnRefresh: true,
        onEnter: function () {
          gsap.set(rowImgs, {
            scale: 1,
            force3D: true,
          });
        },
        onUpdate: function (self) {
          if (self.isActive) {
            const scale = gsap.utils.interpolate(1, 0, self.progress);
            rowImgs.forEach((img) => {
              gsap.set(img, {
                scale: scale,
                force3D: true,
                clearProps: self.progress === 1 ? "scale" : "",
              });
            });
          } else {
            const isAbove = self.scroll() < self.start;
            if (isAbove) {
              gsap.set(rowImgs, {
                scale: 1,
                force3D: true,
              });
            }
          }
        },
      });

      ScrollTrigger.create({
        id: `marker-${index}`,
        trigger: row,
        start: "bottom bottom",
        end: "top top",
        // markers: true,
        onEnter: () => {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImgs, {
              scale: 1,
              force3D: true,
            });
          }
        },
        onLeave: () => {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImgs, {
              scale: 1,
              force3D: true,
            });
          }
        },
        onEnterBack: () => {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImgs, {
              scale: 1,
              force3D: true,
            });
          }
        },
      });
    }
  });
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh(true);
  });
});
