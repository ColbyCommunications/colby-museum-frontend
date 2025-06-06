import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import { useTransitionComposable } from '../composables/transition-composable';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const { toggleTransitionComplete } = useTransitionComposable();

const pageTransition = {
  name: 'page-transiton',
  mode: 'out-in',
  onEnter: (el, done) => {
    gsap
      .timeline({
        paused: true,
        onComplete() {
          toggleTransitionComplete(true);
          done();
        },
      })
      .play();
  },
  onLeave: (el, done) => {
    toggleTransitionComplete(false);

    let mm = gsap.matchMedia();
    let headings = el.querySelectorAll('.context__heading, .list-style-1, .breadcrumbs');
    let subheadings = el.querySelectorAll('.context__subheading');
    let curtains = el.querySelectorAll('.context__curtain');
    let btnCurtains = el.querySelectorAll('.btn-curtain');
    let horizontalCurtains = el.querySelectorAll('.horizontal-curtain');
    let verticalCurtains = el.querySelectorAll('.vertical-curtain');
    let bigArrows = el.querySelectorAll('.big-arrow-btn__arrow-wrap svg');
    let metaDataLists = el.querySelectorAll('.meta-data-list');
    let borderGlobalTops = el.querySelectorAll('.border-global--top, .border-global--bottom, .meta-data-list__main, .context--bordered .context__heading');
    let accordionSections = el.querySelectorAll('.accordion-section');
    let tl = gsap.timeline({ paused: true, onComplete: done });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    });

    if (headings) {
      headings.forEach((heading) => {
        let headingWords = heading.querySelectorAll('.context__word span');
  
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          tl
            .to(headingWords,
            {
              y: '100%',
              duration: 0.2,
              stagger: 0.05,
              ease: "expo.out",
            },
            '<');
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          tl
            .to(headingWords,
            {
              y: '100%',
              duration: 0,
              ease: "expo.out",
            },
            '<');
        });
      });
    }

    if (subheadings) {
      subheadings.forEach((subheading) => {
        let subheadingWords = subheading.querySelectorAll('.context__word span');
        let subheadingWordWraps = subheading.querySelectorAll('.context__word');

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          tl
            .to(subheadingWordWraps,
            {
              overflow: 'hidden',
              duration: 0,
            },
            '<');
    
          tl
            .to(subheadingWords,
            {
              y: '100%',
              duration: 0.2,
              stagger: 0.005,
              ease: "expo.out",
            },
            '<');
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          tl
            .to(subheadingWordWraps,
            {
              overflow: 'hidden',
              duration: 0,
            },
            '<');
    
          tl
            .to(subheadingWords,
            {
              y: '100%',
              duration: 0,
              ease: "expo.out",
            },
            '<');
        });
      });
    }

    if (curtains) {
      curtains.forEach((curtain) => {

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          tl
            .to(curtain,
            {
              height: '100%',
              duration: 0.4,
              ease: "expo.out",
            },
            '<');
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          tl
            .to(curtain,
            {
              height: '100%',
              duration: 0,
              ease: "expo.out",
            },
            '<');
        });
      })
    }

    if (btnCurtains) {
      btnCurtains.forEach((btnCurtain) => {

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          tl
            .to(btnCurtain,
            {
              width: '110%',
              duration: 0.2,
              ease: "expo.out",
            },
            '<');
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          tl
            .to(btnCurtain,
            {
              width: '110%',
              duration: 0,
              ease: "expo.out",
            },
            '<');
        });
      })
    }

    if (horizontalCurtains) {
      horizontalCurtains.forEach((horizontalCurtain) => {

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          tl
            .fromTo(horizontalCurtain,
            {
              right: 'auto',
              left: 0,
            },
            {
              width: '100%',
              duration: 0.2,
              ease: "expo.out",
            },
            '<');
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          tl
            .fromTo(horizontalCurtain,
            {
              right: 'auto',
              left: 0,
            },
            {
              width: '100%',
              duration: 0,
              ease: "expo.out",
            },
            '<');
        });
      })
    }

    if (verticalCurtains) {
      verticalCurtains.forEach((verticalCurtain) => {

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          tl
            .fromTo(verticalCurtain,
            {
              top: 'auto',
              bottom: 0,
            },
            {
              height: '100%',
              duration: 0.4,
              ease: "expo.out",
            },
            '<');
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          tl
            .fromTo(verticalCurtain,
            {
              top: 'auto',
              bottom: 0,
            },
            {
              height: '100%',
              duration: 0,
              ease: "expo.out",
            },
            '<');
        });
      })
    }

    if (bigArrows) {
      bigArrows.forEach((bigArrow) => {

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          tl
            .to(bigArrow, {
              x: '100%',
              duration: 0.4,
              ease: "expo.out",
            },
            '<');
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          tl
            .to(bigArrow, {
              x: '100%',
              duration: 0,
              ease: "expo.out",
            },
            '<');
        });
      })
    }

    if (metaDataLists) {
      metaDataLists.forEach((metaDataList) => {
        let headingWords = metaDataList.querySelectorAll('.context__word span');
  
        tl
          .to(headingWords,
          {
            y: '100%',
            duration: 0.2,
            stagger: 0.05,
            ease: "expo.out",
          },
          '<');
      });
    }

    if (borderGlobalTops) {
      borderGlobalTops.forEach((borderGlobalTop) => {
        tl.
          to(borderGlobalTop, {
            '--border-width': '100%',
            duration: 0.2,
            stagger: 0.1,
          },
          '<');
      })
    }

    if (accordionSections) {
      accordionSections.forEach((accordionSection) => {

        let accordionPanels = accordionSection.querySelectorAll('.accordion__panel');
        let headingWords = accordionSection.querySelectorAll('.context__word span');

        tl.
          to(accordionPanels, {
            '--border-width': '100%',
            duration: 0.2,
            stagger: 0.1,
          },
          '<');

        tl
          .to(headingWords, {
            y: '100%',
            duration: 0.2,
            stagger: 0.1,
            ease: "expo.out",
          },
          '<');
      })
    }

    tl
      .play();
  },
};

export default pageTransition;