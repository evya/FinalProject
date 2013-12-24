using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Web;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Diagnostics;
using System.Globalization;
using System.Data;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Drawing.Imaging;
using System.Threading;
using SharedMembers;

namespace ClassLineService
{
    public class ClassLineService : IClassLineService
    {

        private bool HandleHttpOptionsRequest()
        {
            WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Origin", "*");

            return WebOperationContext.Current.IncomingRequest.Method == "OPTIONS";
        }

        /// <summary>
        /// Converting an Entity from the DB to a Json string
        /// </summary>
        /// <typeparam name="T">The type of entity to convert</typeparam>
        /// <param name="entity">the entity to convert</param>
        /// <returns>Json string representation of the Entity</returns>
        public string ConvertEntity<T>(T entity)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
            using (MemoryStream stream = new MemoryStream())
            {
                serializer.WriteObject(stream, entity);
                byte[] array = stream.ToArray();
                return ASCIIEncoding.ASCII.GetString(array);
            }
        }


        /// <summary>
        /// Get a screenshot from the server
        /// </summary>
        /// <returns>a string representing the image</returns>
        [WebInvoke(Method = "*", UriTemplate = "/GetScreenshot",
           RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public string GetScreenshot()
        //public string GetScreenshot(long timeStamp)
        {
            if (HandleHttpOptionsRequest())
            {
                return string.Empty;
            }
            // TO DO : Add functionality for printscreen
            Shared.MarkFileAsUsed();
            Shared.fileTable[Shared.lastUsedTimeStamp].CaptureCountIncrement();
            return ImageToString(Shared.fileTable[Shared.lastUsedTimeStamp].FullFileName);
        }

        #region Shared table handlers
        
        public string ImageToString(string path)
        {

            if (path == null)
                throw new ArgumentNullException(path);
            Image im = Image.FromFile(path);
            MemoryStream ms = new MemoryStream();
            im.Save(ms, im.RawFormat);
            byte[] array = ms.ToArray();
            //return Convert.ToBase64String(array);
            return Convert.ToBase64String(array,Base64FormattingOptions.None);
            //return ASCIIEncoding.ASCII.GetString(Convert.ToBase64String(array,Base64FormattingOptions.None);
        }

        #endregion
    }

}