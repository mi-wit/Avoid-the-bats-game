
import {
  Application, Loader, Resource, Text, Texture, Ticker, settings, SCALE_MODES, Rectangle, BaseTexture, Sprite, AnimatedSprite, FrameObject, Container
} from 'pixi.js';
import { Enemy } from './app/Enemy';
import {
  Player, getNextEntityDirection, getNextEntityPosition,
} from './app/Player';
import { Layer } from './common/layer';

// constants
const SIZE = 512;
const CENTER = SIZE / 2;

// global variables
let lives_num = 10;
let points_num = 0;

// create and append app
const app = new Application({
  width: SIZE,
  height: SIZE,
  backgroundColor: 0xffffff,
  sharedTicker: true,
  sharedLoader: true,
});
document.body.appendChild(app.view);
const loader = Loader.shared;
const ticker = Ticker.shared;

// Scale mode for all textures, will retain pixelation
settings.SCALE_MODE = SCALE_MODES.NEAREST;


// preload needed assets
const idleHeroImages = [
  '1.png',
  '2.png',
  '3.png',
  '4.png',
];
idleHeroImages.forEach((imageName: string) => {
  loader.add(imageName, `/assets/img/penguin/idle/${imageName}`);
});
loader.add('scaredHero', `assets/img/penguin/scared/1.png`)

const alienImages = [
  'tile005.png',
  'tile006.png',
  'tile007.png',
];
alienImages.forEach((imageName: string) => {
  loader.add(imageName, `/assets/img/bat/fly/${imageName}`);
});

loader.add('background', `assets/img/dungeon.png`);
loader.add('backgroundMusic', `assets/sounds/wind1.mp3`);
// when loader is ready
loader.load(() => {
  // background image
  const bT = loader.resources.background.texture as Texture<Resource>;
  const background = new Sprite(bT);
  background.anchor.set(0.5);
  background.x = CENTER;
  background.y = CENTER;
  app.stage.addChild(background);

// background music
const music = loader.resources.backgroundMusic.data as Sound<Resource>;

  // create and append FPS text
  const fps: Text = new Text('FPS: 0', { fill: 0xffffff });
  app.stage.addChild(fps);

  // create and append points text
  const points: Text = new Text(`Points: ${points_num}`, { fill: 0xffffff });
  points.y = 20;
  app.stage.addChild(points);

  // create and append lives text
  const lives: Text = new Text(`Lives: ${lives_num}`, { fill: 0xffffff });
  lives.y = 40;
  app.stage.addChild(lives);

  // create and append hero
  const heroTextures: Texture<Resource>[] = [];
  idleHeroImages.forEach((imageName: string) => {
    const texture = loader.resources[imageName].texture as Texture<Resource>;
    texture.orig = new Rectangle(4, 4, 28, 28);
    texture.updateUvs();
    heroTextures.push(texture);
  });
  const scaredHeroTexture = [];
  scaredHeroTexture.push(loader.resources.scaredHero.texture as Texture<Resource>);
  const hero = new Player(heroTextures, scaredHeroTexture, CENTER, CENTER);
  app.stage.addChild(hero.sprite);


  // create and add enemy
  const texturesArray: Texture<Resource>[] = [];
  alienImages.forEach((imageName: string) => {
    const texture = loader.resources[imageName].texture as Texture<Resource>;
    texture.orig = new Rectangle(4, 4, 28, 28);
    texture.updateUvs();
    texturesArray.push(texture);
  });

  const enemies: Enemy[] = [];
  // enemies.push(new Enemy(texturesArray, CENTER, CENTER, 7, 5));
  enemies.push(new Enemy(texturesArray, CENTER, CENTER, 5, 2));
  // enemies.push(new Enemy(texturesArray, CENTER, CENTER, 3, 12));
  // enemies.push(new Enemy(texturesArray, CENTER, CENTER, 9, 1));
  enemies.forEach(e => {
    app.stage.addChild(e.sprite);
    e.sprite.zIndex = e.layer.getLayer();
  });

  

  ticker.add(() => {
    fps.text = `FPS: ${ticker.FPS.toFixed(0)}`;

    if (hero.isScared) {
      hero.setScared(false);
    }
    background.alpha = 1.0;

    enemies.forEach((e: Enemy) => {
      e.direction = e.getNextEnemyDirection(app.view.width);
      e.sprite.x = e.getNextEnemyPosition();

      // enemy - player logic
      if (e.layer.getLayer() === hero.layer.getLayer()) {
        hero.setScared(true);

        if (rectIntersects(e.sprite, hero.sprite)) {
          hero.layer.moveToStart();
          console.log('collision');
          background.alpha = 0.5;
          lives_num -=1;
          lives.text = `Lives: ${lives_num}`;
        }
      }
      
      // points logic
      if (hero.layer.getLayer() - 2 <= hero.layer.MIN_DEPTH) {
        hero.layer.moveToStart();
        points_num += 1;
        points.text = `Points: ${points_num}`;
      }

    });

    hero.sprite.zIndex = hero.layer.getLayer();
    app.stage.sortChildren();
  });

  
});

function rectIntersects(enemy: AnimatedSprite, hero: AnimatedSprite): boolean {
  const aRect = enemy.getBounds();
  const bRect = hero.getBounds();
  const smallification = bRect.width / 2;  // making the sprites smaller
  const a = new Rectangle(aRect.x + smallification, aRect.y, aRect.width - smallification, aRect.height);
  const b = new Rectangle(bRect.x + smallification, bRect.y, bRect.width - smallification, bRect.height);
  return a.intersects(b);

  // return  aRect.x + aRect.width > bRect.x &&
  //         aRect.x < bRect.x + bRect.width &&
  //         aRect.y + aRect.height > bRect.y &&
  //         aRect.y < bRect.y + bRect.height;
}

// TODO, sterowanie tylko jednym klawiszem, postać po dojściu do końca wraca na początek i dodaje punkt
// pomysł na grę: https://pixijs.io/guides/basics/interaction.html
// zbieranie jedzenia w przestrzeni Z