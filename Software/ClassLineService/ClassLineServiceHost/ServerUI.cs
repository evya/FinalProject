using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.ServiceModel;
using ClassLineService;
using System.Threading;

namespace SharedMembers
{
    public partial class ServerUI : Form
    {
        public ServerUI()
        {
            InitializeComponent();
            using (ServiceHost host = new System.ServiceModel.ServiceHost(typeof(ClassLineService.ClassLineService)))
            {
                Shared shared = Shared.instance;
                ScreenShotMaker screenShotMaker = new ScreenShotMaker();
                SyncMaster syncMaster = new SyncMaster();//3, screenShotMaker);

                Thread thread = new Thread(new ThreadStart(syncMaster.SyncRun));
                thread.Start();

                host.Open();
                //Console.WriteLine("Service hosted, press any key to close");
                string userCode = Console.ReadLine();
                if (userCode == "9")
                {
                    Shared.captureFlag = false;
                    new Thread(new FShandler().DeleteAllUnusedFiles).Start();
                    thread.Abort();
                }
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {

        }

    }
}
