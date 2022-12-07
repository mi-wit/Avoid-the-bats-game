/* eslint-disable no-param-reassign */
import { Sprite, Texture, Resource, AnimatedSprite } from "pixi.js";
import { Layer } from "../common/layer";
import { sound } from '@pixi/sound';

export class Player {
  sprite: AnimatedSprite;
  speed: number = 5;
  direction: "left" | "right" = "right";
  layer: Layer;
  idleTexture: Texture<Resource>[];
  scaredTexture: Texture<Resource>[];
  isScared = false;
  canMove = true;

  private walkSound: 'walk' | 'walk2' = 'walk';
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
    if (this.canMove) {
      // W Key is 87
      // Up arrow is 87
      if (key.keyCode === 87 || key.keyCode === 38) {
        this.layer.decrementLayer();
        sound.find(this.walkSound).speed = Math.random() + 0.5;
        sound.play(this.walkSound);
      }
      
      // S Key is 83
      // Down arrow is 40
      if (key.keyCode === 83 || key.keyCode === 40) {
        this.layer.incrementLayer();
        sound.play(this.walkSound);
      }
    }
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
