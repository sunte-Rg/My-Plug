<template>
    <div class="revEnvelope" >
        <img  v-show="!gameFlag" src="./img/redStart.gif" alt="" class="startRed" @click="init">
        <div v-show="gameFlag">
            <h1 class="startTime" v-show="startTime>=0">{{startTime || "GO!"}}</h1>
            <h1 class="countDown" v-show="startTime<0 && countDownNum>=0">{{"剩余："+countDownNum+"s"}}</h1>
            <div class="bg"></div>
            <img v-for="item in redLists" :style="{'top':item.yNum+'px',left:item.xNum+'px',transform:'rotate('+item.rotateNum+'deg)'}" v-show="item.state==1" class="redImg"
                 :src="item.openState==0? require('./img/redEnvelope.png'):require('./img/openRedEnvelope.png')" @click="openRed(item)" alt="">
        </div>
    </div>
</template>
<script>
    import {Toast} from 'mint-ui';
    export default {
        name: '',
        data () {
            return {
                redLists:[],
                clickFlag:0,//0：可点击   1：不可点击   （避免手速过快的人使劲点  ε=(･д･｀*)ﾊｧ ）
                redEnvelopeTotal:0,//点中的红包总数
                countDownNum:10,//抢红包能用的时间
                startTime:3, //启动时的倒计时
                gameFlag:false,//是否启动游戏
            }
        },
        props: ['time'],
        components: {},
        created: function () {
            let vm = this;
        },
        mounted(){
        },
        methods: {
            init(){
                let vm = this;
                vm.startTime = 3 ;
                vm.countDownNum = 10 ;
                vm.redEnvelopeTotal = 0 ;
                vm.redLists=[];
                vm.startTimeDown();
            },
            startTimeDown(){//开始倒计数
                let vm = this,timeObj = 0 ;
                vm.gameFlag = true ;
                timeObj = setInterval(function(){
                    if(--vm.startTime <0){
                        clearInterval(timeObj);
                        for(let i = 0 ; i < 3 ; i++) vm.redLists.push(new RedEnvelope());//初始化 若干个红包
                        setTimeout(vm.start,100);//开始红包雨
                    }
                },1000)
            },
            start(){
                let vm = this ;
                for(let i = 0 ; i <  vm.redLists.length ; i++){
                    //红包超出屏幕外面，位置重置
                    if(vm.redLists[i].yNum > window.innerHeight)  vm.redLists[i].initPosition();
                    else  vm.redLists[i].move();

                }
                if(vm.redLists.length <15) vm.redLists.push(new RedEnvelope()); //保证屏幕上的红包能渐渐增加
                if(vm.countDownNum-- == 0 ) vm.overGame();
                else   setTimeout(vm.start,1000);
            },
            openRed(item){
                let vm = this ;
                if(vm.clickFlag ==1) return ;
                vm.clickFlag =  1 ;
                item.openState = 1;
                vm.redEnvelopeTotal ++ ;
                setTimeout(function(){vm.clickFlag = 0 ;},222);//0.3s才能再次点击红包
            },
            overGame(){
                let vm = this ;
                vm.gameFlag = false ;
                Toast("你点中了"+vm.redEnvelopeTotal+"个红包，然并卯~");
            }
        }
    }

    class RedEnvelope {
        constructor() {
            this.initPosition();
        }

        initPosition() {
//          window.innerHeight   window.innerWidth
            this.xNum = parseInt(Math.random() * (window.innerWidth)) - 50;  //红包的初始水平位置
            this.yNum = -300;  //红包初始的垂直位置
            this.xMoveSpeed = parseInt(Math.random() * 60) - 30; //-30~30 的 横向运动速度
            this.rotateNum = this.xMoveSpeed;//红包的偏转角度   -30°~ 30° 之间,根据横向偏移量计算
            this.yMoveSpeed = parseInt(Math.random() * window.innerHeight*0.3  + window.innerHeight*0.3); //纵向运动速度
            this.state = 0; //状态  0：位置重置中  1:正常move
            this.openState = 0 ;  // 是否被打开 0：未被打开  1：已打开
        }

        move(){//红包移动的方法
            let self = this;
            this.state = 1 ;
            setTimeout(function(){
                self.xNum += self.xMoveSpeed;
                self.yNum += self.yMoveSpeed;
            },100)
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .startRed{position: fixed;width:1rem; left:5%; z-index: 999;bottom:17%;}
    .revEnvelope{
        .bg{position: fixed;width:100%;height:100%;left:0;top:0;right:0;bottom:0;background:#000000;opacity: .3;z-index: 990;}
        .startTime{ position: fixed;top:40%;font-size: 1.6rem;width:100%;left:0;text-align: center;color: #FFF;  -webkit-text-stroke:.06rem  red;  z-index: 991; font-weight: bold;}
        .countDown{ position: fixed;top:5%;font-size: .4rem;width:100%;left:0;text-align: center;color: #FFF;  -webkit-text-stroke:.02rem  red;  z-index: 993; }
        .redImg{ position: fixed;z-index: 992;width: 12%;
            transition: all 1s linear;
            -moz-transition: all 1s linear;	/* Firefox 4 */
            -webkit-transition: all 1s linear;	/* Safari 和 Chrome */
            -o-transition: all 1s linear;	/* Opera */
        }
    }
</style>
