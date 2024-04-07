using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace OrdBaseApplication.Helper
{
    public static class Supportter
    {
        public static int GetAge(DateTime? ngayDe, DateTime? ngayTuVong, bool isGetNgayTuoi = false)
        {
            try
            {
                if (ngayDe == null) ngayDe = DateTime.Now;
                if (ngayTuVong == null) ngayTuVong = DateTime.Now;
                int age = 0;
                if (isGetNgayTuoi == true)
                    age = ngayTuVong.Value.Day - ngayDe.Value.Day;
                else
                    age = ngayTuVong.Value.Year - ngayDe.Value.Year;

                if (age > 0)
                {
                    age -= Convert.ToInt32(ngayTuVong.Value.Date < ngayDe.Value.Date.AddYears(age));
                }
                else
                {
                    age = 0;
                }

                return age;
            }
            catch
            {
                return 0;
            }
        }
        public static byte[] ToByteArray<T>(this T obj)
        {
            if (obj == null)
                return null;
            BinaryFormatter bf = new BinaryFormatter();
            using (MemoryStream ms = new MemoryStream())
            {
                bf.Serialize(ms, obj);
                return ms.ToArray();
            }
        }

        public static T FromByteArray<T>(this byte[] data)
        {
            if (data == null)
                return default(T);
            BinaryFormatter bf = new BinaryFormatter();
            using (MemoryStream ms = new MemoryStream(data))
            {
                object obj = bf.Deserialize(ms);
                return (T)obj;
            }
        }
    }
}
