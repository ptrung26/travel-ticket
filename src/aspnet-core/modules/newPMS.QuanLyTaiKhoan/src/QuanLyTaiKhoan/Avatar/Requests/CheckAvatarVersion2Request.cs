using MediatR;
using OrdBaseApplication;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.Avatar
{
    public class CheckAvatarVersion2Request : IRequest<string>
    {
        public string UserId { get; set; }
    }

    public class CheckAvatarHandler : AppBusinessBase, IRequestHandler<CheckAvatarVersion2Request, string>
    {
        public async Task<string> Handle(CheckAvatarVersion2Request request, CancellationToken cancellationToken)
        {
            //Ảnh up lên chỉ có 3 kiểu đuôi
            var ImagePng = request.UserId + ".png";
            var ImageJpg = request.UserId + ".jpg";
            var ImageJpeg = request.UserId + ".jpeg";

            var PathFolder = Factory.AppSettingConfiguration.GetSection("AvatarBasePath").Value;
            var PathFileExist = "";
            if (File.Exists(Path.Combine(PathFolder, ImagePng)))
            {
                PathFileExist = Path.Combine(PathFolder, ImagePng);
            }
            else if (File.Exists(Path.Combine(PathFolder, ImageJpg)))
            {
                PathFileExist = Path.Combine(PathFolder, ImageJpg);
            }
            else if (File.Exists(Path.Combine(PathFolder, ImageJpeg)))
            {
                PathFileExist = Path.Combine(PathFolder, ImageJpeg);
            }

            return PathFileExist;
        }
    }
}
