import { useRef, forwardRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { projectsScrollAnimation } from '../../animations/gsap/projectsAnim';

import project1 from '../../assets/images/project-img/project-1.jpg';
import project2 from '../../assets/images/project-img/project-2.jpg';
import project3 from '../../assets/images/project-img/project-3.jpg';
import project4 from '../../assets/images/project-img/project-4.jpg';
import project5 from '../../assets/images/project-img/project-5.jpg';
import project6 from '../../assets/images/project-img/project-6.jpg';
import project7 from '../../assets/images/project-img/project-7.jpg';

const projects = [
  { id: 1, name: "VELVET", image: project1, description: "Velvet Where fabric meets identity. A luxury fashion house reimagined for the digital" },
  { id: 2, name: "SILLAGE", image: project2, description: "Sillage The scent of a digital presence.  Fragrance storytelling through immersive web experience." },
  { id: 3, name: "CROFT", image: project3, description: "Croft Space, crafted with intention. A furniture brand's digital showroom, built to inspire." },
  { id: 4, name: "AURUM", image: project4, description: "Aurum Fine jewellery. Finer digital craft. An editorial e-commerce experience for modern luxury." },
  { id: 5, name: "NOIR", image: project5, description: "Noir Time, told beautifully. A heritage watch brand brought to life on the web." },
  { id: 6, name: "BOTANICA", image: project6, description: " Botanica Clean beauty, carefully considered. A wellness brand's digital identity rooted in nature." },
  { id: 7, name: "EMBER", image: project7, description: "Ember The table is set. A fine dining experience that begins before you arrive." },
];

const ProjectCard = forwardRef(({ project, isFirst }, ref) => {
  const containerRef = useRef(null);
  const tlRef = useRef(null);
  const hoverBoardRef = useRef(null);
  const projectImgRef = useRef(null);
  const hoverWordsRef = useRef([]);
  const hoverBtnRef = useRef(null);
  const btnLineRef = useRef(null);

  const addWordRef = (el) => {
    if (el && !hoverWordsRef.current.includes(el)) {
      hoverWordsRef.current.push(el);
    }
  };

  const setRefs = (element) => {
    containerRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  useGSAP(() => {
    tlRef.current = gsap.timeline({ paused: true });

    tlRef.current.to(hoverBoardRef.current, {
      clipPath: 'circle(150% at 50% 50%)',
      duration: 0.6,
      ease: 'power3.inOut'
    }, 0);

    tlRef.current.to(projectImgRef.current, {
      scale: 3.0, 
      opacity: 0,
      filter: 'grayscale(100%)',
      duration: 0.6,
      ease: 'power3.inOut'
    }, 0);

    tlRef.current.to(hoverWordsRef.current, {
      y: '0%',
      duration: 0.6,
      stagger: 0.02,
      ease: 'power3.out'
    }, 0.2);

    tlRef.current.to(hoverBtnRef.current, {
      y: '0%',
      duration: 0.5,
      ease: 'power3.out'
    }, 0.3);

    tlRef.current.to(btnLineRef.current, {
      scaleX: 1,
      duration: 0.5,
      ease: 'power3.inOut'
    }, 0.4);

  }, { scope: containerRef });

  const handleMouseEnter = () => tlRef.current?.play();
  const handleMouseLeave = () => tlRef.current?.reverse();

  const words = project.description ? project.description.split(" ") : [];

  return (
    <div
      ref={setRefs}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full aspect-[16/9] opacity-50 overflow-hidden bg-transparent relative cursor-pointer"
    >
      {project.image && (
        <img
          ref={projectImgRef}
          src={project.image}
          alt={project.name}
          className="project-img w-full h-full object-contain scale-[3.2] origin-center"
          loading="eager"
          decoding="async"
          fetchpriority={isFirst ? "high" : "auto"}
        />
      )}
      
      <div 
        ref={hoverBoardRef}
        className="hover-board absolute inset-0 bg-transparent flex flex-col justify-center items-center p-6 sm:p-10 text-center pointer-events-none"
        style={{ clipPath: 'circle(0% at 50% 50%)' }}
      >
         <div className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-1 max-w-[90%] pointer-events-none">
           {words.map((word, i) => (
             <span key={i} className="overflow-hidden inline-block leading-tight text-[#0D0D0D] text-[1rem] sm:text-[1.2rem] lg:text-[1.5rem] font-sans font-light tracking-wide">
               <span ref={addWordRef} className="hover-word inline-block translate-y-[110%]">{word}</span>
             </span>
           ))}
         </div>
         
         <a href="#works" className="mt-8 sm:mt-10 group/btn relative inline-block text-[#0D0D0D] text-[11px] md:text-[12px] uppercase tracking-widest font-medium overflow-hidden hover:opacity-60 transition-opacity pointer-events-auto">
           <span ref={hoverBtnRef} className="hover-btn inline-block translate-y-[110%] pb-1">
             VIEW PROJECT
           </span>
           <span ref={btnLineRef} className="btn-line absolute bottom-0 left-0 w-full h-[1px] bg-[#0D0D0D] origin-left scale-x-0"></span>
         </a>
      </div>
    </div>
  );
});

const Projects = () => {
  const sectionRef = useRef(null);
  const projectIndexRef = useRef(null);
  const projectImagesContainerRef = useRef(null);
  const projectNamesContainerRef = useRef(null);
  const counterTextRef = useRef(null);

  const projectImgRefs = useRef([]);
  const projectNameRefs = useRef([]);

  const addImgRef = (el) => {
    if (el && !projectImgRefs.current.includes(el)) {
      projectImgRefs.current.push(el);
    }
  };

  const addNameRef = (el) => {
    if (el && !projectNameRefs.current.includes(el)) {
      projectNameRefs.current.push(el);
    }
  };

  useGSAP(() => {
    projectsScrollAnimation({
      sectionRef,
      projectIndexRef,
      projectImagesContainerRef,
      projectImgRefs,
      projectNamesContainerRef,
      projectNameRefs,
      totalProjects: projects.length,
      counterTextRef
    });
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100svh] p-8 overflow-hidden bg-transparent"
      style={{ contain: 'layout paint' }}
    >
      {/* Project Counter */}
      <div className="absolute top-8 left-8">
        <h1
          ref={projectIndexRef}
          className="h1forproject flex items-baseline text-[#0D0D0D] uppercase leading-none"
          style={{ willChange: 'transform' }}
        >
          <span ref={counterTextRef} className="text-[clamp(5rem,7vw,11rem)] leading-none">
            01
          </span>
          <span className="text-[clamp(2rem,3vw,4rem)] leading-none text-[#555] ml-1 sm:ml-2">
            /{projects.length}
          </span>
        </h1>
      </div>

      {/* Project Images */}
      <div
        ref={projectImagesContainerRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] max-[1000px]:w-[calc(100%-4rem)] py-[50svh] flex flex-col gap-2 max-[1000px]:gap-[25svh] -z-10"
        style={{ willChange: 'transform' }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} isFirst={index === 0} ref={addImgRef} />
        ))}
      </div>

      {/* Project Names */}
      <div
        ref={projectNamesContainerRef}
        className="absolute right-8 bottom-8 flex flex-col items-end"
      >
        {projects.map((project) => (
          <p
            key={`name-${project.id}`}
            ref={addNameRef}
            className="pforproject text-[clamp(1.8rem,3vw,3.5rem)] font-light tracking-tight leading-[1.2] text-[#A0A0A0] max-[1000px]:!text-[#0D0D0D] whitespace-nowrap transition-colors duration-300"
            style={{ willChange: 'transform' }}
          >
            {project.name}
          </p>
        ))}
      </div>
    </section>
  );
};

export default Projects;