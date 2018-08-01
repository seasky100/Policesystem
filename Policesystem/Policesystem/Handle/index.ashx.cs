﻿using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// index 的摘要说明
    /// </summary>
    public class index : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
            //
            sqltext.Append("SELECT  a.DevType,[Time],COUNT(a.id) as 设备数量,COUNT(u.id) as 人数,SUM(GFSCL) as 规范上传率,SUM(OnlineTime) as 在线总时长,SUM(HandleCnt) as 处理量,SUM(CXCNT) AS 查询量, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) 在线数 FROM [dbo].[StatsInfo_Yestorday_Today] a left JOIN Device d  on d.DevId = a.DevId   left JOIN ACL_USER  u  on u.JYBH = d.JYBH  where a.DevType in (2,4,5) GROUP BY a.DevType,TIME ORDER BY a.DevType, [Time]");

            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToDatatableJS(dt, ""));
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}