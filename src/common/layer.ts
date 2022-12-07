import { AnimatedSprite } from "pixi.js";

export class Layer {
    private animatedSprite: AnimatedSprite;
    MAX_DEPTH = 10;
    MIN_DEPTH = 1;
    private depth_ratio = 1.25;
    private depth = 1;
    private layer: number; // should be between MAX_DEPTH and MIN_DEPTH

    constructor(animatedSprite: AnimatedSprite, layer: number = 6) {
        this.animatedSprite = animatedSprite;
        this.layer = layer;
        
        for (let i = 0; i < layer; i++){
            this.depth *= this.depth_ratio;
        }

        this.updateLayer();
    }

    incrementLayer(): void {
        if (!(this.depth > this.MAX_DEPTH)) {
            
            this.depth *= this.depth_ratio;
            this.layer += 1;
            console.log(this.layer);
            this.updateLayer();
        }
    }

    decrementLayer(): void {
        if (!(this.depth < this.MIN_DEPTH + 1)) {
            
            this.depth /= this.depth_ratio;
            this.layer -=1;
            console.log(this.layer);
            this.updateLayer();
        }
    }

    getDepth(): number {
        return this.depth;
    }

    getLayer(): number {
        return this.layer;
    }

    updateLayer(): void {
        this.animatedSprite.scale.x = this.depth;
        this.animatedSprite.scale.y = this.depth;
    }

    moveToStart(): void {
        while(this.layer < 11) {
            this.incrementLayer();
        }

    }
}