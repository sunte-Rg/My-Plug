@echo off
SETLOCAL ENABLEDELAYEDEXPANSION
echo ------ 说明：将本bat放入less文件同目录下，启动即可 ------
echo ------         将会自动生成同名的css文件           ------
echo ------            3s 后自动刷新                    ------
echo ------        不动的时候回车一下哈                 ------
:flag
for /r %%s in (*.less) do ( 
	@SET fname=%%s  
    	echo %%s -- !fname:.less=.css!
        call lessc !fname! !fname:.less=.css!  

)   
echo ------ wait  ------ 
ping -n 3 127.0.0.0>nul  
goto flag 