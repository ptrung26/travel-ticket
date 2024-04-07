using MediatR;
using OrdBaseApplication;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.Avatar.Requests
{
    public class CheckAvatarRequest : IRequest<bool>
    {
    }

    public class CheckAvatarHanlder : AppBusinessBase, IRequestHandler<CheckAvatarRequest, bool>
    {
        public async Task<bool> Handle(CheckAvatarRequest request, CancellationToken cancellationToken)
        {
            var userSession = Factory.UserSession;
            var userId = userSession.UserId.ToString();
            //Ảnh up lên chỉ có 3 kiểu đuôi
            var ImagePng = userId + ".png";
            var ImageJpg = userId + ".jpg";
            var ImageJpeg = userId + ".jpeg";

            var PathFolder = Factory.AppSettingConfiguration.GetSection("AvatarBasePath").Value;
            var PathFileDelete = "";
            if (File.Exists(Path.Combine(PathFolder, ImagePng)))
            {
                PathFileDelete = Path.Combine(PathFolder, ImagePng);
            }
            else if (File.Exists(Path.Combine(PathFolder, ImageJpg)))
            {
                PathFileDelete = Path.Combine(PathFolder, ImageJpg);
            }
            else if (File.Exists(Path.Combine(PathFolder, ImageJpeg)))
            {
                PathFileDelete = Path.Combine(PathFolder, ImageJpeg);
            }
            if (PathFileDelete != "")
            {
                File.Delete(PathFileDelete);
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
