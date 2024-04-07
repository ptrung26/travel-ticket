
using System;
using System.Collections.Generic;
using System.Reflection;

namespace newPMS
{
    public static partial class CommonEnum
    {

        //public class EnumObj
        //{
        //    public int Id { get; set; }
        //    public string Name { get; set; }
        //}
        public class ItemObj<T>
        {
            public T Id { get; set; }
            public string Name { get; set; }
            public int? TotalCount { get; set; }
        }



        public static List<ItemObj<int>> EnumToList(Type TypeObject)
        {
            List<ItemObj<int>> objTemList = new List<ItemObj<int>>();
            try
            {
                foreach (object iEnumItem in Enum.GetValues(TypeObject))
                {
                    ItemObj<int> objTem = new ItemObj<int>();
                    objTem.Id = ((int)iEnumItem);
                    objTem.Name = GetEnumDisplayString(iEnumItem.GetType(), iEnumItem.ToString());
                    //objTem.Name = GetEnumDescription((Enum)iEnumItem);
                    objTemList.Add(objTem);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return objTemList;
        }
        public static string GetEnumDisplayString(Type enumType, string enumValue)
        {
            try
            {
                MemberInfo memInfo = enumType.GetMember(enumValue)[0];

                var attrs = memInfo.GetCustomAttributes(typeof(EnumDisplayString), false);
                var outString = ((EnumDisplayString)attrs[0]).DisplayString;
                return outString;
            }
            catch { }
            return enumValue.ToString();
        }

        public static string GetEnumDescription(Enum en)
        {
            Type type = en.GetType();

            try
            {
                MemberInfo[] memInfo = type.GetMember(en.ToString());

                if (memInfo != null && memInfo.Length > 0)
                {
                    object[] attrs = memInfo[0].GetCustomAttributes(typeof(EnumDisplayString), false);

                    if (attrs != null && attrs.Length > 0)
                        return ((EnumDisplayString)attrs[0]).DisplayString;
                }
            }
            catch (Exception)
            {
                return string.Empty;
            }

            return en.ToString();
        }
        public class EnumDisplayString : Attribute
        {
            public string DisplayString;

            public EnumDisplayString(string text)
            {
                this.DisplayString = text;
            }
        }



    }
}
