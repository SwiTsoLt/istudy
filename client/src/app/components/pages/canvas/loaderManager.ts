import * as THREE from "three/src/Three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Observable, Subscriber, of } from "rxjs";
import * as canvasInterface from "./canvas.interface";

const clock: THREE.Clock = new THREE.Clock();
let loaderContainer = document.getElementById("mapModelLoaderContainer");
let loaderElement = document.getElementById("mapModelLoader");
let progressContainer = document.getElementById("progressContainer");
let progressElem = document.getElementById("progress");

let $ready: Observable<boolean> = of(false);

const manager = new THREE.LoadingManager();
manager.onStart = () => {
    loaderContainer = document.getElementById("mapModelLoaderContainer");
    loaderElement = document.getElementById("mapModelLoader");
    progressContainer = document.getElementById("progressContainer");
    progressElem = document.getElementById("progress");
};

manager.onLoad = () => {
    if (loaderContainer && loaderElement && progressContainer) {
        loaderElement.innerText = "Удерживайте курсор в области ниже чтобы продолжить...";
        loaderElement.classList.add("end");
        progressContainer.classList.add("end");

        const cursorElem = document.getElementById("cursor");

        let progress = 0.1;

        const cursorInterval = setInterval(() => {
            if (cursorElem && progressContainer && progressElem && loaderContainer) {
                const cursorPos = cursorElem.getBoundingClientRect();
                const progressContainerPos = progressContainer.getBoundingClientRect();

                if (
                    (cursorPos.x + cursorPos.width / 2 > progressContainerPos.x) &&
                    (cursorPos.x + cursorPos.width / 2 < progressContainerPos.x + progressContainerPos.width) &&
                    (cursorPos.y + cursorPos.height / 2 > progressContainerPos.y) &&
                    (cursorPos.y + cursorPos.height / 2 < progressContainerPos.y + progressContainerPos.height)
                ) {
                    if (progress < 1) {
                        progress += 0.02;
                        progressElem.style.transform = `scale(${progress})`;
                    } else {
                        $ready = of(true);
                        loaderContainer.classList.add("hide");
                        clearInterval(cursorInterval);
                    }
                } else {
                    if (progress > 0.1) {
                        progress -= 0.04;
                        progressElem.style.transform = `scale(${progress})`;
                    }
                }
            }
        }, 50);
    }
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    if (loaderElement) {
        loaderElement.innerText = `Загрузка текстур ${(itemsLoaded / itemsTotal * 100).toFixed(1)}%`;
    }
};

manager.onError = function (url) {
    console.log("There was an error loading " + url);
};

export const loaderManager = {
    $ready: (): Observable<boolean> => $ready,
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