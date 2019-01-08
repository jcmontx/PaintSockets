using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace PaintSockets
{
    public class PaintHub : Hub
    {
        public async Task SendPoint(string points)
        {
            await Clients.All.SendAsync("ReceivePoints", points);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            await Clients.All.SendAsync("Clear");
        }
    }
}
