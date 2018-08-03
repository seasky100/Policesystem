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
    /// map 的摘要说明
    /// </summary>
    public class map : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string search = context.Request.Form["search"];
            string type = context.Request.Form["type"];
            string status = context.Request.Form["status"];
            string searchcondition = "";

            StringBuilder sqltext = new StringBuilder();
            searchcondition = (search == "") ? " and  IsOnline<>'' " : " and IsOnline<>''  and(de.[DevId] like '%" + search + "%' or de.PlateNumber like '%" + search + "%' or de.Contacts like  '%" + search + "%')";
            #region 选中设备类型为人员
            if (type == "0") //人员
            {
                if (ssdd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("SELECT g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMJC  is NOT NULL");
                    }
                    else
                    {
                        sqltext.Append("SELECT  g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE   g.IsOnline = " + status + " and e.BMJC is NOT NULL");

                    }
                    searchcondition = (search == "") ? " " : "  and(u.[JYBH] like '%" + search + "%' or u.XM like '%" + search + "%')";

                    goto end;
                }

                if (sszd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMDM in (SELECT BMDM from childtable) and e.BMJC  is NOT NULL");
                    }
                    else
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT  g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMDM in (SELECT BMDM from childtable) and  g.IsOnline = " + status + " and e.BMJC is NOT NULL");

                    }
                    searchcondition = (search == "") ? " " : "  and(u.[JYBH] like '%" + search + "%' or u.XM like '%" + search + "%')";

                    goto end;
                }
              
               if (status == "all")
                 {
                     sqltext.Append("SELECT g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE  e.BMDM ='" + sszd + "'  and e.BMJC  is NOT NULL");
                  }
                else
                {
                    sqltext.Append("SELECT  g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMDM ='"+sszd+"' and  g.IsOnline = " + status + " and e.BMJC is NOT NULL");

                }
                searchcondition = (search == "") ? " " : "  and(u.[JYBH] like '%" + search + "%' or u.XM like '%" + search + "%')";

                goto end;


            }
            #endregion
            #region 选中设备类型为除人员以外的其它，对讲机、执法记录仪、警务通等8小件
            else
            {
                if (ssdd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("SELECT g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMJC  is NOT NULL ");
                    }
                    else
                    {
                        sqltext.Append("SELECT  g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE   g.IsOnline = " + status + " and e.BMJC is NOT NULL");

                    }
                    searchcondition = (search == "") ? " " : "  and(d.DevId like '%" + search + "%' or u.XM like '%" + search + "%')";

                    goto end;
                }

                if (sszd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMDM in (SELECT BMDM from childtable) and e.BMJC  is NOT NULL ");
                    }
                    else
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT  g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMDM in (SELECT BMDM from childtable) and  g.IsOnline = " + status + " and e.BMJC is NOT NULL ");

                    }
                    searchcondition = (search == "") ? " " : "  and(d.DevId like '%" + search + "%' or u.XM like '%" + search + "%')";

                    goto end;
                }

                if (status == "all")
                {
                    sqltext.Append("SELECT g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE  e.BMDM ='" + sszd + "'  and e.BMJC  is NOT NULL");
                }
                else
                {
                    sqltext.Append("SELECT  g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMDM ='" + sszd + "' and  g.IsOnline = " + status + " and e.BMJC is NOT NULL ");

                }
                searchcondition = (search == "") ? " " : "  and(d.DevId like '%" + search + "%' or u.XM like '%" + search + "%')";

          
            }
        #endregion

        end:
            sqltext.Append(searchcondition + " ORDER BY u.JYBH");

            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToJson(dt, ""));
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