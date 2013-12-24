using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using SharedMembers;
using System.ServiceModel;
using ClassLineService;
using System.Threading;

namespace ServerUI
{
    public partial class Form1 : Form
    {
        
        
        Thread thread;
        /*
        ServiceHost host;
         */
        public Form1()
        {
            InitializeComponent();
        }
        ServiceHost host = new System.ServiceModel.ServiceHost(typeof(ClassLineService.ClassLineService));
        
        private void button1_Click(object sender, EventArgs e)
        {
            //using (ServiceHost host = new System.ServiceModel.ServiceHost(typeof(ClassLineService.ClassLineService)))
            //{
                Shared shared = Shared.instance;
                Shared.CAPTURE_INTERVAL = (int)Interval.Value;
                Shared.captureFlag = true;
                ScreenShotMaker screenShotMaker = new ScreenShotMaker();
                SyncMaster syncMaster = new SyncMaster();//3, screenShotMaker);

                
                thread = new Thread(new ThreadStart(syncMaster.SyncRun));
                thread.Start();
                
                if(host.State == CommunicationState.Closed)
                    host = new System.ServiceModel.ServiceHost(typeof(ClassLineService.ClassLineService));
                host.Open();
                /*
                Console.WriteLine("Service hosted, press any key to close");
                string userCode = Console.ReadLine();
                if (userCode == "9")
                {
                    Shared.captureFlag = false;
                    new Thread(new FShandler().DeleteAllUnusedFiles).Start();
                    thread.Abort();
                }
                 * */
            //}
            /*
            using (host = new System.ServiceModel.ServiceHost(typeof(ClassLineService.ClassLineService)))
            {
                Shared shared = Shared.instance;
                ScreenShotMaker screenShotMaker = new ScreenShotMaker();
                SyncMaster syncMaster = new SyncMaster();//3, screenShotMaker);

                thread = new Thread(new ThreadStart(syncMaster.SyncRun));
                thread.Start();

                host.Open();
                //Console.WriteLine("Service hosted, press any key to close");
                //string userCode = Console.ReadLine();
                */
            
        }

        private void button2_Click(object sender, EventArgs e)
        {
            Shared.captureFlag = false;
            Thread.Sleep(500);
            new Thread(new FShandler().DeleteAllUnusedFiles).Start();
            thread.Abort();
            host.Close();
            /*
            Shared.captureFlag = false;
            new Thread(new FShandler().DeleteAllUnusedFiles).Start();
            thread.Abort();
             * */
        }

        private void folderBrowserDialog1_HelpRequest(object sender, EventArgs e)
        {

        }

        private void button3_Click(object sender, EventArgs e)
        {
            if (folderBrowserDialog1.ShowDialog() == DialogResult.OK)
            {
                textBox1.Text = folderBrowserDialog1.SelectedPath;
            }
        }
         
    }
}
