/**
 * Created by family-rg on 2018/12/5.
 */
//虚拟数据，可自己放入图片后，替换成对应数组
var imgLists = [
   'ban1.png',
   'banner.jpg',
   'banner.png',
   'blue_icon.png',
   'bottom.png',
   'cooperativePartner.png',
   'ejectLayer.png',
   'favicon.ico',
   'floatLayer.png',
   'headImg.jpg',
   'home_b0.png',
   'home_b1.png',
   'home_b2.png',
   'home_b3.png',
   'home_b4.png',
   'home_b5.png',
   'leftArrow.png',
   'link.png',
   'liuzi.png',
   'logo2.png',
   'matchingTechnology.png',
   'moreServices.png',
   'notPlay.png',
   'orange_icon.png',
   'orange_square.png',
   'pwd_icon.png',
   'rightArrow.png',
   'saoma.png',
   'selectItemBg.png',
   'usr_icon.png',
   'videoContainer.png',
   'videoMask.png',
];
function getScrollbarWidth() {//页面没有滚动条时返回滚动条宽度，存在时返回0
    var odiv = document.createElement('div'),//创建一个div
        styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll'//让他有滚动条
        }, i, scrollbarWidth;
    for (i in styles) odiv.style[i] = styles[i];
    document.body.appendChild(odiv);//把div添加到body中
    scrollbarWidth = odiv.offsetWidth - odiv.clientWidth;//相减
    odiv.remove();//移除创建的div
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)?0:scrollbarWidth;//返回滚动条宽度
}

var ImgLoadUtil = function(){
    this.dynamicBaseHeight=30 ;//动态高度基数，浏览器宽度改变时，用于增加高度的基数
    this.baseHeight = 150; //图片固定高度基数
    this.baseWidth =1200; //动态高度调整因子
    this.imgDivPadding = 1;//图片之间的间距
    this.imgDivLists = [];//题片容器数组
    this.containerWidth =  0;//容器的整体宽度---计算时需要去掉滚动条的宽度，不然会影响
    this.imgDivHeight = 0; //容器的高度--根据 高度基数+动态高度 得出
    this.minFraction = 3;//每行最小图片数量，默认3，会根据窗口大小进行调整
    this.rowWidthCalcObj= {//用来计算追加行的当前宽度,和当前行的图片个数
        rowImgNum:0,
        rowNowWidth:0
    };
    this.dataLoadFlag = true ;//用于滚动时标识是否能禁止下一次数据
}

