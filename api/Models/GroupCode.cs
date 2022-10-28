using System;
using System.Text;

namespace Echo.Models
{
    public class GroupCode
    {
        private const int CodeLength = 7;
        public string Value { get; }

        private static char[] _base62chars =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            .ToCharArray();

        private static Random _random = new Random();

        public GroupCode()
        {
            Value = GetBase62(CodeLength);
        }

        private static string GetBase62(int length)
        {
            var builder = new StringBuilder(length);

            for (int i = 0; i < length; i++)
                builder.Append(_base62chars[_random.Next(62)]);

            return builder.ToString();
        }
    }
}