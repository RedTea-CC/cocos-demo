const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    sp: cc.SpriteFrame[] = []
    destroySp: cc.SpriteFrame[] = []
    spFly: cc.Sprite

    loadedCount: number = 0
    curIndex: number = 0
    imagePaths: string[] = ["images/me1", "images/me2"];
    destroyImagePaths: string[] = ["images/me_destroy_1", "images/me_destroy_2", "images/me_destroy_3", "images/me_destroy_4"];
    gameControl: cc.Node = null;

    @property(cc.Node)
    bullteStartPos: cc.Node = null;
    @property(cc.Prefab)
    bulletPb: cc.Prefab = null;

    @property(cc.AudioClip)
    firMusic: cc.AudioClip = null;

    start() {
        // 碰撞检测系统
        cc.director.getCollisionManager().enabled = true;

        this.gameControl = cc.find("Canvas");   // 获取game节点
        this.spFly = this.getComponent(cc.Sprite) // 飞机图片组件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this) // 触摸移动
        this.schedule(this.fir.bind(this), 0.2) // 子弹发射

        // 循环遍历图片路径数组，使用cc.resources.load加载每个图片
        for (let i = 0; i < this.imagePaths.length; i++) {
            let imagePath = this.imagePaths[i];
            cc.resources.load(imagePath, cc.SpriteFrame, this.onResourceLoaded.bind(this));
        }
        for (let i = 0; i < this.destroyImagePaths.length; i++) {
            cc.resources.load(this.destroyImagePaths[i], cc.SpriteFrame, this.destroyLoaded.bind(this));
        }
    }

    // 每个图片加载完成时
    onResourceLoaded(error: Error, SpriteFrame: cc.SpriteFrame) {
        if (error) {
            console.error("Failed to load resource:", error);
            return
        }

        this.sp[this.loadedCount] = SpriteFrame
        this.loadedCount++;

        // 检查是否所有图片都已加载完成
        if (this.loadedCount === this.imagePaths.length) {
            // 所有图片都加载完成
            console.log("All images loaded!");
            this.schedule(this.updataSp.bind(this), 0.2)
        }
    }
    destroyLoaded(error: Error, SpriteFrame: cc.SpriteFrame) {
        if (error) {
            console.error("Failed to load resource:", error);
            return
        }
        this.destroySp.push(SpriteFrame)
        if (this.destroySp.length === this.destroyImagePaths.length) {
            console.log("All destroy images loaded!");
        }
    }

    fir() {
        if (this.bulletPb) {
            cc.audioEngine.playEffect(this.firMusic, false);// 子弹音效
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
            this.unscheduleAllCallbacks()
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.curIndex = 0
            this.schedule(this.updateDestroySp.bind(this), 0.5, this.destroyImagePaths.length - 1)
            // self.node.destroy();

            this.gameControl.getComponent('game').gameOver()
        }
    }
    updateDestroySp() {
        this.spFly.spriteFrame = this.destroySp[++this.curIndex]
        this.curIndex == this.destroyImagePaths.length && this.node.destroy()
    }
}
