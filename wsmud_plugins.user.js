// ==UserScript==
// @name         wsmud_plugins
// @namespace    cqv
// @version      0.0.10
// @date         01/07/2018
// @modified     10/08/2018
// @homepage     https://greasyfork.org/zh-CN/scripts/370135
// @description  武神传说 MUD
// @author       fjcqv
// @match        http://game.wsmud.com/*
// @run-at       document-start
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==
(function () {
    'use strict';

    var _ws = window.WebSocket, ws, ws_on_message;
    var roomItemSelectIndex = -1;
    var timer = 0;
    var cnt = 0;
    var zb_npc;
    var zb_place;
    var goods = {
        //扬州城-醉仙楼-店小二
        "米饭": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "包子": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "鸡腿": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "面条": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "扬州炒饭": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "米酒": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "花雕酒": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "女儿红": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "醉仙酿": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        "神仙醉": {
            "id": null,
            "sales": "店小二",
            place: "扬州城-醉仙楼"
        },
        //扬州城-杂货铺
        "布衣": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "钢刀": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "木棍": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "英雄巾": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "布鞋": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "铁戒指": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "簪子": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "长鞭": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "钓鱼竿": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },
        "鱼饵": {
            "id": null,
            "sales": "杂货铺老板 杨永福",
            place: "扬州城-杂货铺"
        },

        //扬州城-打铁铺
        "铁剑": {
            "id": null,
            "sales": "铁匠铺老板 铁匠",
            place: "扬州城-打铁铺"
        },
        "钢刀": {
            "id": null,
            "sales": "铁匠铺老板 铁匠",
            place: "扬州城-打铁铺"
        },
        "铁棍": {
            "id": null,
            "sales": "铁匠铺老板 铁匠",
            place: "扬州城-打铁铺"
        },
        "铁杖": {
            "id": null,
            "sales": "铁匠铺老板 铁匠",
            place: "扬州城-打铁铺"
        },
        "铁镐": {
            "id": null,
            "sales": "铁匠铺老板 铁匠",
            place: "扬州城-打铁铺"
        },

        //扬州城-药铺
        "金创药": {
            "id": null,
            "sales": "药铺老板 平一指",
            place: "扬州城-药铺"
        },
        "引气丹": {
            "id": null,
            "sales": "药铺老板 平一指",
            place: "扬州城-药铺"
        },
        "养精丹": {
            "id": null,
            "sales": "药铺老板 平一指",
            place: "扬州城-药铺"
        },
    };
    var equip = {
        "铁镐": 0,
    };
    var npcs = {
        "店小二": 0
    };
    var place = {
        "住房": "jh fam 0 start;go west;go west;go north;go enter",
        "扬州城-醉仙楼": "jh fam 0 start;go north;go north;go east",
        "扬州城-杂货铺": "jh fam 0 start;go east;go south",
        "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
        "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
        "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
        "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
        "武当派-广场": "jh fam 1 start;",
        "武当派-三清殿": "jh fam 1 start;go north",
        "武当派-石阶": "jh fam 1 start;go west",
        "武当派-练功房": "jh fam 1 start;go west;go west",
        "武当派-太子岩": "jh fam 1 start;go west;go northup",
        "武当派-桃园小路": "jh fam 1 start;go west;go northup;go north",
        "武当派-舍身崖": "jh fam 1 start;go west;go northup;go north;go east",
        "武当派-南岩峰": "jh fam 1 start;go west;go northup;go north;go west",
        "武当派-乌鸦岭": "jh fam 1 start;go west;go northup;go north;go west;go northup",
        "武当派-五老峰": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup",
        "武当派-虎头岩": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup",
        "武当派-朝天宫": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north",
        "武当派-三天门": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north",
        "武当派-紫金城": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north",
        "武当派-林间小径": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north",
        "武当派-后山小院": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north;go north",
        "少林派-广场": "jh fam 2 start;",
        "少林派-山门殿": "jh fam 2 start;go north",
        "少林派-东侧殿": "jh fam 2 start;go north;go east",
        "少林派-西侧殿": "jh fam 2 start;go north;go west",
        "少林派-天王殿": "jh fam 2 start;go north;go north",
        "少林派-大雄宝殿": "jh fam 2 start;go north;go north;go northup",
        "少林派-钟楼": "jh fam 2 start;go north;go north;go northeast",
        "少林派-鼓楼": "jh fam 2 start;go north;go north;go northwest",
        "少林派-后殿": "jh fam 2 start;go north;go north;go northwest;go northeast",
        "少林派-练武场": "jh fam 2 start;go north;go north;go northwest;go northeast;go north",
        "少林派-罗汉堂": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go east",
        "少林派-般若堂": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go west",
        "少林派-方丈楼": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north",
        "少林派-戒律院": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go east",
        "少林派-达摩院": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go west",
        "少林派-竹林": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north;go north",
        "少林派-藏经阁": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north;go west",
        "少林派-达摩洞": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north;go north;go north",
        "华山派-镇岳宫": "jh fam 3 start;",
        "华山派-苍龙岭": "jh fam 3 start;go eastup",
        "华山派-舍身崖": "jh fam 3 start;go eastup;go southup",
        "华山派-峭壁": "jh fam 3 start;go eastup;go southup;jumpdown",
        "华山派-山谷": "jh fam 3 start;go eastup;go southup;jumpdown;go southup",
        "华山派-山间平地": "jh fam 3 start;go eastup;go southup;jumpdown;go southup;go south",
        "华山派-林间小屋": "jh fam 3 start;go eastup;go southup;jumpdown;go southup;go south;go east",
        "华山派-玉女峰": "jh fam 3 start;go westup",
        "华山派-玉女祠": "jh fam 3 start;go westup;go west",
        "华山派-练武场": "jh fam 3 start;go westup;go north",
        "华山派-练功房": "jh fam 3 start;go westup;go north;go east",
        "华山派-客厅": "jh fam 3 start;go westup;go north;go north",
        "华山派-偏厅": "jh fam 3 start;go westup;go north;go north;go east",
        "华山派-寝室": "jh fam 3 start;go westup;go north;go north;go north",
        "华山派-玉女峰山路": "jh fam 3 start;go westup;go south",
        "华山派-玉女峰小径": "jh fam 3 start;go westup;go south;go southup",
        "华山派-思过崖": "jh fam 3 start;go westup;go south;go southup;go southup",
        "华山派-山洞": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter",
        "华山派-长空栈道": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter;go westup",
        "华山派-落雁峰": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter;go westup;go westup",
        "峨眉派-金顶": "jh fam 4 start",
        "峨眉派-庙门": "jh fam 4 start;go west",
        "峨眉派-广场": "jh fam 4 start;go west;go south",
        "峨眉派-走廊": "jh fam 4 start;go west;go south;go west",
        "峨眉派-休息室": "jh fam 4 start;go west;go south;go east;go south",
        "峨眉派-厨房": "jh fam 4 start;go west;go south;go east;go east",
        "峨眉派-练功房": "jh fam 4 start;go west;go south;go west;go west",
        "峨眉派-小屋": "jh fam 4 start;go west;go south;go west;go north;go north",
        "峨眉派-清修洞": "jh fam 4 start;go west;go south;go west;go south;go south",
        "峨眉派-大殿": "jh fam 4 start;go west;go south;go south",
        "峨眉派-睹光台": "jh fam 4 start;go northup",
        "峨眉派-华藏庵": "jh fam 4 start;go northup;go east",
        "逍遥派-青草坪": "jh fam 5 start",
        "逍遥派-林间小道": "jh fam 5 start;go east",
        "逍遥派-练功房": "jh fam 5 start;go east;go north",
        "逍遥派-木板路": "jh fam 5 start;go east;go south",
        "逍遥派-工匠屋": "jh fam 5 start;go east;go south;go south",
        "逍遥派-休息室": "jh fam 5 start;go west;go south",
        "逍遥派-木屋": "jh fam 5 start;go north;go north",
        "逍遥派-地下石室": "jh fam 5 start;go down;go down",
        "丐帮-树洞内部": "jh fam 6 start",
        "丐帮-树洞下": "jh fam 6 start;go down",
        "丐帮-暗道": "jh fam 6 start;go down;go east",
        "丐帮-破庙密室": "jh fam 6 start;go down;go east;go east;go east",
        "丐帮-土地庙": "jh fam 6 start;go down;go east;go east;go east;go up",
        "丐帮-林间小屋": "jh fam 6 start;go down;go east;go east;go east;go east;go east;go up",
        "襄阳城-广场": "jh fam 7 start",
        "武道塔": "jh fam 8 start"
    };
    var role;
    var family = null;
    var wudao_pfm = "1";
    //快捷键功能
    var KEY = {
        keys: [],
        roomItemSelectIndex: -1,
        init: function () {
            //添加快捷键说明
            $("span[command=stopstate] span:eq(0)").html("S");
            $("span[command=showcombat] span:eq(0)").html("A");
            $("span[command=showtool] span:eq(0)").html("C");
            $("span[command=pack] span:eq(0)").html("B");
            $("span[command=tasks] span:eq(0)").html("L");
            $("span[command=score] span:eq(0)").html("O");
            $("span[command=jh] span:eq(0)").html("J");
            $("span[command=skills] span:eq(0)").html("K");
            $("span[command=message] span:eq(0)").html("U");
            $("span[command=shop] span:eq(0)").html("P");
            $("span[command=stats] span:eq(0)").html("I");
            $("span[command=setting] span:eq(0)").html(",");

            $(document).on("keydown", this.e);

            this.add(27, function () { KEY.dialog_close(); });
            this.add(192, function () { $(".map-icon").click(); });
            this.add(32, function () { KEY.dialog_confirm(); });
            this.add(83, function () { KEY.do_command("stopstate"); });
            this.add(13, function () { KEY.do_command("showchat"); });
            this.add(65, function () { KEY.do_command("showcombat"); });
            this.add(67, function () { KEY.do_command("showtool"); });
            this.add(66, function () { KEY.do_command("pack"); });
            this.add(76, function () { KEY.do_command("tasks"); });
            this.add(79, function () { KEY.do_command("score"); });
            this.add(74, function () { KEY.do_command("jh"); });
            this.add(75, function () { KEY.do_command("skills"); });
            this.add(73, function () { KEY.do_command("stats"); });
            this.add(85, function () { KEY.do_command("message"); });
            this.add(80, function () { KEY.do_command("shop"); });
            this.add(188, function () { KEY.do_command("setting"); });

            this.add(81, function () { WG.sm_button(); });
            this.add(87, function () { WG.go_yamen_task(); });
            this.add(69, function () { WG.kill_all(); });
            this.add(82, function () { WG.get_all(); });
            this.add(84, function () { WG.sell_all(); });
            this.add(89, function () { WG.zdwk(); });

            this.add(9, function () { KEY.onRoomItemSelect(); return false; });

            //方向
            this.add(102, function () { WG.Send("go east"); KEY.onChangeRoom(); });
            this.add(39, function () { WG.Send("go east"); KEY.onChangeRoom(); });
            this.add(100, function () { WG.Send("go west"); KEY.onChangeRoom(); });
            this.add(37, function () { WG.Send("go west"); KEY.onChangeRoom(); });
            this.add(98, function () { WG.Send("go south"); KEY.onChangeRoom(); });
            this.add(40, function () { WG.Send("go south"); KEY.onChangeRoom(); });
            this.add(104, function () { WG.Send("go go north"); KEY.onChangeRoom(); });
            this.add(38, function () { WG.Send("go go north"); KEY.onChangeRoom(); });
            this.add(99, function () { WG.Send("go southeast"); KEY.onChangeRoom(); });
            this.add(97, function () { WG.Send("go southwest"); KEY.onChangeRoom(); });
            this.add(105, function () { WG.Send("go northeast"); KEY.onChangeRoom(); });
            this.add(103, function () { WG.Send("go northwest"); KEY.onChangeRoom(); });

            this.add(49, function () { KEY.combat_commands(0); });
            this.add(50, function () { KEY.combat_commands(1); });
            this.add(51, function () { KEY.combat_commands(2); });
            this.add(52, function () { KEY.combat_commands(3); });
            this.add(53, function () { KEY.combat_commands(4); });
            this.add(54, function () { KEY.combat_commands(5); });

            //alt
            this.add(49 + 512, function () { KEY.onRoomItemAction(0); });
            this.add(50 + 512, function () { KEY.onRoomItemAction(1); });
            this.add(51 + 512, function () { KEY.onRoomItemAction(2); });
            this.add(52 + 512, function () { KEY.onRoomItemAction(3); });
            this.add(53 + 512, function () { KEY.onRoomItemAction(4); });
            this.add(54 + 512, function () { KEY.onRoomItemAction(5); });
            //ctrl
            this.add(49 + 1024, function () { KEY.room_commands(0); });
            this.add(50 + 1024, function () { KEY.room_commands(1); });
            this.add(51 + 1024, function () { KEY.room_commands(2); });
            this.add(52 + 1024, function () { KEY.room_commands(3); });
            this.add(53 + 1024, function () { KEY.room_commands(4); });
            this.add(54 + 1024, function () { KEY.room_commands(5); });
        },
        add: function (k, c) {
            var tmp = {
                key: k,
                callback: c,
            };
            this.keys.push(tmp);
        },
        e: function (event) {
            if ($(".channel-box").is(":visible")) {
                KEY.chatModeKeyEvent(event);
                return;
            }

            if ($(".dialog-confirm").is(":visible")
                && ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
                return;

            var kk = (event.ctrlKey || event.metaKey ? 1024 : 0) + (event.altKey ? 512 : 0) + event.keyCode;
            for (var k of KEY.keys) {
                if (k.key == kk)
                    return k.callback();
            }
        },
        dialog_close: function () {
            $(".dialog-close").click();
        },
        dialog_confirm: function () {
            $(".dialog-btn.btn-ok").click();
        },
        do_command: function (name) {
            $("span[command=" + name + "]").click();
        },
        room_commands: function (index) {
            $("div.combat-panel div.room-commands span:eq(" + index + ")").click();
        },
        combat_commands: function (index) {
            $("div.combat-panel div.combat-commands span.pfm-item:eq(" + index + ")").click();
        },
        chatModeKeyEvent: function (event) {
            if (event.keyCode == 27) { KEY.dialog_close(); }
            else if (event.keyCode == 13) {
                if ($(".sender-box").val().length) $(".sender-btn").click();
                else KEY.dialog_close();
            }
        },
        onChangeRoom: function () {
            KEY.roomItemSelectIndex = -1;
        },
        onRoomItemSelect: function () {
            if (KEY.roomItemSelectIndex != -1) {
                $(".room_items div.room-item:eq(" + KEY.roomItemSelectIndex + ")").css("background", "#000");
            }
            KEY.roomItemSelectIndex = (KEY.roomItemSelectIndex + 1) % $(".room_items div.room-item").length;
            var curItem = $(".room_items div.room-item:eq(" + KEY.roomItemSelectIndex + ")");
            curItem.css("background", "#444");
            curItem.click();
        },
        onRoomItemAction: function (index) {
            //NPC下方按键
            $(".room_items .item-commands span:eq(" + index + ")").click();
        },
    }

    function messageClear() {
        $(".WG_log pre").html("");
    }
    var log_line = 0;
    function messageAppend(m) {
        100 < log_line && (log_line = 0, $(".WG_log pre").empty());
        $(".WG_log pre").append(m + "\n");
        log_line++;
        $(".WG_log")[0].scrollTop = 99999;
    }
    var sm_array = {
        '武当': { place: "武当派-三清殿", npc: "武当派第二代弟子 武当首侠 宋远桥" },
        '华山': { place: "华山派-客厅", npc: "华山派掌门 君子剑 岳不群" },
        '少林': { place: "少林派-天王殿", npc: "少林寺第三十九代弟子 道觉禅师" },
        '逍遥': { place: "逍遥派-青草坪", npc: "聪辩老人 苏星河" },
        '丐帮': { place: "丐帮-树洞下", npc: "丐帮七袋弟子 左全" },
        '峨眉': { place: "峨眉派-大殿", npc: "峨嵋派第四代弟子 静心" },
    };
    var WG = {
        sm_state: -1,
        sm_item: null,
        init: function () {
            $("li[command=SelectRole]").on("click", function () { WG.login(); });
        },
        login: function () {
            role = $('.role-list .select').text().split(/[\s\n]/).pop();
            $(".bottom-bar").append("<span class='item-commands' style='display:none'><span WG='WG' cmd=''></span></span>"); //命令行模块  
            var html = `
            <div class='WG_log'><pre></pre></div>
            <div>
                <span class='zdy-item sm_button'>师门(Q)</span>
                <span class='zdy-item go_yamen_task'>追捕(W)</span>
                <span class='zdy-item kill_all'>击杀(E))</span>
                <span class='zdy-item get_all'>拾取(R)</span>
                <span class='zdy-item sell_all'>清包(T)</span>
                <span class='zdy-item zdwk'>挖矿(Y)</span>
                </div>
            ` ;
            $(".content-message").after(html);
            var css = `.zdy-item{
                display: inline-block;border: solid 1px gray;color: gray;background-color: black;
                text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2.5em;margin-right: 0.4em;
                margin-left: 0.4em;position: relative;padding-left: 0.4em;padding-right: 0.4em;line-height: 2em;}
                .WG_log{flex: 1;overflow-y: auto;border: 1px solid #404000;max-height: 10em;width: calc(100% - 40px);}
                .WG_log > pre{margin: 0px; white-space: pre-line;}
                `;
            GM_addStyle(css);
            goods = GM_getValue("goods", goods);
            npcs = GM_getValue("npcs", npcs);
            equip = GM_getValue(role + "_equip", equip);
            family = GM_getValue(role + "_family", family);
            if (family == null) {
                family = $('.role-list .select').text().substr(0, 2);
            }
            wudao_pfm = GM_getValue(role + "_wudao_pfm", wudao_pfm);
            $(".sm_button").on("click", WG.sm_button);
            $(".go_yamen_task").on("click", WG.go_yamen_task);
            $(".kill_all").on("click", WG.kill_all);
            $(".get_all").on("click", WG.get_all);
            $(".sell_all").on("click", WG.sell_all);
            $(".zdwk").on("click", WG.zdwk);
            setTimeout(() => {
                var logintext = `
                <hiy>欢迎${role},插件已加载！
                插件版本: ${GM_info.script.version}        
                </hiy>`;
                messageAppend(logintext);
                KEY.do_command("showtool");
                KEY.do_command("showcombat");
            }, 1000);
        },
        updete_goods_id: function () {
            var lists = $(".dialog-list > .obj-list:first");
            var id;
            var name;
            if (lists.length) {
                messageAppend("检测到商品清单");
                for (var a of lists.children()) {
                    a = $(a);
                    id = a.attr("obj");
                    name = $(a.children()[0]).html();
                    goods[name].id = id;
                    messageAppend(name + ":" + id);
                }
                GM_setValue("goods", goods);
                return true;
            } else {
                messageAppend("未检测到商品清单");
                return false;
            }
        },
        updete_npc_id: function () {
            var lists = $(".room_items .room-item");

            for (var npc of lists) {
                if (npc.lastElementChild.lastElementChild == null) {
                    npcs[npc.lastElementChild.innerText] = $(npc).attr("itemid");
                    messageAppend(npc.lastElementChild.innerText + " 的ID:" + $(npc).attr("itemid"));
                }
            }
            GM_setValue("npcs", npcs);
        },
        updete_id_all: function () {
            var t = [];
            Object.keys(goods).forEach(function (key) {
                if (t[goods[key].place] == undefined)
                    t[goods[key].place] = goods[key].sales;
            });

            var keys = Object.keys(t);
            var i = 0;
            var state = 0;
            var place, sales;
            //获取
            var timer = setInterval(() => {
                switch (state) {
                    case 0:
                        if (i >= keys.length) {
                            messageAppend("初始化完成");
                            WG.go("武当派-广场");
                            clearInterval(timer);
                            return;
                        }
                        place = keys[i];
                        sales = t[place];
                        WG.go(place);
                        state = 1;
                        break;
                    case 1:
                        WG.updete_npc_id();
                        var id = npcs[sales];
                        WG.Send("list " + id);
                        state = 2;
                        break;
                    case 2:
                        if (WG.updete_goods_id()) {
                            state = 0;
                            i++;
                        }
                        else
                            state = 1;
                        break;
                }
            }, 1000);
        },
        Send: function (cmd) {
            cmd = cmd.split(";");
            for (var c of cmd) {
                $("span[WG='WG']").attr("cmd", c).click();
            };
        },
        go: function (p) {
            if (WG.at(p)) return;
            if (place[p] != undefined) WG.Send(place[p]);
        },
        at: function (p) {
            var w = $(".room-name").html();
            return w.indexOf(p) == -1 ? false : true;
        },
        sm: function () {
            switch (WG.sm_state) {
                case 0:
                    //前往师门接收任务
                    WG.go(sm_array[family].place);
                    WG.sm_state = 1;
                    setTimeout(WG.sm, 700);
                    break;
                case 1:
                    //接受任务
                    var lists = $(".room_items .room-item");
                    var id = null;
                    for (var npc of lists) {
                        if (npc.lastElementChild.lastElementChild == null) {
                            if (npc.lastElementChild.innerText == sm_array[family].npc)
                                id = $(npc).attr("itemid");
                        }
                    }
                    console.log(id);
                    if (id != undefined) {
                        WG.Send("task sm " + id);
                        WG.Send("task sm " + id);
                        WG.sm_state = 2;
                    }
                    else {
                        WG.updete_npc_id();
                    }
                    setTimeout(WG.sm, 300);
                    break;
                case 2:
                    //获取师门任务物品
                    var item = $("span[cmd$='giveup']:last").parent().prev();
                    if (item.length == 0) {
                        WG.sm_state = 0;
                        setTimeout(WG.sm, 1000);
                        return;
                    };
                    item = item.html();
                    //能上交直接上交
                    if ($("span[cmd$='giveup']:last").prev().children().html() == item) {
                        $("span[cmd$='giveup']:last").prev().click();
                        messageAppend("自动上交" + item);
                        WG.sm_state = 0;
                        setTimeout(WG.sm, 100);
                        return;
                    }
                    //不能上交自动购买
                    WG.sm_item = goods[item];
                    if (WG.sm_item != undefined) {
                        WG.go(WG.sm_item.place);
                        messageAppend("自动购买" + item);
                        WG.sm_state = 3;
                        setTimeout(WG.sm, 1000);
                    }
                    else {
                        messageAppend("无法购买" + item);
                        WG.sm_state = -1;
                        $(".sm_button").text("师门(Q)");
                    }
                    break;
                case 3:
                    WG.go(WG.sm_item.place);
                    if (WG.buy(WG.sm_item)) {
                        WG.sm_state = 0;
                    }
                    setTimeout(WG.sm, 1000);
                    break;
                default: break;
            }
        },
        sm_button: function () {
            if (WG.sm_state >= 0) {
                WG.sm_state = -1;
                $(".sm_button").text("师门(Q)");
            }
            else {
                WG.sm_state = 0;
                $(".sm_button").text("停止(Q)");
                setTimeout(WG.sm, 200);

            }
        },
        buy: function (good) {
            var tmp = npcs[good.sales];
            if (tmp == undefined) {
                WG.updete_npc_id();
                return false;
            }
            WG.Send("list " + tmp);
            WG.Send("buy 1 " + good.id + " from " + tmp);
            return true;
        },
        eq: function (e) {
            WG.Send("eq " + equip[e]);
        },
        ask: function (npc, i) {
            npc = npcs[npc];
            if (npc != undefined)
                WG.Send("ask" + i + " " + npc);
            else
                WG.updete_npc_id();
        },

        go_yamen_task: function () {
            WG.go("扬州城-衙门正厅");
            WG.ask("扬州知府 程药发", 1);

            window.setTimeout(WG.check_yamen_task, 1000);
        },
        check_yamen_task: function () {
            messageAppend("查找任务中");
            var task = $(".task-desc:last").text();
            if (task.length == 0) {
                KEY.do_command("tasks");
                window.setTimeout(WG.check_yamen_task, 1000);
                return;
            }
            try {
                zb_npc = task.match("犯：([^%]+)，据")[1];
                zb_place = task.match("在([^%]+)出")[1];
                messageAppend("追捕任务：" + zb_npc + "   地点：" + zb_place);
                KEY.do_command("score");
                WG.go(zb_place);
                window.setTimeout(WG.check_zb_npc, 1000);
            }
            catch (error) {
                messageAppend("查找衙门追捕失败");
                window.setTimeout(WG.check_yamen_task, 1000);
            }
        },
        check_zb_npc: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                if (npc.innerText.indexOf(zb_npc) != -1) {
                    WG.Send("kill " + $(npc).attr("itemid"));
                    messageAppend("找到" + zb_npc + "，自动击杀！！！");
                    return;
                }
            }
            window.setTimeout(WG.check_zb_npc, 1000);
        },

        kill_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                WG.Send("kill " + $(npc).attr("itemid"));
            }
        },

        get_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                WG.Send("get all from " + $(npc).attr("itemid"));
            }
        },

        sell_all: function () {
            WG.go("扬州城-打铁铺");
            WG.Send("sell all");
        },
        zdwk: function () {
            var t = $(".room_items .room-item:first .item-name").text();
            t = t.indexOf("<挖矿");

            if (t == -1) {
                messageAppend("当前不在挖矿状态");
                if (timer == 0) {
                    WG.go("扬州城-矿山");
                    WG.eq("铁镐");
                    WG.Send("wa");
                    timer = setInterval(WG.zdwk, 1000);
                }
            }
            else {
                WG.timer_close();
            }

            if (WG.at("扬州城-矿山") && t == -1) {
                //不能挖矿，自动买铁镐
                WG.go("扬州城-打铁铺");
                WG.buy(goods["铁镐"]);
                //买完等待下一次检查
                messageAppend("自动买铁镐");
                return;
            }
            if (WG.at("扬州城-打铁铺")) {
                var lists = $(".dialog-list > .obj-list:eq(1)");
                var id;
                var name;
                if (lists.length) {
                    messageAppend("查找铁镐ID");
                    for (var a of lists.children()) {
                        a = $(a);
                        id = a.attr("obj");
                        name = $(a.children()[0]).html();
                        if (name == "铁镐") {
                            equip["铁镐"] = id;

                            WG.eq("铁镐");

                        }
                    }
                    GM_setValue(role + "_equip", equip);
                    WG.go("扬州城-矿山");
                    WG.Send("wa");
                }
                return;
            }

        },
        timer_close: function () {
            if (timer) {
                clearInterval(timer);
                timer = 0;
            }
        },
        wudao_auto: function () {
            //创建定时器
            if (timer == 0) {
                timer = setInterval(WG.wudao_auto, 2000);
            }
            if (!WG.at("武道塔")) {
                //进入武道塔
                WG.go("武道塔");
                WG.ask("守门人", 1);
                WG.Send("go enter");
            }
            else {
                //武道塔内处理
                messageAppend("武道塔");
                var w = $(".room_items .room-item:last");
                var t = w.text();
                if (t.indexOf("守护者") != -1) {
                    WG.Send("kill " + w.attr("itemid"));
                    WG.wudao_autopfm();
                }
                else {
                    WG.Send("go up");
                }
            }
        },
        wudao_autopfm: function () {
            var pfm = wudao_pfm.split(',');
            for (var p of pfm) {
                if ($("div.combat-panel div.combat-commands span.pfm-item:eq(" + p + ") span").css("left") == "0px")
                    $("div.combat-panel div.combat-commands span.pfm-item:eq(" + p + ") ").click();
            }

        },
        xue_auto: function () {
            var t = $(".room_items .room-item:first .item-name").text();
            t = t.indexOf("<打坐") != -1 || t.indexOf("<学习") != -1 || t.indexOf("<练习") != -1;
            //创建定时器
            if (timer == 0) {
                if (t == false) {
                    messageAppend("当前不在打坐或学技能");
                    return;
                }
                timer = setInterval(WG.xue_auto, 1000);
            }
            if (t == false) {
                //学习状态中止，自动去挖矿
                WG.timer_close();
                WG.zdwk();
            }
            else {
                messageAppend("自动打坐学技能");
            }

        },
        setting: function () {
            var a = `
            <span>门派选择： <select id="family">
                <option value="武当">武当</option>
                <option value="华山">华山</option>
                <option value="少林">少林</option>
                <option value="峨眉">峨眉</option>
                <option value="逍遥">逍遥</option>
                <option value="丐帮">丐帮</option>
            </select></span>
            <span>武道自动攻击： <input type="text" id="wudao_pfm" name="wudao_pfm" value=""></span>
            <div class="item-commands"><span class="updete_id_all">初始化ID</span></div>
            `;
            messageAppend(a);
            $('#family').val(family);
            $("#family").change(function () {
                family = $("#family").val();
                GM_setValue(role + "_family", family);
            });
            $('#wudao_pfm').val(wudao_pfm);
            $('#wudao_pfm').focusout(function () {
                wudao_pfm = $('#wudao_pfm').val();
                GM_setValue(role + "_wudao_pfm", wudao_pfm);
            });
            $(".updete_id_all").on("click", WG.updete_id_all);
        },
        hooks : [],
        hook_index : 0,
        add_hook : function(type, fn){
            var hook = {
                'index' : WG.hook_index++,
                'type' : type,
                'fn' : fn
            };
            WG.hooks.push(hook);
            return hook.id;
        },
        remove_hook : function(hook_index){
            var index;
            for(var i = 0; i < hooks.length; i++){
                if(hooks[i].index == hook_index){
                    index = i;
                    break;
                }
            }
            if(index !== undefined){
                delete hooks[index];
            }
        },
        run_hook : function(type, data){
            for(var i = 0; i < this.hooks.length; i++){
                if(this.hooks[i] !== undefined && this.hooks[i].type == type){
                    this.hooks[i].fn(data);
                }
            }
        },
        receive_message : function(msg){
            ws_on_message.apply(this, arguments);
            if (!msg || !msg.data) return;
            var data;
            if (msg.data[0] == '{' || msg.data[0] == '[') {
                var func = new Function("return " + msg.data + ";");
                data = func();
            } else {
                data = {type : 'text', msg : msg.data};
            }
            WG.run_hook(data.type, data);
        },
    };

    unsafeWindow.WebSocket = function(uri) {
        ws = new _ws(uri);
    };
    unsafeWindow.WebSocket.prototype = {
        CONNECTING: _ws.CONNECTING,
        OPEN: _ws.OPEN,
        CLOSING: _ws.CLOSING,
        CLOSED: _ws.CLOSED,
        get url() {
            return ws.url;
        },
        get protocol() {
            return ws.protocol;
        },
        get readyState() {
            return ws.readyState;
        },
        get bufferedAmount() {
            return ws.bufferedAmount;
        },
        get extensions() {
            return ws.extensions;
        },
        get binaryType() {
            return ws.binaryType;
        },
        set binaryType(t) {
            ws.binaryType = t;
        },
        get onopen() {
            return ws.onopen;
        },
        set onopen(fn) {
            ws.onopen = fn;
        },
        get onmessage() {
            return ws.onmessage;
        },
        set onmessage(fn) {
            ws_on_message = fn;
            ws.onmessage = WG.receive_message;
        },
        get onclose() {
            return ws.onclose;
        },
        set onclose(fn) {
            ws.onclose = fn;
        },
        get onerror() {
            return ws.onerror;
        },
        set onerror(fn) {
            ws.onerror = fn;
        },
        send: function(text) {
            console.log('send:' + text);
            ws.send(text);
        },
        close: function() {
            ws.close();
        }
    };
    $(document).ready(function(){
        KEY.init();
        WG.init();
        
        WG.add_hook("state", function(data){
            console.dir(data);
        });
        $('head').append('<link href="https://cdn.bootcss.com/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.css" rel="stylesheet">');
        $.contextMenu({
            selector: '.content-message',
            callback: function (key, options) {
                console.log("点击了：" + key);
            },
            items: {
                "关闭自动": {
                    name: "关闭自动", visible: function (key, opt) { return timer != 0; },
                    callback: function (key, opt) { WG.timer_close(); },
                },
                "自动": {
                    name: "自动", visible: function (key, opt) { return timer == 0; },
                    "items": {
                        "自动打坐学习": { name: "自动打坐学习", callback: function (key, opt) { WG.xue_auto(); }, },
                        "自动武道": { name: "自动武道", callback: function (key, opt) { WG.wudao_auto(); }, },
                    },
                },
                "门派传送": {
                    name: "门派传送",
                    "items": {
                        "mp0": { name: "豪宅", callback: function (key, opt) { WG.go("住房"); }, },
                        "mp1": { name: "武当", callback: function (key, opt) { WG.go("武当派-广场"); }, },
                        "mp2": { name: "少林", callback: function (key, opt) { WG.go("少林派-广场"); }, },
                        "mp3": { name: "华山", callback: function (key, opt) { WG.go("华山派-镇岳宫"); }, },
                        "mp4": { name: "峨眉", callback: function (key, opt) { WG.go("峨眉派-金顶"); }, },
                        "mp5": { name: "逍遥", callback: function (key, opt) { WG.go("逍遥派-青草坪"); }, },
                        "mp6": { name: "丐帮", callback: function (key, opt) { WG.go("丐帮-树洞内部"); }, },
                        "mp7": { name: "襄阳", callback: function (key, opt) { WG.go("襄阳城-广场"); }, },
                        "mp8": { name: "武道", callback: function (key, opt) { WG.go("武道塔"); }, },
                    },
                },
                "更新ID": { name: "更新ID", callback: function (key, opt) { WG.updete_goods_id(); WG.updete_npc_id(); }, },
                "设置": { name: "设置", callback: function (key, opt) { WG.setting(); }, }
            }
        });
    });
    

})();