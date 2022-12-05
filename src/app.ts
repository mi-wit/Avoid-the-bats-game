
import {
  Application, Loader, Resource, Text, Texture, Ticker, settings, SCALE_MODES, Rectangle, BaseTexture, Sprite, AnimatedSprite, FrameObject
} from 'pixi.js';
import { Enemy } from './app/Enemy';
import {
  Player, getNextEntityDirection, getNextEntityPosition,
} from './app/Player';

// constants
const SIZE = 512;
const CENTER = SIZE / 2;

// create and append app
const app = new Application({
  width: SIZE,
  height: SIZE,
  backgroundColor: 0x1099bb, // light blue
  sharedTicker: true,
  sharedLoader: true,
});
document.body.appendChild(app.view);
const loader = Loader.shared;
const ticker = Ticker.shared;

// Scale mode for all textures, will retain pixelation
settings.SCALE_MODE = SCALE_MODES.NEAREST;



// preload needed assets
loader.add('samir', '/assets/img/hero.png');
loader.add('enemy', '/assets/img/enemy.png');
const alienImages = [
  'tile005.png',
  'tile006.png',
  'tile007.png',
];
alienImages.forEach((imageName: string) => {
  loader.add(imageName, `/assets/img/bat/fly/${imageName}`);
});

// when loader is ready
loader.load(() => {
  // create and append FPS text
  const fps = new Text('FPS: 0', { fill: 0xffffff });
  app.stage.addChild(fps);

  // create and append hero
  const heroTexture = loader.resources.samir.texture as Texture<Resource>;
  const hero = new Player(heroTexture, CENTER, CENTER);
  app.stage.addChild(hero.sprite);
  hero.sprite.interactive = true;
  hero.sprite.buttonMode = true;

  // create and add enemy

  const texturesArray: Texture<Resource>[] = [];
  alienImages.forEach((imageName: string) => {
    const texture = loader.resources[imageName].texture as Texture<Resource>;
    texturesArray.push(texture);
  });
  const enemy = new Enemy(texturesArray, CENTER, CENTER, );
  app.stage.addChild(enemy.sprite);

  ticker.add(() => {
    fps.text = `FPS: ${ticker.FPS.toFixed(2)}`;
    enemy.direction = enemy.getNextEnemyDirection(app.view.width);
    enemy.sprite.x = enemy.getNextEnemyPosition();
  });
});



// pomysł na grę: https://pixijs.io/guides/basics/interaction.html
// zbieranie jedzenia w przestrzeni Z