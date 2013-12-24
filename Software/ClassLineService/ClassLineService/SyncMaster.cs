using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Data;
using SharedMembers;
using System.Threading;

namespace ClassLineService
{
    public class SyncMaster
    {
        
        private const int ALLOWED_CAPTURE_TRIES = 3;
        private const int DELETE_AFTER_X_MINUTES = 1;
        private int captureCount = 0;
        public void SyncRun()
        {
            ScreenShotMaker screenShotMaker = new ScreenShotMaker();
            int captureTries = 0;
            while (true)
            {
                //busy wait while capture not allowed
                while(!Shared.captureFlag)
                {}
                if (IsTimeToCapture())
                {
                    Shared.EnterNewEntry();
                    while (!screenShotMaker.Capture())
                    {
                        if (++captureTries == ALLOWED_CAPTURE_TRIES)
                            throw new Exception("There were " + ALLOWED_CAPTURE_TRIES.ToString() + " unsuccessful capture atempts.");
                        else
                            captureTries++;
                    }
                    captureTries = 0;
                    captureCount++;

                    while (Shared.SystemTime == Shared.lastUsedTimeStamp)
                    { }

                    if (IsTimeToDelete())
                    {
                        new Thread(new FShandler().DeleteUnusedFiles).Start();
                    }
                }
            }
        }
        private bool IsTimeToCapture()
        {
            if (Shared.CAPTURE_INTERVAL != 0 && Shared.SystemTime % Shared.CAPTURE_INTERVAL != 0)
                return false;
            else
                return true;
        }

        private bool IsTimeToDelete()
        {
            if (captureCount % (20 * DELETE_AFTER_X_MINUTES) == 0)
                return true;
            else
                return false;
        }
    }
}
