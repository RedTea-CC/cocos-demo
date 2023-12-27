const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    pfEnemy: cc.Prefab[] = []
    prebafPaths: string[] = ["prefabs/enemy1", "prefabs/enemy2",];
    // enemys: cc.Node[] = []
    loadedCount: number = 0
    speed: number = 100

    start() {
        // 循环遍历图片路径数组，使用cc.resources.load加载每个图片
        for (let i = 0; i < this.prebafPaths.length; i++) {
            let prebafPath = this.prebafPaths[i];
            cc.resources.load(prebafPath, cc.Prefab, this.prefabLoaded.bind(this));
        }
    }

    prefabLoaded(error: Error, res: cc.Prefab) {
        if (error) {
            console.error("Failed to load Prefab:", error);
            return
        }
        this.pfEnemy[this.loadedCount] = res
        this.loadedCount++;

        // 检查是否所有图片都已加载完成
        if (this.loadedCount === this.prebafPaths.length) {
            console.log("All Prefab loaded!");
            this.schedule(this.enemyCreator.bind(this), 1)
        }
    }

    enemyCreator() {
        let random = this.getRandomInt(0, this.prebafPaths.length - 1)
        let enemyNode = cc.instantiate(this.pfEnemy[random])
        // this.enemys.push(enemyNode)
        this.node.addChild(enemyNode)
        enemyNode.x = -(320 - enemyNode.width / 2) + Math.random() * (620 - enemyNode.width)
    }

    protected update(dt: number): void {
        this.node.children.forEach((enemy,index) => {
            enemy.y -= this.speed * dt
            if (enemy.y < -880-enemy.height/2) {
                this.node.removeChild(enemy)
                // this.enemys.splice(index, 1)
                // console.log('removeChild',this.node.children)
            }
        })
    }

    // 获取一个指定范围内的随机整数（包含下限值和上限值）
    getRandomInt(min: number = 0, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
