# NAT Network Simulator 🌐

An interactive **Computer Networks** simulator demonstrating Network Address Translation (NAT) and the PAT/NAT-overload extension.

## Features
- Private LAN: \`192.168.1.0/24\`
- NAT router and ISP router
- Public server: \`11.1.1.2:80\`
- NAT pool reference: \`50.1.1.1–50.1.1.6\`
- PAT example using \`50.1.1.1\` with unique source ports
- Animated packet journey and return path
- NAT table with Inside Local / Inside Global mappings
- One packet per **Send Packet** click
- Multiple packets may be in flight together
- Pause/Resume and Reset

## Run
Open \`index.html\` directly in a browser, or use VS Code Live Server. No npm installation is required.

## Example PAT mapping
\`192.168.1.10:5000 → 50.1.1.1:40001\`

\`192.168.1.11:5001 → 50.1.1.1:40002\`

## Important
This is an educational visualization. It does not generate real network traffic or emulate Cisco IOS. Cisco Packet Tracer is used for actual network configuration practice.
