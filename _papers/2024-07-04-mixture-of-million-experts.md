---
title: Mixture of A Million Experts
date: 2024-07-04
authors: Xu Owen He (Google DeepMind)
venue: arXiv 2407.04153
link: https://arxiv.org/abs/2407.04153
tags: [MoE, Routing, Scaling, Inference]
math: true
---

## 一句话

把 MoE 的 expert 数推到 $N = 10^6$，每个 expert 退化成一个 single-neuron MLP，用 product-key 检索把路由复杂度从 $\mathcal{O}(N)$ 降到 $\mathcal{O}(\sqrt{N})$，得到 PEER（Parameter Efficient Expert Retrieval）层。

## 方法

- 每个 expert 是一对极薄的向量 $(u_i, v_i) \in \mathbb{R}^d$，相当于 rank-1 FFN，参数量 $\approx 2d$
- 路由不直接对 $N$ 个 key 内积，而是把 query 拆成两半 $q = [q_1, q_2]$，分别在两组 $\sqrt{N}$ 个 sub-key 上 top-k，再做笛卡尔积取 top-k 全键（product key memory，沿用 Lample 2019）。$N = 10^6$ 时只要查 2×1000 个 sub-key
- top-k 后做 softmax 归一，加权求和那几个 $u_i (v_i \cdot x)$，整层等价于一个稀疏激活的极宽 MLP
- 论文做了 isoFLOP 曲线：在同算力下 PEER 的 compute-optimal perplexity 低于 dense Transformer 和传统 coarse MoE；expert 数从 $2^{14}$ 推到 $2^{20}$ 还在涨
- 配套设计有 multi-head retrieval（$h=8$）和 expert batchnorm 防止"明星 expert"垄断

## 想法

- 把 MoE 重新框成 learned key-value memory 检索，这个视角早在 Lample 的 PKM 就有，He 把它和 MoE 路由真正接上。值得对照的是 Memory Layers (Meta) 那条线，几乎是同一时间点的并行工作
- 极小 expert + 极大数量这个 regime 工程上的痛点是 sparse gather 的访存效率：1M 个 rank-1 expert 的稀疏 lookup 在 H100 上不一定打得过普通 dense FFN，论文 wall-clock 部分讲得比较含糊
- 这个范式对 lifelong learning 友好：理论上可以一直加 expert 而不动旧的，但论文没真的做 continual 实验

## 引用

```bibtex
@article{he2024mixture,
  title={Mixture of A Million Experts},
  author={He, Xu Owen},
  journal={arXiv preprint arXiv:2407.04153},
  year={2024}
}
```
