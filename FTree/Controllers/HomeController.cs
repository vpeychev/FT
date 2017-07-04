using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

using FT.Core.Operations;
using FT.Infrastructure.Settings;

namespace FT.UI.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            return View();
        }

        //TODO: Cretae API controller and move ajax calls there
        #region Upload

        //TODO: move it to ApiCOntroller
        public JsonResult UploadEromExcel(string id)
        {
            //allow multiple files import
            foreach (string fileName in Request.Files)
            {
                var fileContent = Request.Files[fileName];
                if (fileContent != null && fileContent.ContentLength > 0)
                {
                    string savedFileName = this.SaveFile(fileContent, Path.Combine(ConfSettings.ApplicationPath, ConfSettings.FolderUtil, ConfSettings.FolderUpload));

                    //process file import
                    UploadFile fu = new UploadFile();
                    bool done = fu.Run(savedFileName);

                    if (done)
                    {   //import is SUCCESSFUL
                        return Json("success");
                    }
                    else
                    {   //bad request
                        Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return Json("fail");
                    }
                }
            }
            return Json("fail");
        }

        private string SaveFile(HttpPostedFileBase file, string folder, string fileTemplateName = "FamilyData")
        {
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
            string fileName = Path.Combine(folder, CreateFileName(Path.GetFileNameWithoutExtension(file.FileName), fileTemplateName));
            file.SaveAs(fileName);
            return fileName;
        }
        private string CreateFileName(string fileName, string fileTemplateName)
        {
            return string.Format("{0} ({1:yyyyMMdd hh-mm-ss-fff}).xlsx", fileName, DateTime.Now);
        }

        #endregion                          //Upload

    }
}
