using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Drawing.Imaging;
using SharedMembers;

namespace ClassLineService
{
    public class ScreenShotMaker
    {
        public bool Capture()
        {
            long lastUsedTimeStamp = Shared.lastUsedTimeStamp;
            try
            {
                ScreenCapture sc = new ScreenCapture();
                sc.CaptureScreenToFile(Shared.fileTable[lastUsedTimeStamp].FullFileName, ImageFormat.Png);
                //Shared.fileTable[lastUsedTimeStamp].IsInUse = true;
            }
            catch (Exception e)
            {
                throw new Exception("Could not save image file. " + e.Message);                
            }
            return true;
        }
    }
}
