/* eslint-disable no-param-reassign */
import { Sprite, Texture, Resource, AnimatedSprite } from "pixi.js";
import { Layer } from "../common/layer";

export class Player {
  sprite: AnimatedSprite;
  speed: number = 5;
  direction: "left" | "right" = "right";
  layer: Layer;
  idleTexture: Texture<Resource>[];
  scaredTexture: Texture<Resource>[];
  isScared = false;

  constructor(idleTexture: Texture<Resource>[], scaredTexture: Texture<Resource>[], x: number, y: number) {
    this.idleTexture = idleTexture;
    this.scaredTexture = scaredTexture;
    this.sprite = new AnimatedSprite(idleTexture); // create sprite
    this.sprite.anchor.set(0.5); // center origin of sprite
    this.sprite.y = y;
    this.sprite.x = x;
    this.layer = new Layer(this.sprite);
    this.sprite.buttonMode = true;
    this.sprite.interactive = true;
    this.sprite.animationSpeed = 0.05;
    this.sprite.play();

    this.sprite.onComplete = () => {
      this.sprite.animationSpeed *= -1.0;
    }

    // listen for keyboard input
    document.addEventListener("keydown", (e) => {
      this.onKeyDown(e);
    });

  }

  onKeyDown(key: { keyCode: number }): void {
    // console.log(this.layer.getDepth());
    // W Key is 87
    // Up arrow is 87
    if (key.keyCode === 87 || key.keyCode === 38) {
      this.layer.decrementLayer();
    }

    // S Key is 83
    // Down arrow is 40
    if (key.keyCode === 83 || key.keyCode === 40) {
      this.layer.incrementLayer();
    }

    // // A Key is 65
    // // Left arrow is 37
    // if (key.keyCode === 65 || key.keyCode === 37) {
    //     // If the A key or the Left arrow is pressed, move the player to the left.
    //     if (sprite.position.x != 0) {
    //         // Don't move to the left if the player is at the left side of the stage
    //         sprite.position.x -= boxWidth;
    //     }
    // }

    // // D Key is 68
    // // Right arrow is 39
    // if (key.keyCode === 68 || key.keyCode === 39) {
    //     // If the D key or the Right arrow is pressed, move the player to the right.
    //     if (sprite.position.x != renderer.width - boxWidth) {
    //         // Don't move to the right if the player is at the right side of the stage
    //         sprite.position.x += boxWidth;
    //     }
    // }
  }

  setScared(isScared: boolean): void {
    this.isScared = isScared;
    if (isScared) {
      this.sprite.textures = this.scaredTexture;
    } else {
      this.sprite.textures = this.idleTexture;
      this.sprite.play();
    }
  }

}

export const getNextEntityDirection = (
  viewWidth: number,
  c: Player
): "left" | "right" => {
  if (c.sprite.x >= viewWidth) {
    return "left";
  }
  if (c.sprite.x <= 0) {
    return "right";
  }
  return c.direction;
};

export const getNextEntityPosition = (c: Player): number => {
  if (c.direction === "right") {
    return c.sprite.x + c.speed;
  }
  return c.sprite.x - c.speed;
};
