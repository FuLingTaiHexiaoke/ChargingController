//var isTest = false; 
var isTest = true

//var alwaysRun = false; 
var alwaysRun = true

var topPowerLevelOfCharging = 80
var loopInterval = 1000
var runNextLoopSleepInterval = 1000 * 60 * 10
var runFlag = false;
var isMiniteAlowed = false;
var sJobRunning = false
var isCarCharging = false
var isCarAppAlreadyOpening = false
var ChargingTimeLeft = 0
var currentCheckingHour = -1
var Charging_end_date = new Date();
var tv_time_Charging_end_hours = -1
var tv_time_Charging_end_minite = -1
var tv_time_remaining_hours = -1
var tv_time_remaining_minite = -1
//var autojs_packageName = "org.autojs.autojs"

var autojs_packageName = "org.autojs.autojs1234"
var be_controled_packageName = "com.hezhong.nezha"


//执行计划任务，主方法 
function jobSchedule() {
    console.log('程序已经启动，请耐心等待。')
    //检测无障碍服务启动情况 
    //  auto.waitFor();

    var isTest_Input = rawInput("是否是测试状态（1：是，0：否）:");
    isTest_Input_Number = Number(isTest_Input)
    if(isTest_Input_Number==1){
        isTest = true
    }else{
        isTest = false 
    }


    var alwaysRun_Input = rawInput("是否启动不间断循环运行（1：是，0：否）:");
    alwaysRun_Input_Number = Number(alwaysRun_Input)
    if(alwaysRun_Input_Number==1){
        alwaysRun = true
    }else{
        alwaysRun = false 
    }

    var name = rawInput("请输入充电到百分之多少停止充电（?%）:");
    topPowerLevelOfCharging = Number(name)


    if (isTest) {
        console.show();
        loopInterval = 1000 * 10
        // loopInterval = 1000 * 60 * 25 
        runNextLoopSleepInterval = 1000 * 60 * 6
        sleep(1000 * 3);
        //topPowerLevelOfCharging = 40
        // get_screen_content()
    } else {
        console.hide(); 
        // console.show();
        loopInterval = 1000 * 10
        // loopInterval = 1000 * 60 * 25 
        runNextLoopSleepInterval = 1000 * 2
        //topPowerLevelOfCharging = 65
    }
    // toast(engines.myEngine());
    // console.log("engines.myEngine().cwd():" + engines.myEngine());
    // var result1 = launch(autojs_packageName);
    // console.log(autojs_packageName + result1)
    // sleep(1000 * 3);
    launch_app(autojs_packageName)
    //轮询 
    setInterval(function() {
        var canEnter = false

        var date = new Date();
        var currentDay = date.getDay();
        var currentHour = date.getHours();
        var currentminute = date.getMinutes()

        // var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        // var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

        var Charging_end_Day = Charging_end_date.getDay();
        var Charging_end_Hour = Charging_end_date.getHours();
        var Charging_end_minute = Charging_end_date.getMinutes()

        var isChargingInEndTimeRange = false

        if (currentDay == Charging_end_Day && currentHour == Charging_end_Hour && (currentminute >= Charging_end_minute && currentminute <= Charging_end_minute + 10)) {
            isChargingInEndTimeRange = true
        }

        console.log('是否检查充电百分比' + isChargingInEndTimeRange)
        var isChargingAndChargingIsOver = (isCarCharging == true && isChargingInEndTimeRange)
        var isTimeGoesShouldEnterForChecking = false
        // console.log('是否停止充电' + isChargingAndChargingIsOver)

        if (currentCheckingHour == currentHour) {
            isTimeGoesShouldEnterForChecking = false
        } else {
            isTimeGoesShouldEnterForChecking = true
            currentCheckingHour = currentHour
        }

        var shouldHaveAChecking = isTimeGoesShouldEnterForChecking == true && isCarCharging == false

        if (shouldHaveAChecking || isChargingAndChargingIsOver) {
            canEnter = true
        } else {
            canEnter = false
        }

        if (canEnter && !runFlag) {
            runFlag = true
            device.wakeUp();
            if (isTest) {
                sleep(1000 * 3);
            } else {
                sleep(1000 * 3);
            }
            var result = jobRun(1000);
            if (result == true || result == false) {
                killapp(be_controled_packageName);
                sleep(1000 * 3);
                var result1 = launch(autojs_packageName);
                console.log('启动充电控制APP是否成功' + result1)
                sleep(1000 * 3);
            }
            runFlag = false;
            if (isChargingAndChargingIsOver) {
                engines.stopAll();
            }
            // engines.stopAll(); 
        } else {
            console.log("充电到百分之：" + topPowerLevelOfCharging + "+++++++\n充电结束时间为：" + Charging_end_date)
            // console.log("topPowerLevelOfCharging   " + topPowerLevelOfCharging)
        }
    }, loopInterval);
}

