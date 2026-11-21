declare module "three" {
  export class Vector3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
  }

  export class Object3D {
    position: Vector3;
    rotation: Vector3;
    add(...objects: Object3D[]): this;
    clear(): this;
  }

  export class Material {
    dispose(): void;
  }

  export class BufferGeometry {
    dispose(): void;
  }

  export class Scene extends Object3D {}
  export class Group extends Object3D {}
  export class OrthographicCamera extends Object3D {
    left: number;
    right: number;
    top: number;
    bottom: number;
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number);
    updateProjectionMatrix(): void;
  }

  export class SphereGeometry extends BufferGeometry {
    constructor(radius?: number, widthSegments?: number, heightSegments?: number);
  }

  export class TorusGeometry extends BufferGeometry {
    constructor(radius?: number, tube?: number, radialSegments?: number, tubularSegments?: number);
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: { color?: number; wireframe?: boolean; transparent?: boolean; opacity?: number });
  }

  export class Mesh extends Object3D {
    geometry: BufferGeometry;
    material: Material;
    constructor(geometry: BufferGeometry, material: Material);
  }

  export class WebGLRenderer {
    domElement: HTMLCanvasElement;
    constructor(parameters?: { alpha?: boolean; antialias?: boolean; powerPreference?: string });
    setClearColor(color: number, alpha?: number): void;
    setPixelRatio(ratio: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(scene: Scene, camera: OrthographicCamera): void;
    dispose(): void;
  }
}
