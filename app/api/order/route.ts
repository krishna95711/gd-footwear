import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { customerName, customerContact, customerAddress, items, total } = await request.json();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL environment variable is missing.');
      // Return a simulated success in dev mode so it works immediately, but alert in logs
      return NextResponse.json({ 
        success: true, 
        message: 'Order simulated successfully (Discord webhook URL is not set).' 
      });
    }

    // Format a beautiful Discord Embed/Rich markdown message
    let fields = items.map((item: any, index: number) => {
      return {
        name: `📦 Item ${index + 1}: ${item.productName}`,
        value: `• **Category:** ${item.category}\n• **Size:** EU ${item.size}\n• **Color:** ${item.color}\n• **Qty:** ${item.quantity} x ₹${item.price.toFixed(2)}\n• **Subtotal:** ₹${(item.price * item.quantity).toFixed(2)}\n• [View Product](${item.productLink})`,
        inline: false
      };
    });

    const discordPayload = {
      username: "GD Footwear Orders",
      avatar_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80",
      content: "🚨 **NEW ORDER RECEIVED!**",
      embeds: [
        {
          title: "👟 GD Footwear Order details",
          color: 38706, // Emerald green hex as decimal
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: "👤 Customer Details",
              value: `• **Name:** ${customerName}\n• **Contact:** ${customerContact}\n• **Delivery Address:** ${customerAddress}`,
              inline: false
            },
            ...fields,
            {
              name: "💰 Financial Summary",
              value: `💵 **Total Amount due: ₹${total.toFixed(2)}**`,
              inline: false
            }
          ],
          footer: {
            text: "GD Footwear E-commerce Platform"
          }
        }
      ]
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: 'Order sent to Discord' });
    } else {
      const errorText = await res.text();
      console.error('Discord webhook failed response:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to deliver order to Discord' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
