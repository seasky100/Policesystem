﻿$(document).on('change.bs.carousel.data-api', '#cloum2select,#cloum3select,#cloum5select', function (e) {
    switchDevtype(e.target.value,this)

});
$.ajax({
    type: "POST",
    url: "../Handle/indexconfig.ashx",
    data: "",
    dataType: "json",
    success: function (data) {
  
        if (data.data.length == 4) {
            return;
            $("#cloum2select").val(data.data[0].DevType);
            $("#cloum3select").val(data.data[1].DevType);
            $("#cloum4select").val(data.data[2].DevType);
            $("#cloum5select").val(data.data[3].DevType);

            switchDevtype(data.data[0].DevType, $("#cloum2select"));
            switchDevtype(data.data[1].DevType, $("#cloum3select"));
            switchDevtype(data.data[2].DevType, $("#cloum5select"));

            setToggleVal(data.data[0].val, $(".cloum2"));
            setToggleVal(data.data[1].val, $(".cloum3"));
            setToggleVal(data.data[2].val, $(".cloum5"));
        }

    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});
function switchDevtype(typeid,$ele) {
    switch (typeid) {
        case "1":
        case "2":
        case "3":
            $($ele).parent().parent().find('.device_vale_type').each(function (index, ele) {
                $(this).children().each(function (i,e) {
                    switch (i,e) {
                        case 0:
                        case 1:
                            $(this).removeClass("none");
                            break;
                        default:
                            $(this).addClass("none");
                            break;
                    }

                })
                
            });
            break;
        case "4":
        case "6":
            $($ele).parent().parent().find('.device_vale_type').each(function (index, ele) {
                $(this).children().each(function (i,e) {
                    switch (i) {
                        case 0:
                        case 1:
                        case 2:
                            $(this).removeClass("none");
                            break;
                        default:
                            $(this).addClass("none");
                            break;
                    }
                });
               
            });
            break;
        case "5":
            $($ele).parent().parent().find('.device_vale_type').each(function (index, ele) {
                $(this).children().each(function (i, e) {
                    switch (i) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 6:
                        case 7:
                        case 8:
                            $(this).removeClass("none");
                            break;
                        default:
                            $(this).addClass("none");
                            break;
                    }
                });
               
            });
            break;

    }
}
function setToggleVal(vals,ele) {
    var arr = vals.split(",");
    $(ele).find("i").each(function (index, el) {
        if (arr[index] == "0") {
            $(this).removeClass("fa-toggle-off").removeClass("fa-toggle-on").addClass("fa-toggle-off");
        }
        else
        {
            $(this).removeClass("fa-toggle-off").removeClass("fa-toggle-on").addClass("fa-toggle-on");
        }

     });

}
$(document).on('click.bs.carousel.data-api', '.fa-toggle-off,.fa-toggle-on', function (e) {
    var tableclss = $(this).parent().parent().parent().parent().parent().attr("class");
    $(".row1 span").addClass("none");
    $(".row2 span").addClass("none");
    if ($(this).hasClass("fa-toggle-off")) {
        switch (tableclss) {
            case "cloum2":
                if ($(this).parent().parent().parent().find("li:visible .fa-toggle-on").length >= 2) {
                    $(".cloum2 span").removeClass("none");
                    return;
                }
                break;
            case "cloum3":
                if ($(this).parent().parent().parent().find("li:visible .fa-toggle-on").length >= 3) {
                    $(".cloum3 span").removeClass("none");
                    return;
                }
                break;
            case "cloum5":
                if ($(this).parent().parent().parent().find("li:visible .fa-toggle-on").length >= 5) {
                    $(".cloum5 span").removeClass("none");
                    return;
                }
                break;
        }
        $(this).removeClass("fa-toggle-off").addClass("fa-toggle-on");
    }
    else
    {
        $(this).removeClass("fa-toggle-on").addClass("fa-toggle-off");
    }
});

$(document).on('click.bs.carousel.data-api', '#savebtn', function (e) {
    $('.progresshz').show();
    var val1="";
    $(".cloum2 i").each(function (index, ele) {
        val1 += (index > 0) ? "," : "";
        val1 += ($(this).hasClass("fa-toggle-off")) ? "0" : "1";
    });
    var val2 = "";
    $(".cloum3 i").each(function (index, ele) {
        val2 += (index > 0) ? "," : "";
        val2 += ($(this).hasClass("fa-toggle-off")) ? "0" : "1";
    });
    var val3 = "";
    $(".cloum5 i").each(function (index, ele) {
        val3 += (index > 0) ? "," : "";
        val3 += ($(this).hasClass("fa-toggle-off")) ? "0" : "1";
    });
    var data =
    {
    Row1: $("#cloum2select").val(),
    val1: val1,
    Row2: $("#cloum3select").val(),
    val2: val2,
    Row3: $("#cloum5select").val(),
    val3: val3
    }
    $.ajax({
        type: "POST",
        url: "../Handle/saveindexconfig.ashx",
        data: data,
        dataType: "json",
        success: function (data) {
            $('.progresshz').hide();
            $('.buttonrow div:eq(1)').text("保存成功");
            clearInterval(clinter);
            clinter = setInterval(clearintet, 10000);//10秒清除保存
        },
        error: function (msg) {
            $('.buttonrow div:eq(1)').text("保存失败");
            clearInterval(clinter);
            clinter = setInterval(clearintet, 10000);//10秒清除保存
            console.debug("错误:ajax");
        }
    });
});
var clinter = setInterval(clearintet, 5000);//10秒清除保存
function clearintet() {
     $('.buttonrow div:eq(1)').text("");
}