ImgLoadUtil.prototype = {
    init:function() {
        var self = this;
        self.imgDivLists = [];
        imgLists = imgLists.slice(0,imgLists.length>50?50:imgLists.length);
        document.getElementById('imgContainer').innerHTML = '';

        var onresizeTime = null;
        window.onresize  = function() {//窗口大小改变重头渲染
            if (self.imgDivLists.length == 0) return; //页面刚打开的时候会触发此方法
            if (onresizeTime !== null) clearTimeout(onresizeTime);
            onresizeTime = setTimeout(function () {
                self.init();
            }, 100);
        }

        var scrollTime = null ,loadNum = 30;
        window.onscroll= function(){//模拟数据瀑布流加载
            if((document.getElementById('imgContainer').offsetHeight - window.innerHeight - document.documentElement.scrollTop) < self.imgDivHeight * 3){
                if(self.dataLoadFlag) return ;
                self.dataLoadFlag = true;
                if(scrollTime !== null)  clearTimeout(scrollTime);
                scrollTime = setTimeout(function(){
                    for(var i = 0 ; i<loadNum;i++){
                        imgLists.push(imgLists[Math.floor(Math.random()*(imgLists.length-1)+1)]);
                    }
                    self.getImgDivDom(imgLists.length - loadNum);
                },100);
            }
        }


        self.getImgDivDom(0);
    },
    getImgDivDom:function(i){//递归，生成 Img 容器（由上一张图片加载完成控制下一张图片是否加载）
        var self =this ;
        var imgDom=document.createElement("img");
        var imgDomDiv=document.createElement("div");
        var imgInfoDom=document.createElement("p");
        imgDom.className = 'imgItem';
        imgDom.setAttribute('index',i);
        imgDom.onload = function(){//如果后台有直接返回图片的宽高就不用多此一举了，这里只能通过此方法获取图片真实宽高
            imgDom.setAttribute('originalwidth',imgDom.width);//记录原始快读
            imgDom.setAttribute('originalheight',imgDom.height);//记录原始高度
            imgInfoDom.innerText = imgDom.width + ' X ' + imgDom.height;
            self.imgDivCalcSize(imgDomDiv);
            if( i < imgLists.length-1 ) self.getImgDivDom(++i);
            else self.dataLoadFlag = false;
        }
        imgDom.onclick  = function(){
            window.open(this.src);
        }
        imgDomDiv.onmouseenter = function(e) {//用于处理鼠标移入显示大小
            //获取鼠标在当前元素的坐标位置，以矩形中心为原点计算
            var x = e.offsetX - Math.floor(imgDomDiv.offsetWidth / 2);
            var y = Math.floor(imgDomDiv.offsetHeight / 2) - e.offsetY;
            //将矩形坐标向正方形偏移计算
            x =  x  * (imgDomDiv.offsetWidth > imgDomDiv.offsetHeight ? (imgDomDiv.offsetHeight / imgDomDiv.offsetWidth) : 1);
            y = y * (imgDomDiv.offsetHeight >imgDomDiv.offsetWidth ? (imgDomDiv.offsetWidth / imgDomDiv.offsetHeight) : 1);
            //计算鼠标移入方向 0 1 2 3  下右上左
            var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
            self.imgInfoMove(imgInfoDom, direction, 0);
        }
        imgDomDiv.onmouseleave = function(e){//用于处理鼠标移处隐藏大小
            var x = e.offsetX - Math.floor(imgDomDiv.offsetWidth / 2);
            var y = Math.floor(imgDomDiv.offsetHeight / 2) - e.offsetY;
            x =  x  * (imgDomDiv.offsetWidth > imgDomDiv.offsetHeight ? (imgDomDiv.offsetHeight / imgDomDiv.offsetWidth) : 1);
            y = y * (imgDomDiv.offsetHeight >imgDomDiv.offsetWidth ? (imgDomDiv.offsetWidth / imgDomDiv.offsetHeight) : 1);
            var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
            self.imgInfoMove(imgInfoDom, direction, 1);
        }
        imgDomDiv.className = 'imgDiv';
        imgInfoDom.className = 'imgInfo';
        imgDomDiv.style.padding = self.imgDivPadding +'px';
        imgDomDiv.appendChild(imgDom);
        imgDomDiv.appendChild(imgInfoDom);

        var imgContainerDom = document.getElementById('imgContainer');
        imgContainerDom.appendChild(imgDomDiv);
        self.imgDivLists.push(imgDomDiv);

        self.loadImgUrl(imgDom);
    },
    /**
     *
     * @param direction 0 1 2 3  ：下右上左
     * @param mode 0：进 1:出
     */
    imgInfoMove:function(imgInfoDom,direction,mode){
        imgInfoDom.style.bottom = direction=='2'? imgInfoDom.offsetHeight +'px':direction=='0'?(-imgInfoDom.offsetHeight +'px'):0 ;
        imgInfoDom.style.left = direction=='1'? imgInfoDom.offsetWidth +'px':direction=='3'?(-imgInfoDom.offsetWidth +'px'):0 ;
        clearTimeout(imgInfoDom.timeObj);
        if(mode==0){
            imgInfoDom.timeObj = setTimeout(function(){
                imgInfoDom.style.opacity = .7;
                imgInfoDom.style.bottom = 0 ;
                imgInfoDom.style.left = 0 ;
            },100);
        }else{
            imgInfoDom.timeObj = setTimeout(function(){
                imgInfoDom.style.opacity =0;
            },100);
        }
    },
    loadImgUrl:function(imgDom) {//载入图片地址
        imgDom.src = './img/' + imgLists[imgDom.getAttribute('index')];
    },
    imgDivCalcSize:function(imgDomDiv) {//容器宽高动态计算
        var self = this;
        self.minFraction = Math.floor(document.getElementById('imgContainer').offsetWidth /400) ;//每行最小图片数量，会根据窗口大小进行调整
        self.containerWidth =  Math.floor(document.getElementById('imgContainer').offsetWidth-getScrollbarWidth() -3);
        self.imgDivHeight = self.baseHeight + (self.containerWidth/ self.baseWidth * self.dynamicBaseHeight);
        var imgDom = imgDomDiv.getElementsByTagName('img')[0];
        var imgOriginalWidth = parseInt(imgDom.getAttribute('originalwidth')),imgOriginalHeight=  parseInt(imgDom.getAttribute('originalheight'));
        var baseW_H = self.containerWidth / self.imgDivHeight; //容器的宽高比
        var imgW_H = imgOriginalWidth / imgOriginalHeight; //图片的原始宽高比例
        self.resetImgDiv(imgDomDiv);
        imgDomDiv.style.height = self.imgDivHeight + 'px';
        if (imgW_H > baseW_H / self.minFraction) {//图片宽高比高于指定份额的宽高比则固定容器的宽度
            imgDomDiv.style.width = parseFloat(self.containerWidth / self.minFraction) + 'px';
            imgDom.style.width = imgDomDiv.style.width;
            imgDom.style.marginTop = ((self.imgDivHeight - imgDom.height) / 2 ) + 'px';
        } else {//否则容器的宽度就随图片的宽度定下来
            imgDom.style.height = self.imgDivHeight + 'px';
            imgDomDiv.style.width = imgDom.width + 'px';
        }
        self.rowCalc(imgDomDiv);
        imgDomDiv.style.opacity='1';
    },
    rowCalc:function(imgDomDiv){//进行行计算适配处理
        var self = this ;
        var imgDom = imgDomDiv.getElementsByTagName('img')[0];
        var nowIndex = parseInt(imgDom.getAttribute('index'));
        var distributionWidth = imgDomDiv.offsetWidth;//当前容器的宽度

        if(nowIndex == 0){//第一个元素重新渲染时，统计重置
            self.rowWidthCalcObj = {
                rowImgNum: 0,
                rowNowWidth: 0
            };
        }
        var surplusWidth = self.containerWidth-self.rowWidthCalcObj.rowNowWidth;//当前行剩余宽度
        if (distributionWidth>surplusWidth) {//如果图片当前行放不下
            // console.log(nowIndex+' '+JSON.stringify(self.rowWidthCalcObj));
            if(surplusWidth / distributionWidth > 0.7){ //图片和空白差距不大(未超过30%)，挤一挤吧
                var rowDistributionWidth = (distributionWidth-surplusWidth) / (self.rowWidthCalcObj.rowImgNum+1); // 当前行每张图片该减少的宽度
                for (var i = nowIndex - self.rowWidthCalcObj.rowImgNum; i <= nowIndex; i++) {
                    var nowWidth = self.imgDivLists[i].offsetWidth - rowDistributionWidth;
                    self.imgDivLists[i].style.width = nowWidth-self.imgDivPadding*2 + 'px';
                    self.imgDivLists[i].getElementsByTagName('img')[0].style.width = nowWidth-self.imgDivPadding*2 + 'px';
                    self.imgDivLists[i].getElementsByTagName('img')[0].style.height = 'auto';
                }

                self.rowWidthCalcObj = {//调整完之后，统计重置
                    rowImgNum: 0,
                    rowNowWidth: 0
                };
            }else{//差距过大，则把当前行的图片宽度调整至刚好一行
                var rowDistributionWidth = surplusWidth / self.rowWidthCalcObj.rowImgNum; // 当前行每张图片该增加的宽度
                for (var i = nowIndex - self.rowWidthCalcObj.rowImgNum; i < nowIndex; i++) {
                    var nowWidth = self.imgDivLists[i].offsetWidth + rowDistributionWidth;
                    self.imgDivLists[i].style.width = nowWidth-self.imgDivPadding*2 + 'px';
                    self.imgDivLists[i].getElementsByTagName('img')[0].style.width = nowWidth-self.imgDivPadding*2 + 'px';
                    self.imgDivLists[i].getElementsByTagName('img')[0].style.height = 'auto';
                }

                //当前行只有一张图片
                self.rowWidthCalcObj.rowNowWidth = imgDomDiv.offsetWidth;
                self.rowWidthCalcObj.rowImgNum=1;
            }
        }else{//当前行可继续放图片
            self.rowWidthCalcObj.rowNowWidth += imgDomDiv.offsetWidth;
            self.rowWidthCalcObj.rowImgNum++;
        }
    },
    resetImgDiv:function(imgDomDiv){
        imgDomDiv.style.width = 'auto';
        imgDomDiv.style.height = 'auto';
        imgDomDiv.getElementsByTagName('img')[0].style.width = 'auto';
        imgDomDiv.getElementsByTagName('img')[0].style.height = 'auto';
    },
}

window.onload = function(){
    var imgLoadUtil = new ImgLoadUtil();
    imgLoadUtil.init();
}

