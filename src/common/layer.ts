import { AnimatedSprite } from "pixi.js";

export class Layer {
    private animatedSprite: AnimatedSprite;
    private MAX_DEPTH = 10;
    private MIN_DEPTH = 1;
    private depth_ratio = 1.25;
    private depth = 5;

    constructor(animatedSprite: AnimatedSprite) {
        this.animatedSprite = animatedSprite;
        this.updateLayer();
    }

    incrementLayer(): void {
        if (!(this.depth > this.MAX_DEPTH)) {
            this.depth *= this.depth_ratio;
            this.updateLayer();
        }
    }

    decrementLayer(): void {
        if (!(this.depth < this.MIN_DEPTH + 1)) {
            this.depth /= this.depth_ratio;
            this.updateLayer();
        }
    }

    getDepth(): number {
        return this.depth;
    }


  updateLayer(): void {
    this.animatedSprite.scale.x = this.depth;
    this.animatedSprite.scale.y = this.depth;
  }
}