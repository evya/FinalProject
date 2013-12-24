using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Diagnostics;
using System.IO;

namespace SharedMembers
{
    public class Shared
    {
        public static readonly Shared instance = new Shared(); 

        public static string IMAGE_PATH;
        public static string IMAGE_FORMAT;

        private static int MIL_TO_SEC;
        public static int CAPTURE_INTERVAL;
        private static Stopwatch stopwatch;

        public static long lastUsedTimeStamp;

        public static bool captureFlag;
        public static bool deleteUnusedFilesFlag;

        public static Dictionary<long, FileEntry> fileTable;

        public static long SystemTime
        {
            get
            {
                if (!stopwatch.IsRunning)
                    return 0;
                else
                    return stopwatch.ElapsedMilliseconds / MIL_TO_SEC;
            }

        }

        private Shared()
        {
            IMAGE_PATH = @"C:\Temp\SnapShots\";
            IMAGE_FORMAT = ".png";

            MIL_TO_SEC = 1000;
            //CAPTURE_INTERVAL = 3;
            stopwatch = new Stopwatch();

            lastUsedTimeStamp = 0;

            captureFlag = true;
            deleteUnusedFilesFlag = false;

            fileTable = new Dictionary<long, FileEntry>();
            stopwatch.Start();

            // Creating the temp folder
            try
            {
                Directory.CreateDirectory(IMAGE_PATH);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            

        }
        public static void EnterNewEntry()
        {
            long systemTime = SystemTime;
            fileTable.Add(systemTime, new FileEntry(systemTime));
            lastUsedTimeStamp = systemTime;
        }

        public static void MarkFileAsUsed()
        {
            Shared.fileTable[Shared.lastUsedTimeStamp].IsInUse = true;
        }
    }
}
