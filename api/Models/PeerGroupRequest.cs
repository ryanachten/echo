namespace Echo.Models
{
    public class PeerGroupRequest
    {
        public string Sender { get; set; }
        public PeerGroup Data { get; set; }

        public PeerGroupRequest(string sender, PeerGroup data)
        {
            Sender = sender;
            Data = data;
        }
    }
}