using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Diagnostics;

namespace SharedMembers
{
    public class FShandler
    {
        private int latestEntriesToNotDeleteCount = 10;
        private List<string> filesToDeletePathsList;

        public void DeleteUnusedFiles()
        {
            int currentEntryCount = Shared.fileTable.Count;
            int filesToDeleteCount = currentEntryCount - latestEntriesToNotDeleteCount;
            filesToDeletePathsList = new List<string>();

            if (filesToDeleteCount > 0)
            {
                for (int i = 0; i < filesToDeleteCount; i++)
                {
                    if (!Shared.fileTable.ElementAt(i).Value.IsInUse && !Shared.fileTable.ElementAt(i).Value.IsDeleted)
                    {
                        try
                        {
                            File.Delete(Shared.fileTable.ElementAt(i).Value.FullFileName);                            
                        }
                        catch (Exception e)
                        {
                            throw new Exception("Could not delete file - " + Shared.fileTable.ElementAt(i).Value.FullFileName + " - " + e.Message);
                        }
                        Shared.fileTable.ElementAt(i).Value.IsDeleted = true;
                    }
                }

                foreach (string fileToDelete in filesToDeletePathsList)
                {
                    try
                    {
                        if (File.Exists(fileToDelete))
                        {
                            File.Delete(fileToDelete);
                        }
                    }
                    catch (Exception e)
                    {
                        throw new Exception("Could not delete file - " + fileToDelete + " - " + e.Message);
                    }

                }
                Shared.deleteUnusedFilesFlag = false;
            }
        }
        public void DeleteAllUnusedFiles()
        {
            foreach (KeyValuePair<long, FileEntry> keyValuePair in Shared.fileTable)
            {
                if (!keyValuePair.Value.IsInUse && !keyValuePair.Value.IsDeleted)
                {
                    try
                    {
                        File.Delete(keyValuePair.Value.FullFileName);
                    }
                    catch (Exception e)
                    {
                        throw new Exception("Could not delete file - " + keyValuePair.Value.FullFileName + " - " + e.Message);
                    }
                    keyValuePair.Value.IsDeleted = true;
                }
            }
            //Process.Start("explorer.exe", "/select" + Shared.IMAGE_PATH);
            Process.Start(Shared.IMAGE_PATH);
        }
    }
}
