using System.Web;
using System.Web.Optimization;

namespace FT.UI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            BundleCss(bundles);
            BundleFW(bundles);
     
            BundleApp(bundles);

#if DEBUG
            BundleTable.EnableOptimizations = false;
#else
            BundleTable.EnableOptimizations = true;
#endif

        }

        #region Bundle application

        private static void BundleApp(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/app")
                .Include(
                    "~/Scripts/app.js",
                    "~/Scripts/constants.js",
                    "~/Scripts/directives/ModalDialog.Component.js"
                )
            );
            bundles.Add(new ScriptBundle("~/bundles/home")
                .Include(
                    "~/Scripts/home/homeController.js",
                    "~/Scripts/home/homeService.js",
                    "~/Scripts/directives/Comments.Directive.js",
                    "~/Scripts/directives/SpecialDate.Directive.js",
                    "~/Scripts/directives/LabelValueInput.Directive.js",
                    "~/Scripts/directives/Person/Common.Directive.js",
                    "~/Scripts/directives/Person/Contacts.Directive.js",
                    "~/Scripts/directives/Person/Education.Directive.js",
                    "~/Scripts/directives/Person/Events.Directive.js",
                    "~/Scripts/directives/Person/Galleries.Directive.js",
                    "~/Scripts/directives/Person/Professions.Directive.js",
                    "~/Scripts/directives/Person/Relationships.Directive.js",
                    "~/Scripts/directives/Person/WorkHistory.Directive.js"
                )
            );
            bundles.Add(new ScriptBundle("~/bundles/nav")
                .Include(
                    "~/Scripts/navigation/NavigationController.js",
                    "~/Scripts/directives/FileUpload.Directive.js"
                )
            );
        }

        #endregion                          //Bundle application

        #region Bundle Angualrjs and 3rd parthy components

        private static void BundleCss(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css")
                .Include(
                    "~/Content/font-awesome-4.7.0/css/font-awesome.min.css",
                    "~/Content/bootstrap.css",
                    "~/Content/site.css"
                    )
                );
        }

        private static void BundleFW(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/angular")
                .Include(
#if DEBUG
                    "~/Scripts/angular-1.6.4/angular.js"
                    , "~/Scripts/angular-1.6.4/angular-animate.js"
                    , "~/Scripts/angular-1.6.4/angular-resource.js"
#else
                    "~/Scripts/angular-1.6.4/angular.min.js"
                    , "~/Scripts/angular-1.6.4/angular-animate.js"
                    , "~/Scripts/angular-1.6.4/angular-resource.min.js"
#endif
)
            );
            bundles.Add(new ScriptBundle("~/bundles/bootstrap")
                .Include(
                    "~/Scripts/bootstrap/ui-bootstrap-tpls-2.5.0.min.js"
                )
            );
        }

        #endregion                          //Bundle Angualrjs 1.6.4 and 3rd parthy components
    }
}
