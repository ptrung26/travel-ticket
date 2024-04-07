using System;
using System.Collections.Generic;
using System.Text;

namespace OrdBaseApplication.Dtos.ExportFile
{
    public class ExportFileListDataFromClientDto<T>
    {
        public string SampleFile { get; set; }
        public string OutputFileNameNotExtension { get; set; }
        public OutputFileExtension OutputFileType { get; set; }
        public List<T> ListData { get; set; }
    }
}
