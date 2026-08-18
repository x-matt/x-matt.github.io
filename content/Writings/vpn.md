---
title: VPN
type: area
domain: work
category: internet
status: active
review:
tags:
---
**Virtual Private Network**
> 不让你的设备直接访问目标网站，而是先把流量交给一个中间服务器，再由这个服务器代你访问

|网络世界|类比|
|---|---|
|机场|出租车公司|
|节点|一辆辆出租车|
|Shadowrocket|打车 App|
|代理协议|车辆与调度的通信协议|
|订阅链接|车辆/线路清单|
|分流规则|告诉司机去哪|
|目标网站|你的目的地|

## 访问

![[vpn 2026.excalidraw#^frame=principle]]

VPN 和 Proxy 是不一样的

|对比维度|Proxy（代理）|VPN|
|---|---|---|
|**核心目的**|让特定网络连接通过代理服务器|把设备的网络连接通过 VPN 隧道转发|
|**工作层次**|通常在应用层 / 传输层|通常在网络层（IP 层）|
|**代理范围**|可以只代理某个 App / 某类流量|通常接管整个设备的 IP 流量|
|**是否需要客户端**|通常需要配置代理客户端|通常需要 VPN 客户端或系统 VPN 功能|
|**是否建立隧道**|不一定|通常会建立加密隧道|
|**是否加密**|**不一定**，取决于代理协议|通常会加密客户端 ↔ VPN 服务器之间的流量|
|**是否隐藏真实 IP**|通常可以|可以|
|**DNS 流量**|取决于代理配置|通常可以通过 VPN 隧道处理|
|**典型协议**|HTTP Proxy、SOCKS5、Shadowsocks、VLESS、Trojan|WireGuard、OpenVPN、IPsec|
|**典型客户端**|Shadowrocket、Clash、Surge|WireGuard、OpenVPN、系统 VPN|
|**典型使用场景**|科学上网、应用分流、爬虫、开发调试|企业内网、远程办公、公共 Wi-Fi 安全、全局网络接入|
|**性能**|通常开销较小，但取决于协议|加密和隧道有额外开销|
|**分流能力**|通常非常灵活，可以按域名/IP/App 分流|也可以分流，但传统 VPN 通常不是核心功能|
|**是否属于 VPN**|**不一定**|是|
|**例子**|Shadowrocket → Shadowsocks 节点|iPhone → WireGuard → VPN Server|

## TCP/IP

**TCP/IP** 的全称是：

> **TCP/IP = Transmission Control Protocol / Internet Protocol**  
> **传输控制协议 / 网际协议**

![[vpn 2026.excalidraw#^frame=flow|200]]