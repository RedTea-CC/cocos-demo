
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    sp: cc.SpriteFrame[] = []
    spFly: cc.Sprite

    loadedCount: number = 0
    curIndex: number = 0
    imagePaths: string[] = ["images/me1", "images/me2"];

    start() {
        this.spFly = this.getComponent(cc.Sprite)

        // 循环遍历图片路径数组，使用cc.resources.load加载每个图片
        for (let i = 0; i < this.imagePaths.length; i++) {
            let imagePath = this.imagePaths[i];
            cc.resources.load(imagePath, cc.SpriteFrame, this.onResourceLoaded.bind(this));
        }
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

    updataSp() {
        this.curIndex = this.curIndex % this.imagePaths.length
        this.spFly.spriteFrame = this.sp[this.curIndex]
        this.curIndex++
    }
}
