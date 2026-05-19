---
title: MegaBlocks - Efficient Sparse Training with Mixture-of-Experts
date: 2022-11-29
authors: Gale, Narayanan, Young, Zaharia
venue: MLSys 2023
link: https://arxiv.org/abs/2211.15841
tags: [MoE, Sparse, Infra, Training]
math: true
---

## 一句话

把 MoE 的 expert 计算从 padded batched GEMM 重写成 **block-sparse GEMM**，彻底丢掉 capacity factor 和 token dropping（"dropless MoE"），GPU 利用率从 ~40% 拉到 ~70%，端到端训练比 Tutel/MS 快 **40%**，比 dense 等参快 **2.4x**。

## 方法

- 关键观察：token-to-expert 分配的不规则性导致 padded batched matmul 浪费大量算力（不同 expert 接到的 token 数差距大）
- 重新表述 expert FFN 为 block-sparse matmul：所有 expert 的权重拼成一个大矩阵 $W \in \mathbb{R}^{(e \cdot h) \times d}$，输入按 expert 分组后形成 block-sparse 输入，对应输出位置由路由决定
- 实现了定制 block-sparse GEMM kernel（基于 CUTLASS），block size 128，可以吃满 Tensor Core
- "dropless" 意味着 capacity factor = ∞，没有 token 被丢，模型质量略好（同 step perplexity 低 ~0.3）
- 配套整套 PyTorch MoE 框架（megablocks 库），后来被 OLMoE、DBRX 等开源 MoE 直接拿来用

## 想法

- MoE 工程里最被低估的一篇。它把"sparse expert 必须 drop token"的范式撕开——capacity factor 不是 MoE 的本质要求，只是为了凑 GEMM 形状的妥协
- 真正的贡献不是算法是 kernel：没有这套 block-sparse GEMM，dropless 在 GPU 上跑不起来。这也是为什么这条路线 TPU 阵营没跟进（TPU 的 XLA pad-friendly）
- 后来开源 MoE 训练栈基本绕不开 megablocks。Mixtral 的 HF 实现、OLMoE 的训练代码都依赖它

## 引用

{% raw %}
```bibtex
@inproceedings{gale2023megablocks,
  title={{MegaBlocks}: Efficient Sparse Training with Mixture-of-Experts},
  author={Gale, Trevor and Narayanan, Deepak and Young, Cliff and Zaharia, Matei},
  booktitle={MLSys},
  year={2023}
}
```
{% endraw %}
