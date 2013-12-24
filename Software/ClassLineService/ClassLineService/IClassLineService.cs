using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;

namespace ClassLineService
{
    [ServiceContract]
    public interface IClassLineService
    {
        // Get a screenshot from the server
        [OperationContract]
        string GetScreenshot();
    }
}
