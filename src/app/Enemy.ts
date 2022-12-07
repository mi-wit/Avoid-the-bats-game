import { AnimatedSprite, Resource, Texture } from "pixi.js";
import { Layer } from "../common/layer";

export class Enemy {
  sprite: AnimatedSprite;
  layer: Layer;
  speed = 10;
  direction: "right" | "left" = "right";
  extraRoomForFly: number = 0;

  constructor(texture: Texture<Resource>[], x: number, y: number, layer: number, speed: number = 10, extraRoomForFly: number = 0) {
    this.sprite = new AnimatedSprite(texture);
    this.sprite.animationSpeed = 0.1 * speed * 0.5;
    this.sprite.play();
    this.sprite.anchor.set(0.5); // center origin of sprite
    this.sprite.y = y;
    this.sprite.x = x;
    this.speed = speed;
    this.extraRoomForFly = extraRoomForFly;

    this.layer = new Layer(this.sprite, layer);
  }


  getNextEnemyDirection = (maxRight: number, maxLeft: number = 0): "left" | "right" => {
    if (this.sprite.x >= maxRight + this.extraRoomForFly) {
      this.sprite.scale.x *= -1;
      return "left";
    }
    if (this.sprite.x <= maxLeft - this.extraRoomForFly) {
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