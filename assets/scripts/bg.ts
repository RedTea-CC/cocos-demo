
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    list:cc.Node[] = [];

    speed : number = 300;

    onLoad () {
        this.list = this.node.children;
    }

    start () {
        
    }

    update (dt) {
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].y -= this.speed * dt;
            // console.log('position',this.list[i].y);

            if (this.list[i].y <= -955) {
                this.list[i].y = 955;
            }
        }
    }
}
