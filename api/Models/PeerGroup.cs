namespace Echo.Models
{
    public class PeerGroup
    {
        public string GroupName { get; }
        public string GroupCode { get; }

        public PeerGroup(string groupName, string groupCode)
        {
            GroupName = groupName;
            GroupCode = groupCode;
        }
    }
}