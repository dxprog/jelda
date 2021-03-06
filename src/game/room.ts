import Sprite from '../graphics/sprite';

enum CardinalDirection {
  East = 'east',
  South = 'south',
  West = 'west',
  North = 'north'
}

/**
 * A room in an area or dungeon
 *
 * @constructor
 * @param {Object} tileData The data that makes up the room tiles
 * @param {Object} exitData Information about the room's exits
 * @param {Number} tileWidth The width of each tile in pixels
 * @param {Number} tileHeight The height of each tile in pixels
 * @param {Object~Sprite} tileset The tileset sprite
 */
class Room {
  private _data: any;
  private _exits: any;
  private _tileset: Sprite;
  private _tileWidth: number;
  private _tileHeight: number;
  private _edgeHit: CardinalDirection | boolean;

  constructor(
    tileData: any,
    exitData: any,
    tileWidth: number,
    tileHeight: number,
    tileset: Sprite
  ) {
    this._data = tileData;
    this._exits = exitData;
    this._tileset = tileset;
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;
  }

  /**
   * Draws the room
   *
   * @method draw
   * @param {Number} offsetX X offset to draw the entire room (for transitioning)
   * @param {Number} offsetY Y offset to draw the entire room (for transitioning)
   */
  draw(offsetX: number, offsetY: number) {
    var x, y, row;
    var tileset = this._tileset;
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    for (var i = 0, height = this._data.length; i < height; i++) {
      row = this._data[i];
      y = i * this._tileHeight;
      for (var j = 0, width = row.length; j < width; j++) {
        x = j * this._tileWidth;
        tileset.move(x + offsetX, y + offsetY);
        tileset.setAnimation(row[j].tile);
        tileset.draw();
      }
    }
  }

  /**
   * Returns whether the X, Y pixel position is passable in the room
   *
   * @method canPass
   * @param {Number} x X position of the area to check
   * @param {Number} y Y position of the area to check
   * @param {Number} width Width of the area to check
   * @param {Number} height Height of the area to check
   * @return {Boolean} Whether the area is passable
   */
  canPass(x: number, y: number, width: number, height: number) {
    var i = y;
    var data = this._data;
    var j, tileX, tileY;

    // TODO - make better
    for (; i < y + height; i++) {
      for (j = x; j < x + width; j++) {
        tileX = Math.floor(j / this._tileWidth);
        tileY = Math.floor(i / this._tileHeight);
        if (tileY >= 0 && data.length > tileY && tileX >= 0 && data[tileY].length > tileX) {
          if (!data[tileY][tileX].passable) {
            return false;
          }
        } else {

          // Make note of what edge was hit to pass on to the dungeon later
          if (tileY < 0) {
            this._edgeHit = CardinalDirection.North;
          } else if (tileY >= data.length) {
            this._edgeHit = CardinalDirection.South;
          } else if (tileX < 0) {
            this._edgeHit = CardinalDirection.West;
          } else {
            this._edgeHit = CardinalDirection.East;
          }

          return false;
        }
      }
    }

    this._edgeHit = false;

    return true;
  }

  /**
   * What edge was hit (or not) in the last call to `canPass`
   *
   * @method roomTransition
   * @return {String} The direction of the edge that was hit
   */
  roomTransition(): CardinalDirection | boolean {
    return this._edgeHit;
  }

  /**
   * Returns the width of the room in pixels
   *
   * @method getRoomWidthInPixels
   * @return {Number}
   */
  getRoomWidthInPixels(): number {
    return this._data[0].length * this._tileWidth;
  }

  /**
   * Returns the height of the room in pixels
   *
   * @method getRoomHeightInPixels
   * @return {Number}
   */
  getRoomHeightInPixels(): number {
    return this._data.length * this._tileHeight;
  }

  /**
   * Returns the designated room exit for a specified direction
   *
   * @method getExitForDirection
   * @param {String} direction The direction to check
   * @return {String} The name of the room for the exit or false if none
   */
  getExitForDirection(direction: CardinalDirection | boolean) {
    if (direction === false || direction === true) {
      return false;
    }
    return !!this._exits[direction] ? this._exits[direction] : false;
  }

  /**
   * Resets the room to its original state
   *
   * @method reset
   */
  reset() {
    delete this._edgeHit;
  }

};

export default Room;
