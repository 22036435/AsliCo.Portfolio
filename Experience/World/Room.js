import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";


export default class Room{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        //console.log(this.actualRoom);
        this.roomChildren= {};
        //console.log(this.roomChildren);

        this.lerp={
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
    
    }
    
    setModel(){
        //console.log(this.actualRoom);
        this.actualRoom.children.forEach((child) =>{
            
            child.castShadow = true;
            child.receiveShadow = true;

            if(child instanceof THREE.Group){
                child.children.forEach((groupchild)=>{
                    //console.log(groupchild.material);
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }
            /*if(child.name === "screen1"){
                child.material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }*/

            if(child.name === "nfts"){
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.nft1,
                });
            }
            if(child.name === "nfts"){
                child.children[2].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.nft2,
                });
            }
            if(child.name === "nfts"){
                child.children[3].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.nft3,
                });
            }

            if(child.name === "Mini_Floor"){
                child.position.x = -0.289521;
                child.position.z= 8.83572;
            }


            child.scale.set(0,0,0);

            if(child.name === "initialcube"){
                //child.scale.set(1,1,1);
                child.position.set(0, -1, 0);
                child.rotation.y = Math.PI /4;
            }

            this.roomChildren[child.name.toLowerCase()] = child;

        });

        const width = 0.5;
        const height = 0.7;
        const intensity = 1;
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        );
        rectLight.position.set(-0.861942, 13, -2.41421);
        rectLight.rotation.x = -Math.PI / 2;
        rectLight.rotation.z = Math.PI / 4;
        this.actualRoom.add(rectLight);

        this.roomChildren["rectLight"] = rectLight;

        // const rectLightHelper = new RectAreaLightHelper(rectLight);
        // rectLight.add(rectLightHelper);

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.11, 0.11, 0.11);
        //this.actualRoom.rotation.y = Math.PI;
    }

    setAnimation(){
        //this.mixer = new THREE.AnimationMixer (this.actualRoom);
        //this.spin = this.mixer.clipAction(this.room.animations[67]);
        //this.spin.play();
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.05;
        });
    }

    resize() {}

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current;

        this.mixer.update(this.time.delta * 0.0009);
    }
}