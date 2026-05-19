---
title: Outrageously Large Neural Networks - The Sparsely-Gated Mixture-of-Experts Layer
date: 2017-01-23
authors: Shazeer et al. (Google Brain)
venue: ICLR 2017
link: https://arxiv.org/abs/1701.06538
tags: [MoE, Sparse, Routing, Scaling]
math: true
---

## 一句话

把 MoE 塞进 LSTM 语言模型的层与层之间，用 noisy top-K gating 让每个 token 只激活 K 个 expert，从而把参数量推到 137B 同时保持单步算力不变。

## 方法

- Gating $G(x) = \mathrm{Softmax}(\mathrm{TopK}(W_g x + \epsilon \cdot \mathrm{Softplus}(W_{\mathrm{noise}} x), K))$，noise 项保证 expert 探索与负载均衡
- expert 是普通 FFN，最多堆到 **2048** 个，单层 MoE 嵌在 stacked LSTM 中间
- 两个 auxiliary loss：`importance loss`（每个 expert 被 gate 概率的 CV 平方）和 `load loss`（实际接收 token 数的 CV 平方）
- 在 1B Word Benchmark 和 100B 词的 Google 内部数据上训，137B 参数模型 perplexity 显著低于稠密 baseline，单 example FLOPs 仅 ~0.6B

## 想法

- 这篇把 conditional computation 从 toy 推到 production scale，后面所有 sparse expert 工作都是它的子孙。两个 aux-loss 的形式（CV²）一直沿用到 GShard / Switch
- noisy top-K 现在看是 hack：训练时靠 Gaussian noise 解 tie 和负载均衡，没有 expert capacity 的硬约束，所以全靠 loss 拉。Switch 之后基本被 capacity factor + token dropping 取代
- 没有讨论分布式 all-to-all，工程细节几乎全部留给后人；这一点 GShard 才补齐

## 引用

```bibtex
@inproceedings{shazeer2017outrageously,
  title={Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer},
  author={Shazeer, Noam and Mirhoseini, Azalia and Maziarz, Krzysztof and Davis, Andy and Le, Quoc and Hinton, Geoffrey and Dean, Jeff},
  booktitle={ICLR},
  year={2017}
}
```
