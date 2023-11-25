import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Observable, Subscriber } from "rxjs";

const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    console.log( "Started loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files." );
};

manager.onLoad = function ( ) {
    console.log( "Loading complete!");
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log( "Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files." );
};

manager.onError = function ( url ) {
    console.log( "There was an error loading " + url );
};

export const loaderManager = {
    texture: (url: string) => {
        return new Observable((subscriber: Subscriber<THREE.Texture>) => {
            new THREE.TextureLoader( manager ).load(url, (texture: THREE.Texture) => {
                subscriber.next(texture);
            });
        });
    },
    obj: (url: string) => {
        return new Observable((subscriber: Subscriber<THREE.Object3D>) => {
            new OBJLoader( manager ).load(url, (obj: THREE.Object3D) => {
                subscriber.next( obj );
            });
        });
    },
    gltf: (url: string) => {
        return new Observable((subscriber: Subscriber<GLTF>) => {
            new GLTFLoader( manager).load( url, (gltf: GLTF) => {
                subscriber.next(gltf);
            } );
        });
    }
};