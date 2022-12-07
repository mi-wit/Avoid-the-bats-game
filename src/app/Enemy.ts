import { AnimatedSprite, Resource, Texture } from "pixi.js";
import { Layer } from "../common/layer";

export class Enemy {
  sprite: AnimatedSprite;
  layer: Layer;
  speed = 10;
  direction: "right" | "left" = "right";

  constructor(texture: Texture<Resource>[], x: number, y: number) {
    this.sprite = new AnimatedSprite(texture);
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
    this.sprite.anchor.set(0.5); // center origin of sprite
    this.sprite.y = y;
    this.sprite.x = x;

    this.layer = new Layer(this.sprite);
  }


  getNextEnemyDirection = (viewWidth: number): "left" | "right" => {
    if (this.sprite.x >= viewWidth) {
      this.sprite.scale.x *= -1;
      return "left";
    }
    if (this.sprite.x <= 0) {
      this.sprite.scale.x *= -1;
      return "right";
    }
    return this.direction;
  };

  getNextEnemyPosition = (): number => {
    if (this.direction === "right") {
      return this.sprite.x + this.speed;
    }
    return this.sprite.x - this.speed;
  };
}