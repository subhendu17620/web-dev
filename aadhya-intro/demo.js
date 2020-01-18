{
  const mapNumber = (X, A, B, C, D) => ((X - A) * (D - C)) / (B - A) + C;
  // from http://www.quirksmode.org/js/events_properties.html#position
  const getMousePos = e => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      posy =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }
    return { x: posx, y: posy };
  };
  // Generate a random float.
  const getRandomFloat = (min, max) =>
    (Math.random() * (max - min) + min).toFixed(2);
  // Effect 21
  class HoverImgFx20 {
    constructor(el) {
      this.DOM = { el: el };

      this.DOM.reveal = document.createElement("div");
      this.DOM.reveal.className = "hover-reveal";
      this.totalImages = 15;
      let inner = "";
      for (let i = 0; i <= this.totalImages - 1; ++i) {
        inner +=
          i === this.totalImages - 1
            ? `<div class="hover-reveal__img" style="position: absolute; background-image:url(${this.DOM.el.dataset.img})"></div>`
            : `<div class="hover-reveal__img" style="filter: hue-rotate(90deg) saturate(9); position: absolute; background-image:url(${this.DOM.el.dataset.img})"></div>`;
      }
      this.DOM.reveal.innerHTML = inner;
      this.DOM.el.appendChild(this.DOM.reveal);
      this.DOM.revealImgs = [
        ...this.DOM.reveal.querySelectorAll(".hover-reveal__img")
      ];
      this.rect = this.DOM.reveal.getBoundingClientRect();
      charming(this.DOM.el);
      this.DOM.letters = [...this.DOM.el.querySelectorAll("span")];
      this.letterColor = getComputedStyle(this.DOM.el).color;
      this.initEvents();
    }
    initEvents() {
      this.positionElement = ev => {
        const mousePos = getMousePos(ev);
        const docScrolls = {
          left: document.body.scrollLeft + document.documentElement.scrollLeft,
          top: document.body.scrollTop + document.documentElement.scrollTop
        };
        this.DOM.reveal.style.top = `${mousePos.y -
          this.rect.height -
          20 -
          docScrolls.top}px`;
        this.DOM.reveal.style.left = `${mousePos.x + 20 - docScrolls.left}px`;
      };
      this.mouseenterFn = ev => {
        this.positionElement(ev);
        this.animateLetters();
        this.showImage();
      };
      this.mousemoveFn = ev =>
        requestAnimationFrame(() => {
          this.positionElement(ev);
        });
      this.mouseleaveFn = () => {
        this.hideImage();
      };

      this.DOM.el.addEventListener("mouseenter", this.mouseenterFn);
      this.DOM.el.addEventListener("mousemove", this.mousemoveFn);
      this.DOM.el.addEventListener("mouseleave", this.mouseleaveFn);
    }
    showImage() {
      TweenMax.killTweensOf(this.DOM.revealImgs);
      this.tl = new TimelineMax({
        onStart: () => {
          this.DOM.reveal.style.opacity = 1;
          TweenMax.set(this.DOM.el, { zIndex: 1000 });
        }
      }).set(this.DOM.revealImgs, { opacity: 0 });

      for (let i = 0; i <= this.totalImages - 1; ++i) {
        TweenMax.set(this.DOM.revealImgs[i], {
          x: `${i !== this.totalImages - 1 ? getRandomFloat(-45, 45) : 0}%`,
          y: `${i !== this.totalImages - 1 ? getRandomFloat(-45, 45) : 0}%`,
          rotation: `${
            i !== this.totalImages - 1 ? getRandomFloat(-10, 10) : 0
          }`,
          scale: `${
            i !== this.totalImages - 1 ? getRandomFloat(0.1, 1.2) : 0.9
          }`
        });

        this.tl.add(
          new TweenMax(this.DOM.revealImgs[i], 0.5, {
            ease: Quint.easeOut,
            startAt:
              i === this.totalImages - 1
                ? { opacity: 1, x: "0%", y: "0%" }
                : { opacity: 1 },
            opacity: i === this.totalImages - 1 ? 1 : 0,
            x: i === this.totalImages - 1 ? "0%" : null,
            y: i === this.totalImages - 1 ? "0%" : null,
            scale: i === this.totalImages - 1 ? 1 : null
          }),
          i * 0.02
        );
      }
    }
    hideImage() {
      TweenMax.killTweensOf(this.DOM.revealImgs);
      this.tl = new TimelineMax({
        onStart: () => {
          TweenMax.set(this.DOM.el, { zIndex: 999 });
        },
        onComplete: () => {
          TweenMax.set(this.DOM.el, { zIndex: "" });
          TweenMax.set(this.DOM.reveal, { opacity: 0 });
        }
      }).add(
        new TweenMax(this.DOM.revealImgs[this.totalImages - 1], 0.15, {
          ease: Sine.easeOut,
          opacity: 0
        })
      );
    }
    animateLetters() {
      const setColor = letter =>
        TweenMax.set(letter, {
          color: ["#fff", "#0ff", "#f0f"][parseInt(getRandomFloat(0, 3))],
          opacity: Math.round(Math.random()) === 0 ? 1 : 0
        });
      this.DOM.letters.forEach(letter => {
        TweenMax.to(letter, 0.1, {
          ease: Expo.easeOut,
          onStart: () => setColor(letter),
          onRepeat: () => setColor(letter),
          startAt: {
            x: `${getRandomFloat(-50, 50)}%`,
            y: `${getRandomFloat(-50, 50)}%`
          },
          x: "0%",
          y: "0%",
          repeat: 3,
          onComplete: () =>
            TweenMax.set(letter, { color: this.letterColor, opacity: 1 })
        });
      });
    }
  }
  [...document.querySelectorAll('[data-fx="20"] > a, a[data-fx="20"]')].forEach(
    link => new HoverImgFx20(link)
  );
  // Demo purspose only: Preload all the images in the page..
  const contentel = document.querySelector(".content");
  [
    ...document.querySelectorAll(
      ".block__title, .block__link, .content__text-link"
    )
  ].forEach(el => {
    const imgsArr = el.dataset.img.split(",");
    for (let i = 0, len = imgsArr.length; i <= len - 1; ++i) {
      const imgel = document.createElement("img");
      imgel.style.visibility = "hidden";
      imgel.style.width = 0;
      imgel.src = imgsArr[i];
      imgel.className = "preload";
      contentel.appendChild(imgel);
    }
  });
  imagesLoaded(document.querySelectorAll(".preload"), () =>
    document.body.classList.remove("loading")
  );
}
