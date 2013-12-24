using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using ClassLineService;
using System.Threading;
using SharedMembers;

namespace ClassLineServiceHost
{
  class Program
  {
    /// <summary>
    /// Hosting for the WCF service (Deploy Service)
    /// </summary>
    /// <param name="args"></param>
    static void Main(string[] args)
    {
        
        using (ServiceHost host = new System.ServiceModel.ServiceHost(typeof(ClassLineService.ClassLineService)))
        {
            Shared shared = Shared.instance;
            ScreenShotMaker screenShotMaker = new ScreenShotMaker();
            SyncMaster syncMaster = new SyncMaster();//3, screenShotMaker);

            Thread thread = new Thread(new ThreadStart(syncMaster.SyncRun));
            thread.Start();

            host.Open();
            Console.WriteLine("Service hosted, press any key to close");
            string userCode = Console.ReadLine();
            if (userCode == "9")
            {
                Shared.captureFlag = false;
                new Thread(new FShandler().DeleteAllUnusedFiles).Start();
                thread.Abort();
            }
        }
    }
  }
}
