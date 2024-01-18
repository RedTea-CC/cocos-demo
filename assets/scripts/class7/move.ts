// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    // onLoad () {}

    start() {
        cc.tween(this.node)
            .to(1, { position: cc.v3(100, 100), angle: 360 })
            .to(1, { scale: 2 })
            .start()
    }

    // update (dt) {}
}
