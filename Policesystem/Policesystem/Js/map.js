﻿var entitydata;
var selectdevid;
var loadmapdataInter;
var typename = ["车载视频", "对讲机", "拦截仪", "警务通", "执法记录仪", "辅警通", "测速仪", "酒精测试仪"]
$("#header").load('top.html', function () {

});
$('.start_form_datetime').datetimepicker({
    format: 'yyyy/mm/dd',
    autoclose: true,
    todayBtn: true,
    minView: 2
});

function startdatetimedefalute() {
    var curDate = new Date();
    var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
    // var beforepreDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
    $('.start_form_datetime').val(transferDate(preDate));
}
startdatetimedefalute();

function transferDate(date) {
    // 年  
    var year = date.getFullYear();
    // 月  
    var month = date.getMonth() + 1;
    // 日  
    var day = date.getDate();

    if (month >= 1 && month <= 9) {

        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {

        day = "0" + day;
    }

    var dateString = year + '/' + month + '/' + day;

    return dateString;
}


$(document).on('click.bs.carousel.data-api', '.boxleft > .row li > div', function (e) {
    $('.leftactive').removeClass();
    $(this).addClass('leftactive');
    switch (e.target.id) {
        case "ry": //人员
            $("#deviceselect").val("0");
            $(".seach-box input").attr('placeholder', '请输入姓名或警员编号');
            break;
        case "czsp": //车载视频
            $("#deviceselect").val("1");
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            break;
        case "zfjly": //执法记录仪
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("5");
            break;
        case "fjt": //辅警通
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("6");
            break;
        case "jwt": //警务通
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("4");
            break;
        case "ljy": //拦截仪
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("3");
            break;
        case "djj": //对讲机
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("2");
            break;
        default:
            break;

    }
});

$.ajax({
    type: "POST",
    url: "../Handle/GetEntitys.ashx",
    data: "",
    dataType: "json",
    success: function (data) {

        entitydata = data.data; //保存单位数据
        for (var i = 0; i < entitydata.length; i++) {

            if (entitydata[i].SJBM == "331000000000") {
                $("#brigadeselect").append("<option value='" + entitydata[i].BMDM + "'>" + entitydata[i].BMJC + "</option>");
            }
        }
    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});

$(document).on('change.bs.carousel.data-api', '#deviceselect', function (e) {
    $(".leftactive").removeClass("leftactive");
    switch (e.target.value) {
        case "0":
            $("#ry").addClass("leftactive");
            break;
        case "1":
            $("#czsp").addClass("leftactive");
            break;
        case "2":
            $("#djj").addClass("leftactive");
            break;
        case "3":
            $("#ljy").addClass("leftactive");
            break;
        case "4":
            $("#jwt").addClass("leftactive");
            break;
        case "5":
            $("#zfjly").addClass("leftactive");
            break;
        case "6":
            $("#fjt").addClass("leftactive");
            break;
    }
});

//更换大队选择
$(document).on('change.bs.carousel.data-api', '#brigadeselect', function (e) {
    //所属中队逻辑
    $("#squadronselect").empty();
    $("#squadronselect").append("<option value='all'>全部</option>");
    $("#squadronselect").removeAttr("disabled");
    if (e.target.value == "all") {
        $("#squadronselect").attr("disabled", "disabled");
        return;
    }
    for (var i = 0; i < entitydata.length; i++) {
        if (entitydata[i].SJBM == e.target.value) {
            $("#squadronselect").append("<option value='" + entitydata[i].BMDM + "'>" + entitydata[i].BMJC + "</option>");
        }
    }
});
$(document).on('click.bs.carousel.data-api', '#cz-ck,.input-group-btn .btn-default', function (e) {
    if (loadmapdataInter) { clearInterval(loadmapdataInter) };
    loaddata();//加载左侧数据
    loadmarks();//加载地图数据
    loadmapdataInter = setInterval("loadmarks()", 15000);
    $(".fa-square").addClass("fa-square-o").removeClass("fa-square");
    $("#cz-bianji").attr("disabled", true);

})
$(document).on('click.bs.carousel.data-api', '#cz-bianji,.fa-close', function (e) {
    if ($("#histrorysearch").css("visibility") != "hidden") {
        $("#histrorysearch").css("visibility", "hidden");
        tracevector.getSource().clear();
        tracepointlayer.getSource().clear();
        vectorLayer.setVisible(true);
        vectorLayerjwt.setVisible(true);
        vectorLayerdjj.setVisible(true);
        loadmapdataInter = setInterval("loadmarks()", 15000);
        return;
    } else {
        if ($(".fa-square").length==0) {
            return;
        };
        vectorLayer.setVisible(false);
        vectorLayerjwt.setVisible(false);
        vectorLayerdjj.setVisible(false);
        if (loadmapdataInter) { clearInterval(loadmapdataInter) };
        $("#histrorysearch").css("visibility", "visible");
        requestJY();
    }
});



function requestJY() {
    var data = {
        sbbh: $(".fa-square").parent().parent().attr("bh"),
        jybh: $(".fa-square").parent().parent().attr("jy"),
        requesttype: "查询人员"
    }
    $.ajax({
        type: "POST",
        url: "../Handle/map.ashx",
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.r == "0") {
                $("#histrorysearch .row:eq(1) div:eq(1)").text("");
                $("#histrorysearch .row:eq(2) div:eq(1) ul").html("");
                $("#histrorysearch .bh").val("");
                $("#histrorysearch .leixing").val("");
                var name = "";
                var bh = "";
                var leixing = "";
                $.each(data.result, function (i, item) {
                    name += (name.indexOf(item.XM) < 0) ? " " + item.XM : "";
                    $("#histrorysearch .row:eq(2) div:eq(1) ul").append("<li><div class='device" + item.DevType + "' title='" + typename[item.DevType-1] + "' ></div></li>");
                    bh += (i == 0) ? item.Devid : "," + item.Devid;
                    leixing += (i == 0) ? item.DevType : "," + item.DevType;
                    console.debug(bh);
                });
                $("#histrorysearch .row:eq(1) div:eq(1)").text(name);
                $("#histrorysearch .bh").val(bh);
                $("#histrorysearch .leixing").val(leixing);
            }
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
}


function loaddata() {

    var data =
     {
         search: $(".seach-box input").val(),
         type: $("#deviceselect").val(),
         ssdd: $("#brigadeselect").val(),
         sszd: $("#squadronselect").val(),
         status: $("#sbstate").val(),
         requesttype:"设备搜索"
     }
    $.ajax({
        type: "POST",
        url: "../Handle/map.ashx",
        data: data,
        dataType: "json",
        success: function (data) {
            $(".table tbody").empty();
            $(".equipmentNumb").html("");
            if (data.r == "0") {
                createtable(data.result);
            }
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

}
$(document).on('click.bs.carousel.data-api', '#cz-cx', function (e) {
    var data = {
        deviid: $("#histrorysearch .bh").val(),
        requesttype: "轨迹查询",
        date: $(".start_form_datetime").val(),
        detype: $("#histrorysearch .leixing").val()
    }
    $.ajax({
        type: "POST",
        url: "../Handle/map.ashx",
        data: data,
        dataType: "json",
        success: function (data) {
            createTrace(data);
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

});


$(document).on('click.bs.carousel.data-api', '.table .fa-square-o,.table .fa-square', function (e) {
    if (e.target.className.indexOf("fa-square-o") > 0) {
        $(".fa-square").addClass("fa-square-o").removeClass("fa-square");
        $(e.target).removeClass("fa-square-o");
        $(e.target).addClass("fa-square");
        $("#cz-bianji").attr("disabled", false);
       
        requestJY();
    }
    else {
        $(e.target).removeClass("fa-square");
        $(e.target).addClass("fa-square-o");
        $("#cz-bianji").attr("disabled", true);
    }
});

$(document).on('click.bs.carousel.data-api', '.table .fa-map-marker', function (e) {
    var devid;
    var detype;
    var feature;
    if (e.target.nodeName == "I") { devid = $(e.target).attr("bh"); detype = $(e.target).attr("Dt"); }
    else {
        devid = $(e.target).children().attr("bh");
        detype = $(e.target).children().attr("Dt");
    }
    if (devid == "" || devid == undefined) { return; }
    //  $(".zq1").hide();
    //  $(".table .localtd").removeClass("localtd"); //移出定位
    selectdevid = devid;
    switch (detype) {
        case "1":
            feature = vectorLayer.getSource().getFeatureById(devid);
            break;
        case "4":
            feature = vectorLayerjwt.getSource().getFeatureById(devid);
            break;
        case "2":
            feature = vectorLayerdjj.getSource().getFeatureById(devid);
            break;
    }

    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        point_overlay.setPosition(coordinates);
        var view = map.getView();
        view.animate({ zoom: view.getZoom() }, { center: coordinates }, function () {
            // localFeatureInfo();
            setTimeout(function () { point_overlay.setPosition([0, 0]) }, 30000)
        });

        return;
    }
})

$(document).on('mouseover.bs.carousel.data-api', '.table tbody i', function (e) {
    $(".fa-map-marker-color-mouseover").removeClass("fa-map-marker-color-mouseover");
    $(e.target).parent().find("i").addClass("fa-map-marker-color-mouseover");
});
$(".table tbody").on("mouseout", function (e) {
    $(".fa-map-marker-color-mouseover").removeClass("fa-map-marker-color-mouseover");
});


function createtable(data) {
    var $doc = $(".table tbody");
    var total = data.length;
    var zx = 0;
    var sc = 0;
    var lx = 0;
    var coumm1 = "";
    var coumm2 = "";
    var type = $("#deviceselect").val();
    var labeltext = "记录条数";
    $(".table thead tr,.table tbody").empty();
    switch (type) {
        case "0":    //人员
            $(".table thead tr").append("<th style='width:46px;'></th><th style='width:113px;'>所属单位</th><th style='width:113px;'>联系人</th><th style='width:80px;'>在线时长</th><th></th>")
            coumm2 = "data[i].XM";
            break;
        case "1": //车载视频
        case "2": //对讲机
        case "3": //拦截仪
        case "4": //警务通
        case "5": //执法记录仪
        case "6": //辅警通  
        case "7": //测速仪
        case "8": //酒精测试仪
            $(".table thead tr").append("<th style='width:46px;'></th><th style='width:113px;'>所属单位</th><th style='width:113px;'>设备编号</th><th style='width:80px;'>在线时长</th><th></th>")
            coumm2 = "data[i].DevId";
            break;
        default:
            break;

    }

    for (var i = 0; i < data.length; ++i) {

        switch (data[i].IsOnline) {
            case "1":
                $doc.append(" <tr bh='" + data[i].DevId + "' jy='" + data[i].JYBH + "'><td ><i class='fa fa-square-o'></i></td><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + data[i].BMJC + "</span></td><td style='text-align:center;width:113px;'><span>" + eval(coumm2) + "</span></td><td style='text-align:center;width:80px;'><span>" + formatSeconds(data[i].OnlineTime, 1) + "</span></td><td><i class='fa fa-map-marker fa-2x fa-map-marker-color-online' aria-hidden='true'  bh='" + data[i].DevId + "' Dt='" + data[i].DevType + "'></i></td></tr>");
                sc +=(data[i].OnlineTime!="")? parseInt(data[i].OnlineTime):0;
                zx += 1;
                break;
            case "0":
                $doc.append(" <tr bh='" + data[i].DevId + "' jy='" + data[i].JYBH + "'><td ><i class='fa fa-square-o'></i></td><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + data[i].BMJC + "</span></td><td style='text-align:center;width:113px;'><span>" + eval(coumm2) + "</span></td><td style='text-align:center;width:80px;'><span>" + formatSeconds(data[i].OnlineTime, 1) + "</span></td><td><i class='fa fa-map-marker fa-2x fa-map-marker-color-unline' aria-hidden='true'  bh='" + data[i].DevId + "'  Dt='" + data[i].DevType + "'></i></td></tr>");
                sc +=(data[i].OnlineTime!="")? parseInt(data[i].OnlineTime):0;
                lx +=1
                break;
            case "":
                $doc.append(" <tr bh='" + data[i].DevId + "' jy='" + data[i].JYBH + "'><td ><i class='fa fa-square-o'></i></td><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + data[i].BMJC + "</span></td><td style='text-align:center;width:113px;'><span>" + eval(coumm2) + "</span></td><td style='text-align:center;width:80px;'><span>" + formatSeconds(data[i].OnlineTime, 1) + "</span></td><td></td></tr>");
                sc += (data[i].OnlineTime != "") ? parseInt(data[i].OnlineTime) : 0;
                break;
            default:
                $doc.append(" <tr bh='" + data[i].DevId + "' jy='" + data[i].JYBH + "'><td ><i class='fa fa-square-o'></i></td><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + data[i].BMJC + "</span></td><td style='text-align:center;width:113px;'><span>" + eval(coumm2) + "</span></td><td style='text-align:center;width:80px;'><span>" + formatSeconds(data[i].OnlineTime, 1) + "</span></td><td></td></tr>");
                sc += (data[i].OnlineTime != "") ? parseInt(data[i].OnlineTime) : 0;

                break;
        }
    }
  
    $(".equipmentNumb").html("<label>" + labeltext + ":<span>" + total + "</span></label>总在线时长:<span>" + formatSeconds(sc,1) + "(h)</span><label>在线数:<span>" + zx + "</span></label><label>离线数:<span>" + lx + "</span></label>")

}

function formatSeconds(value, y) {
    var result = Math.floor((value / 60 / 60) * Math.pow(10, y)) / Math.pow(10, y);
    return result;
}


