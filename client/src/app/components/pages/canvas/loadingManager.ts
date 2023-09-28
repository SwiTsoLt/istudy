import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Observable, Subscriber } from "rxjs";
import * as canvasInterface from "../canvas/canvas.interface";

const clock: THREE.Clock = new THREE.Clock();
let loadingElement = document.getElementById("mapModelLoader");

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    loadingElement = document.getElementById("mapModelLoader");

    if (loadingElement) {
        loadingElement.classList.remove("hide");
    }

    console.log("Started loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
};

manager.onLoad = function () {
    console.log("Loading complete!");

    if (loadingElement) {
        loadingElement.classList.add("hide");

        setTimeout(() => {
            if (loadingElement) {
                loadingElement.style.display = "none";
            }
        }, 10000);
    }
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(`Loading ${itemsLoaded / itemsTotal * 100}%`);
    if (loadingElement) {
        loadingElement.innerText = `Загрузка ${(itemsLoaded / itemsTotal * 100).toFixed(1)}%`;
    }
};

manager.onError = function (url) {
    console.log("There was an error loading " + url);
};

export const loaderManager = {
    texture: (url: string) => {
        return new Observable((subscriber: Subscriber<THREE.Texture>) => {
            new THREE.TextureLoader(manager).load(url, (texture: THREE.Texture) => {
                subscriber.next(texture);
            }, () => { }, (error: ErrorEvent) => {
                subscriber.error(error.message);
            });
        });
    },
    obj: (url: string) => {
        return new Observable((subscriber: Subscriber<THREE.Object3D>) => {
            new OBJLoader(manager).load(url, (obj: THREE.Object3D) => {
                subscriber.next(obj);
            }, () => { }, (error: ErrorEvent) => {
                subscriber.error(error.message);
            });
        });
    },
    gltf: (url: string) => {
        return new Observable((subscriber: Subscriber<GLTF>) => {
            new GLTFLoader(manager).load(url, (gltf: GLTF) => {

                if (gltf.animations.length) {
                    gltf.animations.forEach((anim: THREE.AnimationClip) => {
                        const mesh: THREE.Object3D = gltf.scene.children[0];
                        const mixer = new THREE.AnimationMixer(mesh);
                        const clip = new THREE.AnimationClip(anim.name, anim.duration, anim.tracks, anim.blendMode);
                        const action = mixer.clipAction(clip);

                        function update() {
                            mixer.update(clock.getDelta());
                            requestAnimationFrame(update);
                        }
                        update();

                        action.play();
                    });
                }

                subscriber.next(gltf);
            }, (progress: ProgressEvent<EventTarget>) => {
                console.log(`${progress.loaded * 100}%`);
            }, (error: ErrorEvent) => {
                subscriber.error(error.message);
            });
        });
    },
    glb: (url: string) => {
        return new Observable((subscriber: Subscriber<GLTF>) => {
            new GLTFLoader(manager).load(url, (glb: GLTF) => {
                subscriber.next(glb);
            }, () => { }, (error: ErrorEvent) => {
                subscriber.error(error.message);
            });
        });
    },
    fbx: (url: string) => {
        return new Observable((subscriber: Subscriber<THREE.Group>) => {
            new FBXLoader(manager).load(url, (anim: THREE.Group) => {
                loaderManager.texture(`${canvasInterface.ASSET_PATH}/math/boat/water/textures/Water_Diffuse.png`)
                    .subscribe(texture => {
                        // Set texture

                        const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 80 });

                        anim.traverse(child => {
                            child.castShadow = true;
                            (child as THREE.Mesh).material = material;

                            // Set animation

                            const mixer: THREE.AnimationMixer = new THREE.AnimationMixer(child);
                            const clips = child.animations;

                            console.log(clips);

                            if (clips.length) {
                                const clock: THREE.Clock = new THREE.Clock();
                                mixer.clipAction(anim.animations[0]).play();

                                const update: () => void = () => {
                                    const delta: number = clock.getDelta();
                                    mixer.update(delta);
                                };
                                setInterval(() => {
                                    update();
                                }, 16.667);


                            }
                        });

                        subscriber.next(anim);
                    });
            }, () => { }, (error: ErrorEvent) => {
                subscriber.error(error.message);
            });
        });
    }
};