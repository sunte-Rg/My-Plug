@echo off
SETLOCAL ENABLEDELAYEDEXPANSION
echo ------ ˵��������bat����less�ļ�ͬĿ¼�£��������� ------
echo ------         �����Զ�����ͬ����css�ļ�           ------
echo ------            3s ���Զ�ˢ��                    ------
echo ------        ������ʱ��س�һ�¹�                 ------
:flag
for  %%i in (*.less) do  (
	@SET fname=%%i  
    	echo %%i -- !fname:.less=.css!
        call lessc !fname! !fname:.less=.css!  
   
)   
echo ------ wait  ------ 
ping -n 3 127.0.0.0>nul  
goto flag 