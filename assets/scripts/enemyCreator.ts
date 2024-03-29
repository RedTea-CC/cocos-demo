const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    pfEnemy: cc.Prefab[] = []
    prebafPaths: string[] = ["prefabs/enemy1", "prefabs/enemy2",];
    loadedCount: number = 0
    speed: number = 100

    start() {
        this.prebafPaths.map((prebafPath) => {
            cc.resources.load(prebafPath, cc.Prefab, this.prefabLoaded.bind(this));
        })
    }

    prefabLoaded(error: Error, res: cc.Prefab) {
        if (error) {
            console.error("Failed to load Prefab:", error);
            return
        }
        this.pfEnemy[this.loadedCount] = res
        this.loadedCount++;

        if (this.loadedCount === this.prebafPaths.length) {
            console.log("All Prefab loaded!");
            this.schedule(this.enemyCreator.bind(this), 1)
        }
    }

    enemyCreator() {
        let t = cc.tween;
        let random = this.getRandomInt(0, this.prebafPaths.length - 1)
        let enemyNode = cc.instantiate(this.pfEnemy[random])
        this.node.addChild(enemyNode)
        enemyNode.x = -(320 - enemyNode.width / 2) + Math.random() * (640 - enemyNode.width / 2)
        if (enemyNode.x + 100 < (320 - enemyNode.width / 2)) {
            t(enemyNode).parallel(
                t().to(0.5, { angle: 360, scale: 2 }).to(0.5, { scale: 1 }),
                t().by(0.5, { x: 100 })
            ).start()
        }
        else if (enemyNode.x - 100 > -(320 - enemyNode.width / 2)) {
            t(enemyNode).parallel(
                t().to(0.5, { angle: 360, scale: 2 }).to(0.5, { scale: 1 }),
                t().by(0.5, { x: -100 })
            ).start()
        }
    }

    protected update(dt: number): void {
        this.node.children.forEach((enemy, index) => {
            enemy.y -= this.speed * dt
            if (enemy.y < -880 - enemy.height / 2) {
                this.node.removeChild(enemy)
            }
        })
    }

    // 获取一个指定范围内的随机整数（包含下限值和上限值）
    getRandomInt(min: number = 0, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
