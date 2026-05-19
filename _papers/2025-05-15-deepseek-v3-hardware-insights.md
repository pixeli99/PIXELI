---
title: "Insights into DeepSeek-V3: Scaling Challenges and Reflections on Hardware for AI Architectures"
date: 2025-05-15
authors: DeepSeek-AI
venue: ISCA 2025 (Industry Track)
link: https://arxiv.org/abs/2505.09343
tags: [Infra, DeepSeek, Quantization, MoE, Scaling]
math: false
---

## 一句话

V3 训练完之后回头写的 hardware co-design 复盘：在 2048 张 H800 上做到这个规模，靠的是 MLA、MoE、FP8、多平面网络，并对未来硬件提了一堆 wishlist。

## 方法

四个工程支柱：

- **MLA 省 KV cache**：长上下文 inference 时 KV cache 是显存大头，MLA 的 latent 缓存把单 token KV 体积从 MHA 的几百 KB 量级压到几十 KB。
- **DeepSeekMoE + Auxiliary-loss-free routing**：通信/计算 trade-off 的关键，活参 37B 让单 step 的 FLOPs 可控。
- **FP8 mixed precision**：H800 的 FP8 算力翻倍但 outlier 很难压；解决方案是 blockwise / tile-wise scaling + 关键路径保 BF16。
- **Multi-Plane Network Topology**：跨节点 all-to-all 拆到多个独立 IB plane，再叠 NVLink，减小 incast 拥塞——这是 H800 NVLink 带宽被砍后的补丁。

对未来硬件的反思（"if I were designing the next chip"）：

- 精确低精度算子（FP8 累加链上的舍入应该走更精细的 scaling 而不是 per-tensor）
- Scale-up 和 scale-out 的融合，NVLink 域和 IB 域之间不要切得这么明显
- 低延迟 collective 原语，专门服务 MoE 的 all-to-all
- 大容量 HBM / SeDRAM 之类的内存层级

## 想法

这篇与其说是论文不如说是给硬件厂的需求文档，胜在每条 wishlist 都对应 V3 训练中真实踩过的坑——比 vendor 自己写的 white paper 可信。

最有意思的判断是他们公开承认 H800 NVLink 被阉割后必须用多平面 IB 救场，相当于把"出口管制 → 网络拓扑 → 模型架构"这条因果链摊开给所有人看。Multi-plane 拓扑这一段技术细节其实是 V3 能在 H800 上跑通的隐藏前提。

没说服我的地方：他们对 SeDRAM 之类新型内存的引用偏乐观，实际良率和成本 paper 没碰。下一步该看：V3.2 之后是否会再写一篇"hardware insights for sparse attention era"——稀疏 attention 把瓶颈从 KV 带宽挪到 indexer 计算，结构性 trade-off 完全变了。

## 引用

```bibtex
@inproceedings{deepseek2025hardware,
  title     = {Insights into DeepSeek-V3: Scaling Challenges and Reflections on Hardware for AI Architectures},
  author    = {{DeepSeek-AI}},
  booktitle = {Proceedings of the 52nd Annual International Symposium on Computer Architecture (ISCA)},
  year      = {2025}
}
```
