---
title: Mixture-of-Experts with Expert Choice Routing
date: 2022-02-18
authors: Zhou et al. (Google)
venue: NeurIPS 2022
link: https://arxiv.org/abs/2202.09368
tags: [MoE, Sparse, Routing, Training]
math: true
---

## 一句话

把"token 选 expert"翻转成 **"expert 选 token"**：每个 expert 自己挑分数最高的固定 K 个 token，天然保证 perfect load balance，不再需要 auxiliary load-balancing loss，预训练 convergence 快 **2x**。

## 方法

- 给定 token 表征 $X \in \mathbb{R}^{n \times d}$ 与 expert gate $W_g$，算 affinity $S = \mathrm{Softmax}(X W_g)$ 然后**按列 top-K**：expert $j$ 取 $S[:, j]$ 的 top-$k$ 个 token，$k = \lceil n \cdot c / e \rceil$，$c$ 为 capacity factor，$e$ 为 expert 数
- 每个 token 实际被分到的 expert 数是变量（0、1、2、...），与 token choice 的 top-K 范式恰好对偶
- 完全去掉 aux load-balancing loss；保留一个软的 entropy 正则防止 expert collapse
- 在 8B activated / ~143B total 的 T5-style 模型上，达到同样 perplexity 比 GShard top-2 快 2x，比 Switch top-1 快 2.3x；下游 SuperGLUE 也持平或更好

## 想法

- 这是过去几年 routing 设计里最优雅的一个翻转。原本 load balancing 要靠 aux-loss 硬掰，expert choice 直接从问题结构上消掉
- 缺点也明显：训练时可以拿到整个 batch 的 affinity 矩阵，**autoregressive inference 时拿不到未来 token**，所以这个方法在 encoder / pretraining 阶段干净，decoder LM inference 就要做近似（论文里没充分讨论）
- Mixtral / DeepSeek 路线没采用 expert choice，主因就是 decoder-only LM 的 causal 限制。但在 vision / encoder-only setting 下，expert choice 应该是默认值

## 引用

```bibtex
@inproceedings{zhou2022mixture,
  title={Mixture-of-Experts with Expert Choice Routing},
  author={Zhou, Yanqi and Lei, Tao and Liu, Hanxiao and Du, Nan and Huang, Yanping and Zhao, Vincent and Dai, Andrew and Chen, Zhifeng and Le, Quoc and Laudon, James},
  booktitle={NeurIPS},
  year={2022}
}
```
