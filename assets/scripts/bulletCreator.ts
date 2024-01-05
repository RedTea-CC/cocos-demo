// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed: number = 300;

    start() {
        cc.director.getCollisionManager().enabled = true;
    }

    update(dt) {
        this.node.y += this.speed * dt;
        if (this.node.y > 960) {
            this.node.destroy();
        }
    }

    onCollisionEnter(other, self) {
        // console.log('子弹', other.node.name)
        if (other.node.name.includes('enemy')) {
            other.node.destroy();
            self.node.destroy();
        }
    }
}
