const scrollToTop = (duration: number = 500) => {
  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;

    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  const scroll = () => {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const scrollTo = Math.ceil(easeInOutQuad(time, start, -start, 1));

    window.scrollTo(0, scrollTo);
    if (time < 1) requestAnimationFrame(scroll);
  };

  requestAnimationFrame(scroll);
};


export default scrollToTop
