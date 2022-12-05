export class Layer {
    private MAX_DEPTH = 10;
    private MIN_DEPTH = 1;
    private depth_ratio = 1.25;
    private depth = 5;

    incrementLayer(): void {
        if (!(this.depth > this.MAX_DEPTH)) {
            this.depth *= this.depth_ratio;
        }
    }

    decrementLayer(): void {
        if (!(this.depth < this.MIN_DEPTH + 1)) {
            this.depth /= this.depth_ratio;
        }
    }

    getDepth(): number {
        return this.depth;
    }
}