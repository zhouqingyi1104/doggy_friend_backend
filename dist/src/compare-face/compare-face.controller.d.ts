import { CompareFaceService } from './compare-face.service';
export declare class CompareFaceController {
    private readonly compareFaceService;
    constructor(compareFaceService: CompareFaceService);
    compareFace(req: any, body: {
        your_face: string;
        his_face: string;
    }): Promise<{
        id: bigint;
        score: number;
        msg: string;
    }>;
    animeFace(req: any, body: {
        image: string;
    }): Promise<string>;
}
