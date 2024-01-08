const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    sp: cc.SpriteFrame[] = []
    spFly: cc.Sprite

    loadedCount: number = 0
    curIndex: number = 0
    imagePaths: string[] = ["images/me1", "images/me2"];

    @property(cc.Node)
    bullteStartPos: cc.Node = null;

    @property(cc.Prefab)
    bulletPb: cc.Prefab = null;

    start() {
        cc.director.getCollisionManager().enabled = true;

        this.spFly = this.getComponent(cc.Sprite)

        // 循环遍历图片路径数组，使用cc.resources.load加载每个图片
        for (let i = 0; i < this.imagePaths.length; i++) {
            let imagePath = this.imagePaths[i];
            cc.resources.load(imagePath, cc.SpriteFrame, this.onResourceLoaded.bind(this));
        }

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)

        this.schedule(this.fir.bind(this), 0.2)
    }

    update(dt) {
    }

    // 每个图片加载完成时
    onResourceLoaded(error: Error, SpriteFrame: cc.SpriteFrame) {
        if (error) {
            console.error("Failed to load resource:", error);
            return
        }

        console.log("Resource loaded:", SpriteFrame);
        this.sp[this.loadedCount] = SpriteFrame
        this.loadedCount++;

        // 检查是否所有图片都已加载完成
        if (this.loadedCount === this.imagePaths.length) {
            // 所有图片都加载完成
            console.log("All images loaded!");
            this.schedule(this.updataSp.bind(this), 0.2)
        }
    }

    fir() {
        if (this.bulletPb) {
            let bulletSP = cc.instantiate(this.bulletPb);

            /* 
                首先使用 convertToWorldSpaceAR 将相对于 this.node 的 this.bullteStartPos 转换为世界坐标系中的坐标，
                然后使用 convertToNodeSpaceAR 将这个世界坐标系中的坐标转换为父节点坐标系中的坐标。
             */
            let bulletWorldPos = this.node.convertToWorldSpaceAR(cc.v2(this.bullteStartPos));
            let newPos = this.node.parent.convertToNodeSpaceAR(bulletWorldPos);

            bulletSP.parent = this.node.parent;
            bulletSP.x = newPos.x;
            bulletSP.y = newPos.y;
        }
    }

    updataSp() {
        this.curIndex = this.curIndex % this.imagePaths.length
        this.spFly.spriteFrame = this.sp[this.curIndex]
        this.curIndex++
    }

    onTouchMove(event: cc.Event.EventTouch) {

        let delta = event.getDelta()

        if (this.node.x + delta.x >= -264 && this.node.x + delta.x <= 264) {
            this.node.x += delta.x
        }
        if (this.node.y + delta.y >= -418 && this.node.y + delta.y <= 418) {
            this.node.y += delta.y
        }
    }

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        if (other.node.name.includes('enemy')) {
            other.node.destroy();
            self.node.destroy();

            var gameOverImg = cc.find("Canvas/gameImg");
            gameOverImg.active = true;
            cc.director.pause();
        }
    }
}
