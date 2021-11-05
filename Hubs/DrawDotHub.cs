using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class DrawDotHub : Hub
    {
        public async Task UpdateCanvas(int x, int y, int r, int g, int b)
        {
            await Clients.All.SendAsync("updateDot", x, y, r, g, b);
        }

        public async Task ClearCanvas()
        {
            await Clients.All.SendAsync("clearCanvas");
        }
    }


}