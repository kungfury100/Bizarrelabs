LottieScrollTrigger({
  target: "#alien-logo",
  path: "https://lottie.host/9766de83-cefa-46a0-8f00-fc2e57a25f42/DLjAGxkGpb.json",
  speed: "medium",
  scrub: 2, // seconds it takes for the playhead to "catch up"
  // you can also add ANY ScrollTrigger values here too, like trigger, start, end, onEnter, onLeave, onUpdate, etc. See https://greensock.com/docs/v3/Plugins/ScrollTrigger
  // you can pass in a "timeline" that has existing animations in it, and LottieScrollTrigger will play that alongside the Lottie animation
  // you can pass a startFrameOffset and/or endFrameOffset to cause the playhead to start/end at a different frame.
});

function LottieScrollTrigger(vars) {
  let playhead = { frame: vars.startFrameOffset || 0 },
    target = gsap.utils.toArray(vars.target)[0],
    speeds = { slow: "+=2000", medium: "+=1000", fast: "+=500" },
    st = {
      trigger: target,
      pin: true,
      start: "top top",
      end: speeds[vars.speed] || "+=1000",
      scrub: 1,
    },
    ctx = gsap.context && gsap.context(),
    animation = lottie.loadAnimation({
      container: target,
      renderer: vars.renderer || "svg",
      loop: false,
      autoplay: false,
      path: vars.path,
      rendererSettings: vars.rendererSettings || {
        preserveAspectRatio: "xMidYMid slice",
      },
    }),
    frameAnimation;
  for (let p in vars) {
    // let users override the ScrollTrigger defaults
    st[p] = vars[p];
  }
  frameAnimation = vars.timeline || gsap.timeline({ scrollTrigger: st });
  if (vars.timeline && !vars.timeline.vars.scrollTrigger) {
    // if the user passed in a timeline that didn't have a ScrollTrigger attached, create one.
    st.animation = frameAnimation;
    ScrollTrigger.create(st);
  }
  animation.addEventListener("DOMLoaded", function () {
    let createTween = function () {
      animation.goToAndStop(playhead.frame, true);
      frameAnimation.to(
        playhead,
        {
          frame: animation.totalFrames - 1 - (vars.endFrameOffset || 0),
          ease: "none",
          duration: frameAnimation.duration() || 1,
          onUpdate: () => {
            animation.goToAndStop(playhead.frame, true);
          },
        },
        vars.sequence ? ">" : 0,
      );
      return () => animation.destroy && animation.destroy();
    };
    ctx && ctx.add ? ctx.add(createTween) : createTween();
    // in case there are any other ScrollTriggers on the page and the loading of this Lottie asset caused layout changes
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
  animation.frameAnimation = frameAnimation;
  return animation;
}
