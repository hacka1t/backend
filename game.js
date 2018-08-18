const TICKS_PER_SECOND = 50

const secondsToTicks = seconds => Math.round(seconds * TICKS_PER_SECOND)

// const SAMPLE_GAME_STATE = {
//     // parameters
//     maxTracks: 8,
//     maxLifes: 3,
//     intervalBetweenShots: 0.2,
//     projectileSpeed: 2,
//
//     // game state
//     playerLifes: 2,
//     playerTrack: 0, // which track the player is looking at
//     playerShotCooldown: 0, // amount of ticks before allowed to shoot again (can shoot if 0)
//     projectiles: [ // array of current projectiles
//         { track: 1, position: 0.5, id: 'projectile1' },
//         { track: 3, position: 0.3, id: 'projectile2' }
//     ],
//     enemies: [
//         { track: 1, position: 0.8, speed: 0.4, id: 'enemy1' },
//         { track: 4, position: 0.2, speed: 0.3, id: 'enemy2' }
//     ],
//     tick: 15,
//     score: 30
// }

class Game {
    constructor(tracks = 8, shotInterval = 0.2, maxLifes = 3) {
        this.maxTracks = tracks
        this.intervalBetweenShots = shotInterval
        this.projectileSpeed = 2 / TICKS_PER_SECOND

        this.playerLifes = maxLifes
        this.playerTrack = 0
        // TODO: player movement cooldown
        this.playerShotCooldown = 0
        this.projectiles = []
        this.enemies = []
        this.tick = 0
        this.score = 0

        this.turnRight = this.turnRight.bind(this)
        this.turnLeft = this.turnLeft.bind(this)
        this.shoot = this.shoot.bind(this)
    }

    turnRight() {
        this.playerTrack += 1
        if(this.playerTrack >= this.maxTracks) {
            this.playerTrack = 0
        }
    }

    turnLeft() {
        this.playerTrack -= 1
        if(this.playerTrack < 0) {
            this.playerTrack = this.maxTracks - 1
        }
    }

    shoot() {
        if(this.playerShotCooldown === 0) {
            this.playerShotCooldown = secondsToTicks(this.shotInterval)
            let newProjectile = {
                track: this.playerTrack,
                position: 0,
                id: 'projectile' + this.tick
            }
            this.projectiles.push(newProjectile)
        }
    }

    spawnEnemy(track, speed){
        let newEnemy = {
            position: 1,
            track,
            speed,
            id: 'enemy' + this.tick
        }
        this.enemies.push(newEnemy)
    }

    _gameTick() {
        let speed = this.projectileSpeed

        this.projectiles = this.projectiles.map(
            function(projectile){
                projectile.position += speed
                return projectile
            }
        )
        this.enemies = this.enemies.map(
            function(enemy){
                enemy.position -= enemy.speed
                return enemy
            }
        )

        this.projectiles = this.projectiles.filter(
            (projectile) => {
                // removes both the enemy and the projectile if there is a collision
                let enemyHit = this.enemies.filter(e => e.track === projectile.track)
                    .find(enemy => enemy.position <= projectile.position)
                if(enemyHit) {
                    this.enemies = this.enemies.filter(e => e.id !== enemyHit.id)
                    return false
                }

                return projectile.position <= 1
            }
        )

        let lives = this.playerLifes
        this.enemies = this.enemies.filter(
            function(enemy){
                if(enemy.position > 0) return true
                lives -= 1
                if(lives < 0) lives = 0
                return false
            }
        )
        this.playerLifes = lives
        this.tick += 1
    }


}

module.exports = Game
