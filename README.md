# NAT Network Simulator — Interactive NAT & PAT

A Computer Networks project that visually demonstrates Network Address Translation (NAT) and its PAT/NAT-overload extension using the Packet Tracer topology as the reference.

## Main concepts
- Private IPv4 network: `192.168.1.0/24`
- NAT router and ISP router
- Public/server network: `11.0.0.0/8`
- Dynamic NAT public pool: `50.1.1.1–50.1.1.6`
- PAT extension: `50.1.1.1` shared with unique public source ports
- Packet forwarding and return-path translation
- Inside Local / Inside Global terminology

## Interaction
- Select one PC.
- Click **Send Packet** to send exactly one packet.
- Click **Send Packet** again to send another packet. Packets can be in flight at the same time.
- Select different PCs and send again to see separate PAT mappings.
- Use Pause/Resume and Reset to inspect the packet journey.

## Important
This is an educational simulation, not a real router emulator. Cisco Packet Tracer remains the reference for actual network configuration and IOS behavior.
