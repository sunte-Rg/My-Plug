@echo off
SETLOCAL ENABLEDELAYEDEXPANSION
echo ------ ˵��������bat����less�ļ�ͬĿ¼�£��������� ------
echo ------         �����Զ�����ͬ����css�ļ�           ------
echo ------            3s ���Զ�ˢ��                    ------
echo ------        ������ʱ��س�һ�¹�                 ------
:flag
for /r %%s in (*.less) do ( 
	@SET fname=%%s  
    	echo %%s -- !fname:.less=.css!
        call lessc !fname! !fname:.less=.css!  

)   
echo ------ wait  ------ 
ping -n 3 127.0.0.0>nul  
goto flag 