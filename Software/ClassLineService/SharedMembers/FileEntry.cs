using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SharedMembers
{
    public class FileEntry
    {
        private long timeStamp;
        public long TimeStamp
        {
            get { return this.timeStamp; }
        }
        
        public string FullFileName
        {
            get { return Shared.IMAGE_PATH + this.timeStamp.ToString() + Shared.IMAGE_FORMAT; }
        }

        private bool isInUse;
        public bool IsInUse
        {
            get { return this.isInUse; }
            set { this.isInUse = value; }
        }

        private bool isDeleted;
        public bool IsDeleted
        {
            get { return this.isDeleted; }
            set { this.isDeleted = value; }
        }

        public FileEntry(long timeStamp)
        {
            this.timeStamp = timeStamp;
            isInUse = false;
            isDeleted = false;
        }

        private int captureCount;
        public int CaptureCount
        {
            get { return this.captureCount; }
        }
        public void CaptureCountIncrement()
        {
            this.captureCount++;
        }
    }
}
