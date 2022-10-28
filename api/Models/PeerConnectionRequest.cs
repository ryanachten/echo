namespace Echo.Models
{
    public class PeerConnectionRequest
    {
        public string Sender { get; set; }
        public string GroupCode { get; set; }
        public object Data { get; set; }
    }
}