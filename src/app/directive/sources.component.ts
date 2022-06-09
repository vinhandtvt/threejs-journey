export class Sources {
  public static readonly sources: Source[] = [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'assets/textures/environmentMap/px.jpg',
            'assets/textures/environmentMap/nx.jpg',
            'assets/textures/environmentMap/py.jpg',
            'assets/textures/environmentMap/ny.jpg',
            'assets/textures/environmentMap/pz.jpg',
            'assets/textures/environmentMap/nz.jpg'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'assets/textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'assets/textures/dirt/normal.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'assets/models/Fox/glTF/Fox.gltf'
    }
]
}

export interface Source {
    name: string;
    type: string;
    path: string | string[];
}