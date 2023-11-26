import * as THREE from "three/src/Three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Observable, Subscriber, of, take } from "rxjs";
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
    gltf: (url: string, animation: canvasInterface.IEntityAnimation) => {
        return new Observable((subscriber: Subscriber<GLTF>) => {
            new GLTFLoader(manager).load(url, (gltf) => {

                // gltf.scene.traverse(c => {
                //     const child = (gltf.scene.getObjectByName(c.name) as THREE.Mesh)

                //     if (!child.isMesh) {
                //         loaderManager.texture(url.replace("scene.gltf", "textures/texture.png"))
                //             .pipe(take(1))
                //             .subscribe((texture: THREE.Texture) => {
                //                 const tempMaterial = new THREE.MeshStandardMaterial({ map: texture, normalMap: texture });
                //                 child.material = tempMaterial;
                //             });
                //     }
                // });

                if (gltf.animations.length) {
                    gltf.animations.forEach((anim: THREE.AnimationClip) => {
                        const mesh: THREE.Object3D = gltf.scene.children[0];
                        const mixer = new THREE.AnimationMixer(mesh);
                        const clip = new THREE.AnimationClip(anim.name, anim.duration, anim.tracks, anim.blendMode);
                        const action = mixer.clipAction(clip);

                        function update(d: number) {
                            mixer.update(d);
                            // requestAnimationFrame(update);
                        }

                        if (animation.stopAt !== null) {
                            mixer.update(0);

                            setTimeout(() => {
                                animation.stopAt !== null && mixer.update(animation.rate * animation.stopAt);
                            }, 0);
                        } else {
                            setInterval(() => {
                                update(0.005);
                            }, 100);
                        }

                        action.play();
                    });
                }

                subscriber.next(gltf);
            }, () => {
                // console.log(`${progress.loaded * 100}%`);
            }, (error: ErrorEvent) => {
                subscriber.error(error.message);
            });
        });
    },
    glb: (url: string, animation: canvasInterface.IEntityAnimation) => {
        return new Observable((subscriber: Subscriber<GLTF>) => {
            new GLTFLoader(manager).load(url, (glb: GLTF) => {
                if (glb.animations.length) {
                    glb.animations.forEach((anim: THREE.AnimationClip) => {
                        const mesh: THREE.Object3D = glb.scene.children[0];
                        const mixer = new THREE.AnimationMixer(mesh);
                        const clip = new THREE.AnimationClip(anim.name, anim.duration, anim.tracks, anim.blendMode);
                        const action = mixer.clipAction(clip);

                        function update() {
                            mixer.update(clock.getDelta());
                            requestAnimationFrame(update);
                        }

                        if (animation.stopAt !== null) {
                            mixer.update(0);

                            setTimeout(() => {
                                animation.stopAt !== null && mixer.update(animation.rate * animation.stopAt);
                            }, 0);
                        } else {
                            update();
                        }

                        action.play();
                    });
                }

                subscriber.next(glb);
            }, () => {
                // console.log(`${progress.loaded * 100}%`);
            }, (error: ErrorEvent) => {
                subscriber.error(error.message);
            });
        });
    },
    fbx: (url: string, animation: canvasInterface.IEntityAnimation) => {
        return new Observable((subscriber: Subscriber<THREE.Group>) => {
            new FBXLoader(manager).load(url, (fbx: THREE.Group) => {
                fbx.scale.setScalar(1);

                fbx.traverse(child => {
                    child.castShadow = true;
                    child.receiveShadow = true;
                });

                const mixer = new THREE.AnimationMixer(fbx);

                const idle = mixer.clipAction(fbx.animations[0]);
                idle.play();

                function update() {
                    mixer.update(clock.getDelta());
                    requestAnimationFrame(update);
                }

                fbx.updateMatrix();

                if (animation.stopAt !== null) {
                    mixer.update(0);

                    setTimeout(() => {
                        animation.stopAt !== null && mixer.update(animation.rate * animation.stopAt);
                    }, 0);
                } else {
                    update();
                }

                // new FBXLoader(manager).load(url, (anim: THREE.Group) => {
                //     const mixer = new THREE.AnimationMixer(fbx);
                //     mixers.push(mixer);

                //     const idle = mixer.clipAction(anim.animations[0]);
                //     idle.play();

                //     function update() {
                //         mixer.update(clock.getDelta());
                //         requestAnimationFrame(update);
                //     }

                //     if (animation.stopAt !== null) {
                //         mixer.update(0);

                //         setTimeout(() => {
                //             animation.stopAt !== null && mixer.update(animation.rate * animation.stopAt);
                //         }, 0);
                //     } else {
                //         update();
                //     }
                // });

                subscriber.next(fbx);
            }, () => { }, (error: ErrorEvent) => {
                subscriber.error(error.message);
            });
        });
    }
};