jobSchedule()

//单次执行全流程的方法,若执行成功会返回true 
function jobRun(delay) {
    device.keepScreenOn(1000 * 60 * 5);
    sJobRunning = true
    //先点亮屏幕并设置长亮时间，防止屏幕熄灭导致定时器不准 
    var screenWake_result = screenWake();
    if (screenWake_result == true) {
        // console.log("screenWaked")
        console.log("正在唤醒屏幕")
        // console.log('等待毫秒数:' + parseInt(delay));
        sleep(parseInt(delay));
        var wakeAutoJSAppPlatform_result = wakeAutoJSAppPlatform()
        if (wakeAutoJSAppPlatform_result == true) {
            // console.log("wakedAutoJSAppPlatform")
            // var openDingTalk_result = openDingTalk(); 
            var openDingTalk_result = openDingTalk1();
            // var openDingTalk_result = openDingTalk2(); 
            // clearInterval(jobRun_interval);//停止 
            if (openDingTalk_result == true) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

function openDingTalk1() {
    console.log("准备启动哪吒APP")
    sleep(1000 * 5);
    var result1 = launch(be_controled_packageName);
    // console.log("launch(be_controled_packageName);1" + result1)
    sleep(1000 * 5);
    var result2 = launch(be_controled_packageName);
    // console.log("launch(be_controled_packageName);2" + result2)
    sleep(1000 * 5);
    var result3 = launch(be_controled_packageName);
    // console.log("launch(be_controled_packageName);3" + result3)
    if (result1 == false || result2 == false || result3 == false) {
        var screenWake_result = screenWake();
        // console.log('launch(be_controled_packageName) result1==false ||result2==false ||result3==false' + screenWake_result);
        sleep(1000 * 3);
        var result5 = launch(autojs_packageName);
        // console.log("launch(org.autojs.autojs);result5" + result5)
        sleep(1000 * 3);
        var result4 = launch(be_controled_packageName);
        // console.log("launch(be_controled_packageName);result4" + result4)
    }
    sleep(1000 * 10);
    var clickBtnr1 = clickByCoord("无忧", 5000)
    console.log('点击无忧按钮是否成功' + clickBtnr1)
    sleep(1000 * 15);
    // var screenSwipe_result = screenSwipe(1 / 2, 3 / 4)
    //console.log("screenSwipe_result" + screenSwipe_result)
    sleep(1000 * 5);
    // screen_content();
    // 判断是否在充电 
    var text_isCharging = textContains("充电中").findOne(1000 * 2); //这里处理的是无法点击的控件 
    // console.log('textContains("充电中")' + text_isCharging)
    if (isTest) {
        text_isCharging = true
    }
    if (text_isCharging != null || text_isCharging == true) {
        isCarCharging = true
        console.log('是否正在充电：' + isCarCharging)
        // 电量剩余 
        var text_powerLeft = textContains("%").findOne(1000 * 2); //这里处理的是无法点击的控件 
        // console.log('电量剩余：' + text_powerLeft)
        text_powerLeft = text_powerLeft.text()
        text_powerLeft = text_powerLeft.replace("%", "")
        console.log('电量剩余：' + text_powerLeft)
        var text_powerLeft_int = parseInt(text_powerLeft);
        // be_controled_packageName:id/tv_time_remaining
        var tv_time_remainings = id("tv_time_remaining").find();
        var tv_time_remaining_total_minite = -1
        for (var i = 0; i < tv_time_remainings.length; i++) {
            var tv_time_remaining = tv_time_remainings[i];
            var tv_time_remaining_text = tv_time_remaining.text()
            if ((tv_time_remaining_text.includes("分钟") || tv_time_remaining_text.includes("小时"))) {
                // toast('符合条件');
                // console.log('当前剩余充电时间为：', tv_time_remaining_text)
                var tv_time_remaining_text_length = tv_time_remaining_text.length
                var pos_hour = tv_time_remaining_text.indexOf("小"); //
                // console.log('tv_time_remaining_text.indexOf("小");', pos_hour)
                var hour_text = ""
                if (pos_hour > 0) {
                    hour_text = tv_time_remaining_text.slice(0, pos_hour);
                } else {}
                if (hour_text != "") {
                    tv_time_remaining_hours = parseInt(hour_text);
                }
                var pos_minite = tv_time_remaining_text.indexOf("分"); //
                // console.log('tv_time_remaining_text.indexOf("分");', pos_minite)
                var minite_text = ""
                if (pos_minite > 0 && pos_hour > 0) {
                    minite_text = tv_time_remaining_text.slice(pos_hour + 2, pos_minite)
                } else {
                    minite_text = tv_time_remaining_text.slice(0, pos_minite)
                }
                if (minite_text != "") {
                    tv_time_remaining_minite = parseInt(minite_text);
                }
            }
        }
        var date = new Date();
        var date_time = date.getTime();
        if (tv_time_remaining_hours != -1) {
            tv_time_remaining_total_minite += 1000 * 60 * 60 * tv_time_remaining_hours
            // date.setTime(date_time+ 1000*60*60 * tv_time_remaining_hours)
        }
        if (tv_time_remaining_minite != -1) {
            tv_time_remaining_total_minite += 1000 * 60 * tv_time_remaining_minite
            // date.setTime(date_time+ 1000*60 * tv_time_remaining_minite)
        }
        //计算80%的时间

        var charging_remaining_minite = (topPowerLevelOfCharging - text_powerLeft) / (100 - text_powerLeft) * tv_time_remaining_total_minite
        if (isTest) {
            charging_remaining_minite = 6 * 60
        }
        date.setTime(date_time + charging_remaining_minite)
        Charging_end_date = date
        console.log('tv_time_remaining_minite' + charging_remaining_minite)
        // console.log('tv_time_remaining_hours' + tv_time_remaining_hours)
        console.log('充电结束时间为：' + Charging_end_date)
        //screen_content();
        sleep(1000 * 10);

        //判断是否切断电源
        if ((text_powerLeft_int >= topPowerLevelOfCharging) || (text_powerLeft_int <= topPowerLevelOfCharging && isTest == true)) {

            console.log('已经达到充电阀值，准备结束充电。')

            // var clickBtnr12 = clickByCoordTopOffset("结束充电", 5000, 10)
            // console.log('lickByCoordTopOffset("结束充电",' + clickBtnr12)
            // var screenSwipe_result = screenSwipe(1 / 2, 1 / 4)
            // console.log("电量剩余>=80%screenSwipe_result" + screenSwipe_result)

            sleep(1000 * 4);

            // var clickBtnr12 = clickByCoordTopOffset("结束充电", 5000, 10)
            // console.log('lickByCoordTopOffset("结束充电",' + clickBtnr12)

            // var clickBtnr12 = clickImageView("be_controled_packageName:id/iv_ctrl")
            // var clickBtnr12 =clickImageView1("be_controled_packageName:id/iv_ctrl")

            click(400, 1600)
            sleep(1000 * 2);
            var result = checkBybtnText("取消", 1000)
            if (!result) {
                click(400, 1650)
                sleep(1000 * 2);
                result = checkBybtnText("取消", 1000)
                if (!result) {
                    click(400, 1700)
                    sleep(1000 * 2);
                    result = checkBybtnText("取消", 1000)

                    if (!result) {
                        click(400, 1700)
                        sleep(1000 * 2);
                        result = checkBybtnText("取消", 1000)

                        if (!result) {
                            click(400, 1750)
                            sleep(1000 * 2);
                            result = checkBybtnText("取消", 1000)


                        }

                    }

                }
            }





            //console.log('lickByCoordTopOffset("结束充电",' + clickBtnr12)

            sleep(1000 * 5);
            //if (clickBtnr12 == true) {
            if (isTest) {
                var clickBtnr112 = clickByCoordTopOffset("取消", 5000, 0)
                console.log('点击取消按钮是否成功：' + clickBtnr112)
                sleep(1000 * 5);
                isCarCharging = false
            } else {
                var clickBtnr112 = clickByCoordTopOffset("确定", 5000, 0)
                console.log('点击确定按钮是否成功：' + clickBtnr112)
                sleep(1000 * 15);
                isCarCharging = false
                // WeChat1("充电中  电量剩余： " + text_powerLeft, "自动结束充电")
            }
            // } else {
            // }
            return true;
        } else {
            console.log('已经未到充电阀值，继续充电。')
            // var title = "充电中  电量剩余： " + text_powerLeft
            // var des = "剩余充电时间：" + Charging_end_date
            //  WeChat1(title, des)
            return false;
        }
    } else {
        // isCarCharging = false
        console.log('车辆未在充电状态')
        return false;
    }
}

//唤醒屏幕 
function screenWake() {
    sleep(1000);
    var result = device.isScreenOn();
    // console.log("device.isScreenOn" + result)
    var width = device.width;
    var height = device.height;
    device.wakeUp();
    var isSwiped = false
    if (result == false) {
        device.wakeUp();
        sleep(1000);
        swipe(width / 2, height * 8 / 10, width / 2, height / 2, 2000);
        // console.log("device swiped")
        return true
    } else {
        device.wakeUp();
        sleep(1000);
        swipe(width / 2, height * 8 / 10, width / 2, height / 2, 2000);
        // console.log("device swiped")
        return true
    }
}

//唤醒屏幕 
function wakeAutoJSAppPlatform() {
    return true
}

function clickBtn(btnText, waitingDelay) { //传入一个按钮，确保点击了该按钮（搭配findOne，可能传入null或按钮） 
    var btn = text(btnText).clickable(true).findOne(waitingDelay); //在给定时间内持续寻找，直到找到 
    if (!btn) return false; //未在给定时间内找到按钮 
    while (!btn.click()); //不断点击按钮直到成功，因此之前要确保按钮是可点击的 
    return true;
}


function clickImageView(btnText, waitingDelay) { //传入一个按钮，确保点击了该按钮（搭配findOne，可能传入null或按钮） 
    var btn = id(btnText).findOne(waitingDelay);
    // for (var i = 0; i < fsfan.length; i++) {
    //     var ftxt = fsfan[i];
    //     if (ftxt != null) {
    //         // toast('符合条件');
    //         console.log('当前控件元素为:', ftxt)
    //         // if (fas == "") {
    //         //     fas = ftxt;
    //         //     console.log('当前控件元素为:', fas)
    //         // } else {
    //         //     fas = fas + "_-_" + ftxt;
    //         //     console.log(fas)
    //         // }
    //     }
    // }
    if (!btn) return false; //未在给定时间内找到按钮 
    while (!btn.click()); //不断点击按钮直到成功，因此之前要确保按钮是可点击的 
    return true;
}

function clickImageView1(btnText, waitingDelay) { //传入一个按钮，确保点击了该按钮（搭配findOne，可能传入null或按钮） 
    // var btn = id(btnText).findOne(waitingDelay);
    var fsfan = className("android.widget.ImageView").find();
    for (var i = 0; i < fsfan.length; i++) {
        var ftxt = fsfan[i];
        if (ftxt != null) {
            toast(ftxt);
            console.log('当前控件元素为:', ftxt)
            press(ftxt.bounds().centerX(), ftxt.bounds().centerY(), 200)
            sleep(1000 * 5);

            // if (fas == "") {
            //     fas = ftxt;
            //     console.log('当前控件元素为:', fas)
            // } else {
            //     fas = fas + "_-_" + ftxt;
            //     console.log(fas)
            // }
        }
    }
    //   if (!btn) return false;//未在给定时间内找到按钮 
    //   while (!btn.click());//不断点击按钮直到成功，因此之前要确保按钮是可点击的 
    return true;
}





function clickByCoord(btnText, waitingDelay) { //控件本身无法点击，转而获取其坐标并模拟点击动作 
    var btn = text(btnText).findOne(waitingDelay); //这里处理的是无法点击的控件 
    if (!btn) return false;
    var coord = btn.bounds();
    while (!click(coord.centerX(), coord.centerY())); //click(x,y) 
    return true;
}

function checkBybtnText(btnText, waitingDelay) { //控件本身无法点击，转而获取其坐标并模拟点击动作 
    var btn = text(btnText).findOne(waitingDelay); //这里处理的是无法点击的控件 
    if (!btn) {
        return false
    } else {
        return true;
    }


}

function clickByCoord1(btnText, waitingDelay) { //控件本身无法点击，转而获取其坐标并模拟点击动作 
    var btn = text(btnText).findOne(waitingDelay); //这里处理的是无法点击的控件 
    if (!btn) return false;
    var coord = btn.bounds();
    while (!click(coord.centerX(), coord.centerY() + 40)); //click(x,y) 
    return true;
}

function clickByCoordTopOffset(btnText, waitingDelay, offset) { //控件本身无法点击，转而获取其坐标并模拟点击动作 
    var btn = text(btnText).findOne(waitingDelay); //这里处理的是无法点击的控件 
    if (!btn) return false;
    var coord = btn.bounds();
    while (!click(coord.centerX(), coord.centerY() - offset)); //click(x,y) 
    return true;
}

function killapp(pkgName) {
    // log('func killapp');
    // for (let i = 1; i <2; i++) { 
    app['openAppSetting'](pkgName);
    var stop_obj = textMatches('/(.*停止.*|.*结束.*)/')["findOne"](5000);
    if (stop_obj != null) {
        var stop_obj2 = className("Button")["textMatches"]('/(.*停止.*|.*结束.*)/')['findOne'](1000);
        if (stop_obj2 != null) {
            if (stop_obj2["enabled"]() == true) {
                if (stop_obj2["click"]() == true) {
                    var ok_ojb = className('Button')["text"]('确定')["findOne"](1000);
                    if (ok_ojb != null) {
                        ok_ojb['click']();
                    }
                    var stop_contrl = className('Button')["textContains"]('停止')["findOne"](1000);
                    if (stop_contrl != null) {
                        stop_contrl["click"]();
                    }
                }
            } else {}
        }
    }
    sleep(1000);
    // } 
    // log('finish-end');
    home();
    sleep(1000 * 5);
    var result1 = launch("org.autojs.autojs");
    // console.log("function killapp(pkgName)  launch(org.autojs.autojs);{" + result1)
    console.log("是否成功关闭" + pkgName + "应用：" + result1)
    sleep(1000 * 3);
}

function screen_content() {
    var fas = "";
    //按元素id查找，，可以为className、desc等
    // var fsfan = id("phone_number_edit").find();
    //var fsfan = className("android.widget.TextView").find();
    var fsfan = className("android.widget.Button").find();
    // Button
    for (var i = 0; i < fsfan.length; i++) {
        var ftxt = fsfan[i];
        if (ftxt != null) {
            // toast('符合条件');
            console.log('当前控件元素为:', ftxt)
            // if (fas == "") {
            //     fas = ftxt;
            //     console.log('当前控件元素为:', fas)
            // } else {
            //     fas = fas + "_-_" + ftxt;
            //     console.log(fas)
            // }
        }
    }
    //第二部查找所有控件
    let rooot2 = find()
    //第三步 调用递归方法
    queryList(rooot2)
}

function queryList(json) {
    for (var i = 0; i < json.length; i++) {
        var sonList = json[i];
        if (sonList.childCount() == 0) {
            console.log(json[i])
        } else {
            queryList(sonList);
        }
    }
}

function get_screen_content() {
    var title = "充电中  电量剩余： " + "text_powerLeft"
    var des = "剩余充电时间：" + Charging_end_date
    WeChat1(title, des)
    var result4 = launch(be_controled_packageName);
    console.log("launch(be_controled_packageName);result4" + result4)
    sleep(1000 * 10);
    var clickBtnr1 = clickByCoord("无忧", 5000)
    console.log('clickBtn("无忧", 5000)' + clickBtnr1)
    sleep(1000 * 9);
    //     var screenSwipe_result = screenSwipe(1 / 2, 3 / 4)
    //     console.log("screenSwipe_result" + screenSwipe_result)
    //     sleep(1000 * 2);
    //     var screenSwipe_result = screenSwipe(1 / 2, 1 / 4)
    //     console.log("电量剩余>=80%screenSwipe_result" + screenSwipe_result)
    //     sleep(1000 * 5);

    var tv_time_remainings = id("iv_ctrl").find();
    var tv_time_remaining_total_minite = -1
    for (var i = 0; i < tv_time_remainings.length; i++) {
        var tv_time_remaining = tv_time_remainings[i];
        click(tv_time_remaining.bounds.centerX, tv_time_remaining.bounds.centerY)


    }

    //     screen_content();
}

function launch_app(packageName) {
    launch_app_result = false;
    for (var i = 0; i < 3; i++) {
        var launch_app_result = launch(packageName);
        // console.log(packageName + launch_app_result)
        sleep(1000 * 3);
    }
    if (launch_app_result == false) {
        return false
    } else {
        return true
    }
}
//唤醒屏幕 
function screenSwipe(startHeightPercent, endHeightPercent) {
    sleep(1000);
    var result = device.isScreenOn();
    // console.log("device.isScreenOn" + result)
    var width = device.width;
    var height = device.height;
    device.wakeUp();
    var isSwiped = false
    if (result == false) {
        sleep(1000);
        swipe(width / 2, height * startHeightPercent, width / 2, height * endHeightPercent, 5000);
        // console.log("device swiped")
        return true
    } else {
        device.wakeUp();
        sleep(1000);
        swipe(width / 2, height * startHeightPercent, width / 2, height * endHeightPercent, 5000);
        // console.log("device swiped")
        return true
    }
}
//唤醒屏幕 
function unlockDevice(isSwiped) {
    // console.log("准备解锁")
    sleep(2000);
    if (isSwiped) {
        // console.log("解锁中")
        desc(1).findOne().click();
        sleep(1000);
        desc(6).findOne().click();
        sleep(1000);
        desc(6).findOne().click();
        sleep(1000);
        desc(2).findOne().click();
        sleep(1000);
        desc(5).findOne().click();
        sleep(1000);
        desc(8).findOne().click();
        sleep(2000);
        return true
    } else {
        // console.log("不解锁")
        return true
    }
}

function isZero(m) {
    return m < 10 ? '0' + m : m
}
// 将字符串转为Date格式，获取对应的年、月、日、时、分、秒。组合格式 
function getDateFormat(time) {
    //时间戳是整数，否则要parseInt转换 
    // var time = new Date(); // 需要使用Date格式进行日期转化，若是时间戳、字符串时间，需要通过new Date(..)转化 
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + isZero(m) + '-' + isZero(d) + ' ' + isZero(h) + ':' + isZero(mm);
}

function getHoursFormat(time) {
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return isZero(h) + ':' + isZero(mm) + ':' + isZero(s);
}

function WeChat(title, desp) {
    var thread = threads.start(function() {
        //在子线程执行的定时器 
        try {
            const key = "SCT164316TwtqRb0YwTAYoG94TUdc3B8Us";
            let url = ["https://sc.ftqq.com/", key, ".send"].join("");
            var res = http.post(url, {
                "title": title,
                "desp": desp || ""
            });
            console.info(res.statusCode)
            console.info(res.body.json())
        } catch (err) {
            console.info("WeChat error:" + err)
        }
    });
    return true
}

function WeChat1(title, desp) {
    var thread = threads.start(function() {
        //在子线程执行的定时器 
        try {
            const key = "UID_QzP2dlhPDT0lbib3fdUTEybfP178";
            let url = ["https://sc.ftqq.com/", key, ".send"].join("");
            var res = http.post(url, {
                "title": title,
                "desp": desp || ""
            });
            console.info(res.statusCode)
            console.info(res.body.json())
        } catch (err) {
            console.info("WeChat error:" + err)
        }
    });
    return true
}