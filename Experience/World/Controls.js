import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sized = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        if (
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            this.setSmoothScroll();
        }

        this.setScrollTrigger();


        //this.progress= 0;
        //this.dummyCurve = new THREE.Vector3(0,0,0);

        //this.lerp={
            //current: 0,
            //target: 0,
            //ease: 0.1,
        //}

        //this.position = new THREE.Vector3(0,0,0);
        //this.lookAtPosition = new THREE.Vector3(0,0,0);

        //this.directionalVector = new THREE.Vector3(0, 0, 0);
        //this.staticVector = new THREE.Vector3(0, 1, 0);
        //this.crossVector = new THREE.Vector3(0, 0, 0);

        //this.setPath();
        //this.onWheel();
    
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.1,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }

    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }

    setScrollTrigger(){
        ScrollTrigger.matchMedia({
            //Desktop
            "(min-width: 969px)": () => {
                // console.log("fired desktop");

                this.room.scale.set(0.11, 0.11, 0.11);
                this.rectLight.width = 0.5;
                this.rectLight.height = 0.7;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);
                this.room.position.set(0, 0, 0);
                // First section -----------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        // markers: true,
                        invalidateOnRefresh: true,
                    },
                });
                this.firstMoveTimeline.fromTo(
                    this.room.position,
                    { x: 0, y: 0, z: 0 },
                    {
                        x: () => {
                            return this.sizes.width * 0.0014;
                        },
                    }
                );

                // Second section -----------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.position,
                        {
                            x: () => {
                                return 1;
                            },
                            z: () => {
                                return this.sizes.height * 0.0032;
                            },
                        },
                        "same"
                    )
                    .to(
                        this.room.scale,
                        {
                            x: 0.4,
                            y: 0.4,
                            z: 0.4,
                        },
                        "same"
                    )
                    .to(
                        this.rectLight,
                        {
                            width: 0.5 * 4,
                            height: 0.7 * 4,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.camera.orthographicCamera.position, {
                    y: 1.5,
                    x: -4.1,
                });
            },

            // Mobile
            "(max-width: 968px)": () => {
                // console.log("fired mobile");

                // Resets
                this.room.scale.set(0.07, 0.07, 0.07);
                this.room.position.set(0, 0, 0);
                this.rectLight.width = 0.3;
                this.rectLight.height = 0.4;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);

                // First section -----------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        // invalidateOnRefresh: true,
                    },
                }).to(this.room.scale, {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1,
                });

                // Second section -----------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.scale,
                        {
                            x: 0.25,
                            y: 0.25,
                            z: 0.25,
                        },
                        "same"
                    )
                    .to(
                        this.rectLight,
                        {
                            width: 0.3 * 3.4,
                            height: 0.4 * 3.4,
                        },
                        "same"
                    )
                    .to(
                        this.room.position,
                        {
                            x: 1.5,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.position, {
                    z: -4.5,
                });
            },

            // all
            all: () => {
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach((section) => {
                    this.progressWrapper =
                        section.querySelector(".progress-wrapper");
                    this.progressBar = section.querySelector(".progress-bar");

                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    } else {
                        GSAP.to(section, {
                            borderTopRightRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        },
                    });
                });

                // All animations
                // First section -----------------------------------------
                this.firstCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Second section -----------------------------------------
                this.secondCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                })
                    .to(
                        this.circleSecond.scale,
                        {
                            x: 3,
                            y: 3,
                            z: 3,
                        },
                        "same"
                    )
                    .to(
                        this.room.position,
                        {
                            y: 0.7,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Mini Platform Animations
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "center center",
                    },
                });

                this.room.children.forEach((child) => {
                    if (child.name === "minifloor") {
                        this.first = GSAP.to(child.position, {
                            x: -4.90009,
                            z: -16.2823,
                            duration: 0.3,
                        });
                    }
                    if (child.name === "mailbox") {
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            duration: 0.3,
                        });
                    }
                    if (child.name === "minifloorobejcts") {
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    
                });
                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.second);
                this.secondPartTimeline.add(this.third, "-=0.2");
               
            },
        });
    }

   
    //this is the function for setting curve and coloring it out to see and looping it with true statement---------------------
    //setPath(){
        //this.curve = new THREE.CatmullRomCurve3([
            //new THREE.Vector3(-5, 0, 0),
            //new THREE.Vector3(0, 0, -5),
            //new THREE.Vector3(5, 0, 0),
            //new THREE.Vector3(0, 0, 5),
        //],
        //true
        //);        

        //const points = this.curve.getPoints(50);
        //const geometry = new THREE.BufferGeometry().setFromPoints(points);

        //const material = new THREE.LineBasicMaterial({ color: 0xff0000});

        //create the final object to add to the scene
        //const curveObject = new THREE.Line( geometry, material);
        //this.scene.add(curveObject);
    //}

    //this is a function for move the camera with mouse wheel---------------------
    //onWheel(){
        //window.addEventListener("wheel", (e)=> {
            //if(e.deltaY > 0){
                //this.lerp.target +=0.01;
                //this.back = false;
            //} else{
                //this.lerp.target -= 0.01;
                //this.back = false;
            //}
        //});
    //}

    resize(){
    }

    update(){
        //this.lerp.current = GSAP.utils.interpolate(
            //this.lerp.current,
            //this.lerp.target,
            //this.lerp.ease
        //);

        //this is for circular camera movement always looks towards the inside of the curve-------------------------
        //this.curve.getPointAt(this.lerp.current % 1, this.position);
        //this.camera.orthographicCamera.position.copy(this.position);

        //this.directionalVector.subVectors(
            //this.curve.getPointAt((this.lerp.current%1)+0.000001),
            //this.position
        //);
        //this.directionalVector.normalize();
        //this.crossVector.crossVectors(
            //this.directionalVector,
            //this.staticVector,
        //);
        //this.crossVector.multiplyScalar(100000);
        //this.camera.orthographicCamera.lookAt(this.crossVector); //you can change into 0,0,0 you can always see the origin, in that way the target always gonna be your model
        
        //this is the basics of camera movements------------------
        //if(this.back){
        //  this.lerp.target -= 0.001;
        //}else{
        //  this.lerp.target += 0.001; // it makes it contuniously moving forward until you scroll
        //}
       
        //this.lerp.target= GSAP.utils.clamp(0, 1, this.lerp.target);
        //this.lerp.current= GSAP.utils.clamp(0, 1, this.lerp.current);
        //this.curve.getPointAt(this.lerp.current, this.position);

        //this.curve.getPointAt(this.lerp.current+0.00001, this.lookAtPosition);
        
        //this.camera.orthographicCamera.position.copy(this.position);
        //this.camera.orthographicCamera.lookAt(this.lookAtPosition); //camera looks towards the curve
    }
}