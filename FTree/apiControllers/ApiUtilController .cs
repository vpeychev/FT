using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FT.UI.apiControllers
{
    public class ApiUtilController : ApiController
    {
        #region Upload/Download
        
        //[Route(Name="api/UploadFromExcel")]
        [HttpPost]
        //[Route("")]
        public System.Web.Mvc.JsonResult UploadFromExcel(string id)
        {
            System.Web.Mvc.JsonResult result = new System.Web.Mvc.JsonResult();
            result.Data = "Data imported successfully.";

            return result;

            //return Json("Data imported successfully.");
            //return null;
        }

        #endregion                          //Upload/Download

        #region Family

        [HttpPost]
        [Route("api/GetData")]
        public HttpResponseMessage GetData()
        {
            object result = new { PersonData = Core.Context.Instance.PersonData, Family = Core.Context.Instance.FamilyData };
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        #endregion                          //Family

    }
}