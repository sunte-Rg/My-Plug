/**
 * pullRefresh.js  ver 1.0
 * author rg
 * */
var pullRefresh = function(){

	this.slideId="";
	this.scrollHeight = "";
	this.moveFlag = false ;     //标识是否移至底部
	this.loadingFlag = true ; //标识是否正在加载
	this.moveStart = 0 ;
	this.loadingId = '';
	this.handStart = function(){};
	this.handMove = function(){}
	this.handEnd = function(){}
	this.initPrompt = '上拉加载';
	this.pullPrompt = '松开刷新';
	this.endPrompt = '<img style="height:25px;" src="./img/loading.gif" />';
	this.moveDistance=10;
}

/**
 * 初始化
 * @param args   set params
 */
pullRefresh.prototype.init = function(args){
	var self = this ;
	if(self.initErrorInit(args)){
		self.slideId=args.slideId;
		self.loadingId = args.loadingId ;   //加载显示的id
		self.handEnd = args.handEnd ;
		self.handStart = args.handStart ;
		self.handMove = args.handMove ;
		self.initPrompt = !args.initPrompt?self.initPrompt:args.initPrompt;
		self.pullPrompt = !args.pullPrompt?self.pullPrompt:args.pullPrompt;
		self.endPrompt = !args.endPrompt?self.endPrompt:args.endPrompt;
	}
	self.move();
}

/**
 * 检测初始化参数是否正确
 * *  @param args    用户初始化参数
 * * @returns {boolean}   检测结果
 * */
pullRefresh.prototype.initErrorInit = function(args){
		if(!args) {
			console.error("pull init error:args is not null");
			return false;
		}
		if(!args.loadingId) {
			console.error("pull init error:loadingId is not null");
			return false;
		}
		if(!args.slideId) {
			console.error("pull init error:slideId is not null");
			return false;
		}
	return true ;
}

/**
 * 手指移动方法
 * */
pullRefresh.prototype.move = function(){
	var self = this ;
	//手指按下
	document.getElementById(self.slideId).addEventListener('touchstart', function(event) {
			var touch = event.targetTouches[0];
		self.moveStart=  touch.pageY;
		self.scrollHeight = $(document).scrollTop();
        this.moveDistance=10;
		if( typeof self.handStart =='function'){
			self.handStart();
		}
	},false);
	//手指移动
	document.getElementById(self.slideId).addEventListener('touchmove', function(event) {
		var touch = event.targetTouches[0];
		//移动至底部且未在加载中
		console.log("move" );
		console.log($(document).scrollTop() +" " + ( $(document).height() - $(window).height() ));
		if (($(document).scrollTop()+1 >= $(document).height() - $(window).height() ) ) {
		 	//上划手势
		 	if((touch.pageY - self.moveStart) < 0 ){
				if( self.loadingFlag){
					self.moveFlag = true ;    //标识  已移至底部
					$("#"+self.loadingId).text(self.pullPrompt);
					if( typeof self.handStart =='function'){
						self.handMove();
					}
				}
				$("#" + self.loadingId).css("margin-bottom", (parseInt($("#" + self.loadingId).css('margin-bottom')) +   this.moveDistance) + 'px');
                this.moveDistance>0.2?this.moveDistance-=0.2:this.moveDistance=0;
			}
			self.scrollHeight = $(document).scrollTop();
		}else if($(document).scrollTop() - self.scrollHeight   < 0 ){   //放弃加载
					self.moveFlag = false ;    //标识  已移至底部
					$("#" + self.loadingId).css("margin-bottom", 40 + 'px');
					$("#"+self.loadingId).text(self.initPrompt);
		}
	},false);

	//手指手指移开
	document.getElementById(self.slideId).addEventListener('touchend', function(event) {
		//移至底部 且 未在加载中  才能再次加载
		if( self.moveFlag &&  self.loadingFlag   ) {
            $(document).scrollTop($(document).height());
			$("#"+self.loadingId).html(self.endPrompt);
			self.loadingFlag = false;		//关闭加载
			if( typeof self.handEnd =='function'){
				self.handEnd(function(prompt) {
					self.loadingFlag = true;  //打开加载
					self.moveFlag = false ;
					if(!prompt)
						$("#" + self.loadingId).text(self.initPrompt);
					else
						$("#" + self.loadingId).text(prompt);
				});
			}else{
				console.error("pull init error:handEnd is not function");
			}
		}
			$("#"+self.loadingId).css('margin-bottom', '10px');
	},false);
}

















